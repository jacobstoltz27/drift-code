"""
Drift — Backend (FastAPI + MongoDB)
Social travel discovery + AI planning. NOT a booking platform.
"""
import os
import uuid
import json
import logging
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional, Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("drift")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# ---------------- Mongo ----------------
client: AsyncIOMotorClient
db = None


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------- Models ----------------
class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    onboarded: bool = False
    is_premium: bool = False
    preferences: Dict[str, Any] = Field(default_factory=dict)
    stats: Dict[str, Any] = Field(default_factory=dict)
    visited_countries: List[str] = Field(default_factory=list)
    created_at: str


class RegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class OnboardingPrefs(BaseModel):
    travel_frequency: Optional[str] = None
    age_range: Optional[str] = None
    budget: Optional[str] = None
    companions: Optional[str] = None
    interests: List[str] = Field(default_factory=list)


class TripCreate(BaseModel):
    destination: str
    country: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    image_url: Optional[str] = None
    companions: List[Dict[str, str]] = Field(default_factory=list)
    score: Optional[int] = None
    bucket: str = "upcoming"  # upcoming | past | saved | stolen
    summary: Optional[str] = None
    itinerary: Optional[Dict[str, Any]] = None
    original_id: Optional[str] = None
    creator: Optional[Dict[str, str]] = None


class ScheduleBody(BaseModel):
    start_date: str
    end_date: str


class UpgradeBody(BaseModel):
    plan: str  # "monthly" | "annual"


class Trip(TripCreate):
    id: str
    user_id: str
    created_at: str


class FeedPost(BaseModel):
    id: str
    creator: Dict[str, str]
    title: str
    destination: str
    image_url: str
    score: int
    summary: str
    days: int
    saves: int
    likes: int
    bucket: str = "feed"
    itinerary: Optional[Dict[str, Any]] = None
    tags: List[str] = Field(default_factory=list)


class PlannerRequest(BaseModel):
    prompt: str
    destination: Optional[str] = None
    days: Optional[int] = None
    budget: Optional[str] = None
    travelers: Optional[int] = None


class GenerateScoreRequest(BaseModel):
    destination: str
    interests: List[str] = Field(default_factory=list)
    budget: Optional[str] = None


# ---------------- Helpers ----------------
def hash_password(p: str) -> str:
    return pwd_context.hash(p)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


def create_access_token(sub: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": sub, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def user_doc_to_public(doc: dict) -> UserPublic:
    return UserPublic(
        id=doc["id"],
        email=doc["email"],
        name=doc.get("name", ""),
        avatar_url=doc.get("avatar_url"),
        bio=doc.get("bio"),
        onboarded=doc.get("onboarded", False),
        is_premium=doc.get("is_premium", False),
        preferences=doc.get("preferences", {}),
        stats=doc.get("stats", {}),
        visited_countries=doc.get("visited_countries", []),
        created_at=doc.get("created_at", utcnow_iso()),
    )


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise JWTError("missing sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------- AI Planner ----------------
ITINERARY_SYSTEM_PROMPT = """You are Drift's elite AI travel advisor — think Condé Nast Traveler concierge meets local-fixer.
You craft EXTREMELY DETAILED multi-day itineraries that feel hand-built by an obsessive expert.

CRITICAL RULES:
- You NEVER mention booking, reservations, payments, hotels-as-bookings, or purchase steps. Drift is NOT a booking platform.
- You DO recommend specific real places (with neighborhoods), restaurants (real names), hidden gems, transport, costs, local tips.
- Each day MUST have Morning, Afternoon, Evening blocks. Put 3 to 4 activities per block (NOT fewer, NOT more).
- Honor the user's requested number of days exactly (1-7). Honor their budget (scale costs proportionally).
- Output STRICT JSON only. No prose outside JSON. No markdown code fences.

JSON schema (return ONE object, this exact shape):
{
  "destination": str,
  "country": str,
  "summary": str,                       // 2-3 sentence cinematic pitch
  "trip_score": int,                    // 0-100 Drift proprietary score
  "best_time": str,                     // when to visit
  "total_estimated_cost_usd": int,
  "budget_breakdown": [
    {"category": "Flights",    "amount": int, "pct": int},
    {"category": "Stay",       "amount": int, "pct": int},
    {"category": "Activities", "amount": int, "pct": int},
    {"category": "Food",       "amount": int, "pct": int},
    {"category": "Transport",  "amount": int, "pct": int}
  ],
  "days": [
    {
      "day": int,
      "title": str,                     // "Day theme — Neighborhood, City"
      "morning":   [ {"time": "08:00", "activity": str, "detail": str, "cost_usd": int, "tip": str}, ... 3-4 items ],
      "afternoon": [ ... 3-4 items ... ],
      "evening":   [ ... 3-4 items ... ],
      "transport": str,                 // how you move that day, with prices
      "hidden_gem": str,                // 1 insider spot most tourists miss
      "weather_tip": str,               // what to wear / pack that day
      "alternative": str                // a swap if weather/closed
    }
  ],
  "packing_tips": [str, str, str, str, str],   // exactly 5 specific tips
  "local_phrases": [
    {"phrase": str, "meaning": str},
    {"phrase": str, "meaning": str},
    {"phrase": str, "meaning": str}
  ]
}

Be specific (real place names, real streets, real restaurant names). Keep "detail" strings under 180 chars, "tip" under 120 chars. Return ONE JSON object only."""


async def call_claude_for_itinerary(user_prompt: str) -> Dict[str, Any]:
    """Call Claude Sonnet 4.5 via emergentintegrations to produce structured itinerary JSON."""
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"drift-planner-{uuid.uuid4()}",
        system_message=ITINERARY_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    resp = await chat.send_message(UserMessage(text=user_prompt))
    text = resp if isinstance(resp, str) else getattr(resp, "content", str(resp))
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Claude returned no JSON: {text[:200]}")
    payload = cleaned[start : end + 1]
    return json.loads(payload)


async def call_claude_for_days_chunk(
    destination: str,
    country: Optional[str],
    interests: str,
    budget: str,
    travelers: int,
    start_day: int,
    end_day: int,
    overall_context: str,
) -> List[Dict[str, Any]]:
    """Generate only the `days` array for a contiguous chunk (e.g. days 8-14).
    Returns a list of day objects with the same schema as the main itinerary."""
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    system = (
        "You generate ONLY a JSON array of days for a Drift itinerary. "
        "Each day MUST have Morning/Afternoon/Evening blocks with EXACTLY 4 timed activities each "
        "(time, activity, detail, travel_time, cost_usd, tip). Each day also has transport, hidden_gem, "
        "weather_tip, alternative. Be specific (real place names). Return STRICT JSON: a top-level "
        '{"days": [ ... ]} object. NO prose, NO code fences.'
    )
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"drift-planner-chunk-{uuid.uuid4()}",
        system_message=system,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")
    prompt = (
        f"Destination: {destination}, {country or ''}. Travelers: {travelers}. "
        f"Budget: {budget}. Interests: {interests}. Context: {overall_context}. "
        f"Generate days {start_day} through {end_day} (numbered exactly that way). "
        f"Return only {{\"days\": [...]}}."
    )
    resp = await chat.send_message(UserMessage(text=prompt))
    text = resp if isinstance(resp, str) else getattr(resp, "content", str(resp))
    cleaned = text.strip().strip("`")
    if cleaned.startswith("json"):
        cleaned = cleaned[4:].strip()
    s, e = cleaned.find("{"), cleaned.rfind("}")
    if s == -1 or e == -1:
        raise ValueError(f"chunk returned no JSON: {text[:200]}")
    obj = json.loads(cleaned[s : e + 1])
    return obj.get("days", [])


# ---------------- App lifecycle ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.trips.create_index("user_id")
    await db.trips.create_index("id", unique=True)
    await db.feed.create_index("id", unique=True)
    await db.planner_jobs.create_index("id", unique=True)
    await db.planner_jobs.create_index("user_id")
    await db.following_feed.create_index("id", unique=True)
    await seed_demo_data()
    logger.info("Drift backend started.")
    yield
    client.close()


app = FastAPI(title="Drift API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


# ---------------- Seed ----------------
DEMO_FEED = [
    {
        "id": "feed-bali-1",
        "creator": {"id": "c-jack", "name": "Jack Morris", "handle": "@jackmorris", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"},
        "title": "7 DAYS IN BALI",
        "destination": "Bali, Indonesia",
        "image_url": "https://images.unsplash.com/photo-1711609110590-5ad5c4599e56?w=1200&q=85",
        "score": 94,
        "summary": "The perfect mix of adventure, culture, and relaxation. Some of my favorite spots from this trip.",
        "days": 7,
        "saves": 1243,
        "likes": 5482,
        "tags": ["Beaches", "Culture", "Hidden Gems"],
    },
    {
        "id": "feed-maldives-1",
        "creator": {"id": "c-lauren", "name": "Lauren Bullen", "handle": "@gypsea_lust", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"},
        "title": "Maldives Overwater Escape",
        "destination": "Maldives",
        "image_url": "https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "score": 97,
        "summary": "Waking up in paradise. Nothing beats the Maldives!",
        "days": 5,
        "saves": 8721,
        "likes": 24300,
        "tags": ["Luxury", "Beaches", "Wellness"],
    },
    {
        "id": "feed-iceland-1",
        "creator": {"id": "c-alex", "name": "Alex Strohl", "handle": "@alexstrohl", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"},
        "title": "Wild Iceland in 6 Days",
        "destination": "Iceland",
        "image_url": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=85",
        "score": 91,
        "summary": "Glaciers, geysers, and the northern lights. A photographer's dream loop.",
        "days": 6,
        "saves": 3120,
        "likes": 11800,
        "tags": ["Mountains", "Adventure", "Hidden Gems"],
    },
    {
        "id": "feed-amalfi-1",
        "creator": {"id": "c-murad", "name": "Murad Osmann", "handle": "@muradosmann", "avatar": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80"},
        "title": "Amalfi Coast in 5 Days",
        "destination": "Positano, Italy",
        "image_url": "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?w=1200&q=85",
        "score": 92,
        "summary": "Cliffside villages, lemon groves, and the bluest water you've ever seen.",
        "days": 5,
        "saves": 5102,
        "likes": 17220,
        "tags": ["Luxury", "Food", "Hidden Gems"],
    },
    {
        "id": "feed-japan-1",
        "creator": {"id": "c-lori", "name": "Lori LeBlanc", "handle": "@loriLeBlanc", "avatar": "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&q=80"},
        "title": "Kyoto + Tokyo Winter",
        "destination": "Japan",
        "image_url": "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85",
        "score": 95,
        "summary": "Temples in snow, ramen at midnight, and neon Shinjuku nights.",
        "days": 9,
        "saves": 9420,
        "likes": 28100,
        "tags": ["Culture", "Food", "Adventure"],
    },
    {
        "id": "feed-peru-1",
        "creator": {"id": "c-jack", "name": "Jack Morris", "handle": "@jackmorris", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"},
        "title": "Machu Picchu Trek",
        "destination": "Peru",
        "image_url": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85",
        "score": 89,
        "summary": "4-day Inca trail with hidden ruins and condor sightings.",
        "days": 7,
        "saves": 2890,
        "likes": 9100,
        "tags": ["Mountains", "Adventure", "Culture"],
    },
    {
        "id": "feed-santorini-1",
        "creator": {"id": "c-lauren", "name": "Lauren Bullen", "handle": "@gypsea_lust", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"},
        "title": "Santorini Sunsets",
        "destination": "Santorini, Greece",
        "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85",
        "score": 93,
        "summary": "White domes, blue seas, and the world's most photographed sunsets.",
        "days": 4,
        "saves": 6210,
        "likes": 19800,
        "tags": ["Luxury", "Beaches", "Food"],
    },
    {
        "id": "feed-norway-1",
        "creator": {"id": "c-alex", "name": "Alex Strohl", "handle": "@alexstrohl", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"},
        "title": "Norwegian Fjords",
        "destination": "Norway",
        "image_url": "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=1200&q=85",
        "score": 90,
        "summary": "Driving the Atlantic Road, kayaking deep fjords, and chasing waterfalls.",
        "days": 8,
        "saves": 2150,
        "likes": 7320,
        "tags": ["Mountains", "Adventure"],
    },
]

DEMO_UPCOMING = [
    {
        "destination": "Tokyo, Japan",
        "country": "Japan",
        "start_date": "2026-09-14",
        "end_date": "2026-09-23",
        "image_url": "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85",
        "companions": [
            {"name": "Mia", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"},
            {"name": "Jules", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"},
        ],
        "score": 94,
        "bucket": "upcoming",
        "summary": "Cherry blossoms in Shinjuku + ramen tour in Shibuya.",
    },
    {
        "destination": "Lisbon, Portugal",
        "country": "Portugal",
        "start_date": "2026-11-02",
        "end_date": "2026-11-09",
        "image_url": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85",
        "companions": [
            {"name": "Sam", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"},
        ],
        "score": 88,
        "bucket": "upcoming",
        "summary": "Trams, tiles, and Atlantic seafood.",
    },
]


DEMO_FOLLOWING_FEED = [
    {
        "id": "fol-1",
        "kind": "trip",
        "creator": {"id": "c-jack", "name": "Jack Morris", "handle": "@jackmorris", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", "verified": True, "role": "Creator"},
        "image_url": "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?w=1200&q=85",
        "destination": "Positano, Italy",
        "text": "Just back from the Amalfi Coast — Da Adolfo lunch was unreal. Drop your hidden gems below!",
        "likes": 1843,
        "comments": 92,
        "saves": 412,
        "time_ago": "2h",
    },
    {
        "id": "fol-2",
        "kind": "photo",
        "creator": {"id": "c-lauren", "name": "Lauren Bullen", "handle": "@gypsea_lust", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", "verified": True, "role": "Influencer"},
        "image_url": "https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "destination": "Maldives",
        "text": "Sunrise from the overwater villa. Worth the 22-hour journey.",
        "likes": 9214,
        "comments": 320,
        "saves": 2102,
        "time_ago": "5h",
    },
    {
        "id": "fol-3",
        "kind": "recommendation",
        "creator": {"id": "c-mia", "name": "Mia Chen", "handle": "@miawanders", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80", "verified": False, "role": "Friend"},
        "image_url": "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85",
        "destination": "Tokyo, Japan",
        "text": "Pro tip for Tokyo: skip Tsukiji and head to Toyosu's Sushi Dai at 6am. 90-min wait, life-changing.",
        "likes": 412,
        "comments": 28,
        "saves": 84,
        "time_ago": "1d",
    },
    {
        "id": "fol-4",
        "kind": "itinerary",
        "creator": {"id": "c-guide-tomas", "name": "Tomás Verified Guide", "handle": "@tomas.lisboa", "avatar": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80", "verified": True, "role": "Verified Guide"},
        "image_url": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85",
        "destination": "Lisbon, Portugal",
        "text": "I just published my 5-day Lisbon foodie itinerary — pastéis, fado, miradouros. Steal it 🤙",
        "likes": 671,
        "comments": 41,
        "saves": 233,
        "time_ago": "1d",
    },
    {
        "id": "fol-5",
        "kind": "update",
        "creator": {"id": "c-alex", "name": "Alex Strohl", "handle": "@alexstrohl", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80", "verified": True, "role": "Creator"},
        "image_url": "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=1200&q=85",
        "destination": "Lofoten, Norway",
        "text": "Heading to the Lofoten Islands tomorrow for 10 days of fjords. Any local recs?",
        "likes": 2103,
        "comments": 154,
        "saves": 67,
        "time_ago": "2d",
    },
    {
        "id": "fol-6",
        "kind": "photo",
        "creator": {"id": "c-jules", "name": "Jules Marquez", "handle": "@julesmarquez", "avatar": "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&q=80", "verified": False, "role": "Friend"},
        "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85",
        "destination": "Santorini, Greece",
        "text": "Oia at golden hour. Worth every euro.",
        "likes": 521,
        "comments": 19,
        "saves": 38,
        "time_ago": "3d",
    },
]


def _make_template_itinerary(dest: str, country: str, days: int, score: int, image_url: str) -> Dict[str, Any]:
    """Build a default, fully-populated itinerary skeleton for a seeded feed post.
    Users can Remix-with-AI to get a richer Claude-generated version."""
    activity_pool = {
        "morning": [
            ("08:00", "Sunrise coffee", "Local cafe", "Start at a local roastery with the city slowly waking up.", 8, "Order whatever the barista is brewing — it's never on the menu.", "food"),
            ("09:30", "Old town walk", "Old town", "Wander the historic core before crowds arrive.", 0, "Bring a refillable bottle — fountains in the old town are drinkable.", "walk"),
            ("11:00", "Signature attraction", "City center", "The icon of the trip — go early to beat lines.", 18, "Side entrance on the east side is usually empty.", "attraction"),
            ("12:30", "Market lunch", "Central market", "Eat what the locals eat at the central market.", 14, "Look for the stall with the longest queue.", "food"),
        ],
        "afternoon": [
            ("14:00", "Cultural site", "Museum quarter", "Museum or gallery that locals actually visit.", 16, "Free entry on the first Sunday — the cafe is worth the visit alone.", "culture"),
            ("15:30", "Scenic viewpoint", "Hilltop", "Hike up for the panorama everyone misses.", 0, "Late afternoon light is best for photos.", "view"),
            ("17:00", "Boutique browse", "Design district", "Independent shops in a creative neighborhood.", 0, "Most close by 19:00 — go now.", "shopping"),
            ("18:00", "Sunset spot", "Waterfront", "Grab a glass of wine and stay till the lights come on.", 12, "Tip generously — you'll get a longer pour.", "view"),
        ],
        "evening": [
            ("20:00", "Dinner at a local favorite", "Old town", "A small plates spot loved by chefs on their nights off.", 38, "Order the off-menu special — just ask.", "food"),
            ("21:30", "Live music or bar", "Music quarter", "Intimate venue with the city's best local musicians.", 14, "Cash is faster than card at the door.", "bar"),
            ("23:00", "Late-night walk", "Old town", "The illuminated landmarks at night, almost empty.", 0, "Wear layers — temperature drops fast.", "walk"),
            ("23:45", "Nightcap", "Speakeasy", "Cocktail bar tucked behind a nondescript door.", 18, "Ask the bartender for their 'off-list' creation.", "bar"),
        ],
    }
    insights = [
        f"Today is walk-heavy in {dest.split(',')[0]}. Wear comfortable shoes.",
        f"Plan for slower mornings — {dest.split(',')[0]} comes alive after 10am.",
        f"Catch the sunset — it's the cinematic moment of the day in {dest.split(',')[0]}.",
        f"This is your photo day — golden hour is non-negotiable.",
        f"Coffee-and-pastry crawl day. Pace yourself.",
        f"Local market day — go hungry, bring small bills.",
        f"Wind-down day — keep it slow, soak it in.",
    ]
    crowds = ["Low", "Moderate", "Moderate", "High", "Moderate", "Low", "Moderate"]
    days_arr: List[Dict[str, Any]] = []
    for i in range(1, days + 1):
        days_arr.append({
            "day": i,
            "title": f"Day {i} — {dest.split(',')[0]}",
            "drift_insight": insights[(i - 1) % len(insights)],
            "weather": {"temp_low_f": 64 + (i % 4), "temp_high_f": 76 + (i % 5), "condition": "Partly Cloudy"},
            "crowd_level": crowds[(i - 1) % len(crowds)],
            "crowd_note": "Some popular spots busy, but easy to navigate.",
            "morning":   [{"time": t, "activity": a, "location": loc, "detail": d, "travel_time": "15 min walk", "cost_usd": c, "tip": tip, "category": cat} for (t, a, loc, d, c, tip, cat) in activity_pool["morning"]],
            "afternoon": [{"time": t, "activity": a, "location": loc, "detail": d, "travel_time": "10 min metro", "cost_usd": c, "tip": tip, "category": cat} for (t, a, loc, d, c, tip, cat) in activity_pool["afternoon"]],
            "evening":   [{"time": t, "activity": a, "location": loc, "detail": d, "travel_time": "5 min walk", "cost_usd": c, "tip": tip, "category": cat} for (t, a, loc, d, c, tip, cat) in activity_pool["evening"]],
            "transport": "Mostly walking + 24-hour metro pass ($8). Taxis $6-$10 in-center.",
            "hidden_gem": f"A small rooftop bar behind the main square in {dest.split(',')[0]} — locals only.",
            "weather_tip": "Layered outfits work — afternoons get warm, evenings cool by the water.",
            "alternative": "If it rains: swap the viewpoint for the contemporary art museum.",
            "alternatives": [
                {"kind": "Luxury",    "title": "Fine dining & private tour",    "detail": "Swap lunch for a Michelin spot, add a private driver."},
                {"kind": "Budget",    "title": "Save money with locals",        "detail": "Eat at family-run trattorias, skip paid attractions."},
                {"kind": "Adventure", "title": "Add more adventure",            "detail": "Sea kayak, sunset hike, or scuba dive instead of museums."},
            ],
        })
    total = max(800, days * 220)
    return {
        "destination": dest,
        "country": country,
        "summary": f"A {days}-day cinematic loop through {dest}, balancing icons with under-the-radar locals' favorites. Remix with AI for a fully personalized version.",
        "trip_score": score,
        "score_label": "Excellent Match" if score >= 90 else "Great Match" if score >= 80 else "Good Match",
        "best_time": "Shoulder season (Apr-May or Sep-Oct) for great weather and fewer crowds.",
        "total_estimated_cost_usd": total,
        "vibes": ["Romantic", "Ocean View", "Relaxing", "Luxury"],
        "budget_breakdown": [
            {"category": "Flights",    "amount": int(total * 0.30), "pct": 30},
            {"category": "Hotels",     "amount": int(total * 0.42), "pct": 42},
            {"category": "Activities", "amount": int(total * 0.13), "pct": 13},
            {"category": "Food",       "amount": int(total * 0.10), "pct": 10},
            {"category": "Transport",  "amount": int(total * 0.05), "pct": 5},
        ],
        "days": days_arr,
        "packing_tips": [
            "Lightweight rain shell — the weather flips fast.",
            "Comfortable walking shoes you've already broken in.",
            "A power adapter that handles your home plug type.",
            "Small cross-body bag for cash + passport.",
            "Reusable water bottle (most tap water is fine).",
        ],
        "local_phrases": [
            {"phrase": "Hello", "meaning": "Universal greeting"},
            {"phrase": "Thank you", "meaning": "Always appreciated"},
            {"phrase": "Where is...?", "meaning": "Lifesaver phrase"},
        ],
    }


async def seed_demo_data():
    # Seed following feed
    for item in DEMO_FOLLOWING_FEED:
        await db.following_feed.update_one({"id": item["id"]}, {"$setOnInsert": item}, upsert=True)
    # Seed feed
    for item in DEMO_FEED:
        item_with_itin = dict(item)
        if "itinerary" not in item_with_itin:
            item_with_itin["itinerary"] = _make_template_itinerary(
                dest=item["destination"],
                country=item["destination"].split(",")[-1].strip(),
                days=item["days"],
                score=item["score"],
                image_url=item["image_url"],
            )
        await db.feed.update_one({"id": item["id"]}, {"$set": item_with_itin}, upsert=True)

    # Seed demo user
    demo_email = os.environ.get("DEMO_EMAIL", "demo@drift.app")
    demo_pw = os.environ.get("DEMO_PASSWORD", "DriftDemo123!")
    existing = await db.users.find_one({"email": demo_email}, {"_id": 0})
    if not existing:
        uid = str(uuid.uuid4())
        await db.users.insert_one(
            {
                "id": uid,
                "email": demo_email,
                "name": "Alex Johnson",
                "hashed_password": hash_password(demo_pw),
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
                "bio": "Travel enthusiast • Photography • Collecting moments, not things.",
                "onboarded": True,
                "is_premium": False,
                "visited_countries": [
                    "JP", "ID", "IT", "GR", "PT", "FR", "ES", "TH", "VN", "PE",
                    "MX", "US", "CA", "AR", "BR", "ZA", "MA", "AE",
                ],
                "preferences": {
                    "travel_frequency": "2-4 times per year",
                    "age_range": "25-34",
                    "budget": "$1,500 - $3,000",
                    "companions": "Friends",
                    "interests": ["Beaches", "Food", "Adventure", "Culture"],
                },
                "stats": {
                    "trips": 23,
                    "countries": 18,
                    "cities": 42,
                    "followers": 1200,
                    "stolen_count": 7,
                    "shared_count": 12,
                    "travel_days": 184,
                    "trip_score": 92,
                },
                "created_at": utcnow_iso(),
            }
        )
        existing_id = uid
    else:
        existing_id = existing["id"]

    # Seed upcoming trips for demo user
    count = await db.trips.count_documents({"user_id": existing_id, "bucket": "upcoming"})
    if count == 0:
        for t in DEMO_UPCOMING:
            days = 7
            try:
                from datetime import datetime as _dt
                sd = _dt.fromisoformat(t["start_date"])
                ed = _dt.fromisoformat(t["end_date"])
                days = max(1, (ed - sd).days)
            except Exception:
                pass
            await db.trips.insert_one(
                {
                    **t,
                    "id": str(uuid.uuid4()),
                    "user_id": existing_id,
                    "created_at": utcnow_iso(),
                    "itinerary": _make_template_itinerary(
                        dest=t["destination"],
                        country=t.get("country") or t["destination"].split(",")[-1].strip(),
                        days=days,
                        score=t.get("score", 90),
                        image_url=t["image_url"],
                    ),
                }
            )


# ---------------- Routes ----------------
@api.get("/")
async def root():
    return {"app": "Drift", "ok": True}


# --- Auth
@api.post("/auth/register", response_model=TokenResponse)
async def register(body: RegisterBody):
    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid,
        "email": body.email,
        "name": body.name,
        "hashed_password": hash_password(body.password),
        "avatar_url": None,
        "bio": None,
        "onboarded": False,
        "preferences": {},
        "stats": {
            "trips": 0,
            "countries": 0,
            "cities": 0,
            "followers": 0,
            "stolen_count": 0,
            "shared_count": 0,
            "travel_days": 0,
            "trip_score": 0,
        },
        "created_at": utcnow_iso(),
    }
    await db.users.insert_one(doc)
    token = create_access_token(uid)
    return TokenResponse(access_token=token, user=user_doc_to_public(doc))


@api.post("/auth/login", response_model=TokenResponse)
async def login(body: LoginBody):
    user = await db.users.find_one({"email": body.email}, {"_id": 0})
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user["id"])
    return TokenResponse(access_token=token, user=user_doc_to_public(user))


@api.get("/auth/me", response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return user_doc_to_public(user)


@api.post("/auth/onboarding", response_model=UserPublic)
async def save_onboarding(prefs: OnboardingPrefs, user=Depends(get_current_user)):
    pref_dict = {k: v for k, v in prefs.model_dump().items() if v is not None}
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"preferences": pref_dict, "onboarded": True}},
    )
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return user_doc_to_public(updated)


# --- Feed
@api.get("/feed")
async def get_feed(user=Depends(get_current_user)):
    posts = await db.feed.find({}, {"_id": 0}).to_list(50)
    return {"posts": posts}


@api.get("/feed/{post_id}")
async def get_feed_post(post_id: str, user=Depends(get_current_user)):
    post = await db.feed.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(404, "Not found")
    return post


# --- Trips (Upcoming / Past / Saved / Stolen)
@api.get("/trips")
async def list_trips(bucket: Optional[str] = None, user=Depends(get_current_user)):
    q: Dict[str, Any] = {"user_id": user["id"]}
    if bucket:
        q["bucket"] = bucket
    trips = await db.trips.find(q, {"_id": 0}).to_list(200)
    return {"trips": trips}


@api.post("/trips")
async def create_trip(body: TripCreate, user=Depends(get_current_user)):
    doc = {
        **body.model_dump(),
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "created_at": utcnow_iso(),
    }
    await db.trips.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.get("/trips/{trip_id}")
async def get_trip(trip_id: str, user=Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(404, "Trip not found")
    return trip


@api.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str, user=Depends(get_current_user)):
    res = await db.trips.delete_one({"id": trip_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(404, "Trip not found")
    return {"ok": True}


@api.post("/trips/{trip_id}/schedule")
async def schedule_trip(trip_id: str, body: ScheduleBody, user=Depends(get_current_user)):
    """Promote a saved/stolen trip into an upcoming trip with dates."""
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(404, "Trip not found")
    await db.trips.update_one(
        {"id": trip_id, "user_id": user["id"]},
        {
            "$set": {
                "bucket": "upcoming",
                "start_date": body.start_date,
                "end_date": body.end_date,
            }
        },
    )
    updated = await db.trips.find_one(
        {"id": trip_id, "user_id": user["id"]}, {"_id": 0}
    )
    return updated


# --- Following feed (Home)
@api.get("/following/feed")
async def get_following_feed(user=Depends(get_current_user)):
    posts = await db.following_feed.find({}, {"_id": 0}).to_list(50)
    return {"posts": posts}


# --- Subscription (mock — Drift is not a booking platform; Plus is the only paid product)
PLANS = {
    "monthly": {"id": "monthly", "name": "Monthly", "price": 8.99, "interval": "month"},
    "annual": {
        "id": "annual",
        "name": "Annual",
        "price": 7.19,
        "interval": "month",
        "billed": 86.28,
        "save": 21.6,
        "save_pct": 20,
    },
}


@api.get("/subscription/plans")
async def list_plans(user=Depends(get_current_user)):
    return {"plans": PLANS, "is_premium": user.get("is_premium", False)}


@api.post("/subscription/upgrade")
async def upgrade(body: UpgradeBody, user=Depends(get_current_user)):
    """Mock upgrade — flips is_premium = True. No real payment processed."""
    if body.plan not in PLANS:
        raise HTTPException(400, "invalid plan")
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"is_premium": True, "plan": body.plan, "upgraded_at": utcnow_iso()}},
    )
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return user_doc_to_public(updated)


# --- Save / Steal / Remix
@api.post("/feed/{post_id}/save")
async def save_post(post_id: str, user=Depends(get_current_user)):
    post = await db.feed.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(404, "Not found")
    # idempotent: prevent duplicate save for same original_id
    existing = await db.trips.find_one(
        {"user_id": user["id"], "original_id": post_id, "bucket": "saved"}, {"_id": 0}
    )
    if existing:
        return existing
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "destination": post["destination"],
        "country": post["destination"].split(",")[-1].strip(),
        "image_url": post["image_url"],
        "score": post["score"],
        "summary": post["summary"],
        "bucket": "saved",
        "original_id": post_id,
        "creator": post.get("creator"),
        "companions": [],
        "created_at": utcnow_iso(),
        "itinerary": post.get("itinerary"),
    }
    await db.trips.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.post("/feed/{post_id}/steal")
async def steal_post(post_id: str, user=Depends(get_current_user)):
    # Premium gate — Steal Itinerary is a Drift Plus feature
    if not user.get("is_premium", False):
        raise HTTPException(status_code=402, detail="premium_required")
    post = await db.feed.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(404, "Not found")
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "destination": post["destination"],
        "country": post["destination"].split(",")[-1].strip(),
        "image_url": post["image_url"],
        "score": post["score"],
        "summary": post["summary"],
        "bucket": "stolen",
        "original_id": post_id,
        "creator": post.get("creator"),
        "companions": [],
        "created_at": utcnow_iso(),
        "itinerary": post.get("itinerary"),
    }
    await db.trips.insert_one(doc)
    # bump user stat
    await db.users.update_one({"id": user["id"]}, {"$inc": {"stats.stolen_count": 1}})
    doc.pop("_id", None)
    return doc


class RemixBody(BaseModel):
    trip_id: str
    note: str


async def _run_remix_job(job_id: str, user_id: str, base_trip: dict, note: str):
    try:
        base = base_trip.get("itinerary") or {}
        prompt = (
            f"Remix this existing itinerary based on the user's note. Keep the destination "
            f"({base_trip['destination']}). USER NOTE: {note}. "
            f"ORIGINAL_ITINERARY: {json.dumps(base)[:6000]}. "
            f"Return the FULL remixed itinerary JSON in the same schema with 3-4 activities per slot."
        )
        new_itin = await call_claude_for_itinerary(prompt)
        new_doc = {
            **base_trip,
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "bucket": "stolen",
            "original_id": base_trip["id"],
            "itinerary": new_itin,
            "summary": new_itin.get("summary", base_trip.get("summary", "")),
            "score": new_itin.get("trip_score", base_trip.get("score", 90)),
            "created_at": utcnow_iso(),
        }
        new_doc.pop("_id", None)
        await db.trips.insert_one(new_doc)
        new_doc.pop("_id", None)
        await db.planner_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "done", "trip": new_doc, "finished_at": utcnow_iso()}},
        )
    except Exception as e:
        logger.exception("remix job %s failed", job_id)
        await db.planner_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "error", "error": str(e)[:400], "finished_at": utcnow_iso()}},
        )


@api.post("/trips/{trip_id}/remix")
async def remix_trip(trip_id: str, body: RemixBody, user=Depends(get_current_user)):
    """Sync remix — kept for backwards compatibility."""
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(404, "Trip not found")
    base = trip.get("itinerary") or {}
    prompt = (
        f"Remix this existing itinerary based on the user's note. Keep the destination "
        f"({trip['destination']}). USER NOTE: {body.note}. "
        f"ORIGINAL_ITINERARY: {json.dumps(base)[:6000]}. "
        f"Return the FULL remixed itinerary JSON in the same schema."
    )
    try:
        new_itin = await call_claude_for_itinerary(prompt)
    except Exception as e:
        logger.exception("remix failed")
        raise HTTPException(500, f"Remix failed: {e}")

    new_doc = {
        **trip,
        "id": str(uuid.uuid4()),
        "bucket": "stolen",
        "original_id": trip["id"],
        "itinerary": new_itin,
        "summary": new_itin.get("summary", trip.get("summary", "")),
        "score": new_itin.get("trip_score", trip.get("score", 90)),
        "created_at": utcnow_iso(),
    }
    await db.trips.insert_one(new_doc)
    new_doc.pop("_id", None)
    return new_doc


@api.post("/trips/{trip_id}/remix/jobs")
async def remix_create_job(trip_id: str, body: RemixBody, user=Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(404, "Trip not found")
    job_id = str(uuid.uuid4())
    await db.planner_jobs.insert_one(
        {
            "id": job_id,
            "user_id": user["id"],
            "kind": "remix",
            "status": "running",
            "created_at": utcnow_iso(),
        }
    )
    asyncio.create_task(_run_remix_job(job_id, user["id"], trip, body.note))
    return {"job_id": job_id, "status": "running"}


# --- AI Planner
async def _run_planner_job(job_id: str, user_id: str, user_prompt: str):
    """If days <= 7, single call. Otherwise generate first 7 days, then a chunk of remaining days, merge."""
    try:
        import re
        m = re.search(r"EXACTLY (\d+) days", user_prompt)
        requested_days = int(m.group(1)) if m else 5
        requested_days = min(max(requested_days, 1), 14)

        if requested_days <= 7:
            itinerary = await call_claude_for_itinerary(user_prompt)
        else:
            first_prompt = user_prompt.replace(
                f"EXACTLY {requested_days} days", "EXACTLY 7 days"
            ) + (
                f"\nNOTE: This is part 1 of a {requested_days}-day trip. Generate the "
                f"FULL JSON shape but ONLY days 1-7. total_estimated_cost_usd and "
                f"budget_breakdown should represent the FULL {requested_days}-day budget."
            )
            itinerary = await call_claude_for_itinerary(first_prompt)
            extra_days = await call_claude_for_days_chunk(
                destination=itinerary.get("destination", ""),
                country=itinerary.get("country"),
                interests="varied",
                budget="proportional to overall",
                travelers=2,
                start_day=8,
                end_day=requested_days,
                overall_context=itinerary.get("summary", "")[:200],
            )
            itinerary["days"] = (itinerary.get("days") or []) + extra_days

        await db.planner_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "done", "itinerary": itinerary, "finished_at": utcnow_iso()}},
        )
    except Exception as e:
        logger.exception("planner job %s failed", job_id)
        await db.planner_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "error", "error": str(e)[:400], "finished_at": utcnow_iso()}},
        )


def _build_planner_prompt(body: PlannerRequest, user: dict) -> str:
    prefs = user.get("preferences", {})
    interest_str = ", ".join(prefs.get("interests", [])) or "general adventure"
    budget = body.budget or prefs.get("budget") or "$1,500-$3,000"
    travelers = body.travelers or 2
    requested_days = body.days or 5
    days = min(max(requested_days, 1), 14)
    return (
        f"USER REQUEST: {body.prompt}\n"
        f"PROFILE: Travels {prefs.get('travel_frequency', 'a few times a year')}, "
        f"companions: {prefs.get('companions', 'Friends')}, "
        f"interests: {interest_str}.\n"
        f"CONSTRAINTS: EXACTLY {days} days, ~{travelers} travelers, budget {budget}. "
        f"Generate an EXHAUSTIVELY DETAILED itinerary in the strict JSON schema "
        f"with 4 activities per Morning/Afternoon/Evening per day."
    )


@api.post("/planner/jobs")
async def planner_create_job(body: PlannerRequest, user=Depends(get_current_user)):
    """Start an async planner job. Returns immediately with a job id."""
    job_id = str(uuid.uuid4())
    user_prompt = _build_planner_prompt(body, user)
    await db.planner_jobs.insert_one(
        {
            "id": job_id,
            "user_id": user["id"],
            "status": "running",
            "prompt": body.prompt,
            "created_at": utcnow_iso(),
        }
    )
    # Fire-and-forget background task
    asyncio.create_task(_run_planner_job(job_id, user["id"], user_prompt))
    return {"job_id": job_id, "status": "running"}


@api.get("/planner/jobs/{job_id}")
async def planner_job_status(job_id: str, user=Depends(get_current_user)):
    job = await db.planner_jobs.find_one({"id": job_id, "user_id": user["id"]}, {"_id": 0})
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@api.post("/planner/generate")
async def planner_generate(body: PlannerRequest, user=Depends(get_current_user)):
    """Synchronous generation — kept for backwards compatibility / testing."""
    user_prompt = _build_planner_prompt(body, user)
    try:
        itinerary = await call_claude_for_itinerary(user_prompt)
    except Exception as e:
        logger.exception("planner generation failed")
        raise HTTPException(500, f"AI generation failed: {e}")
    return {"itinerary": itinerary}


@api.post("/planner/score")
async def trip_score(body: GenerateScoreRequest, user=Depends(get_current_user)):
    """Deterministic Drift Trip Score 0-100 based on prefs match + uniqueness."""
    prefs = user.get("preferences", {})
    user_interests = set([i.lower() for i in prefs.get("interests", [])])
    trip_interests = set([i.lower() for i in body.interests])
    overlap = len(user_interests & trip_interests)
    base = 60 + (overlap * 6)
    # budget match
    if body.budget and prefs.get("budget") and body.budget == prefs["budget"]:
        base += 8
    # uniqueness bonus (rare destinations)
    rare_keywords = ["bhutan", "patagonia", "namibia", "faroe", "georgia", "kyrgyzstan", "azores"]
    if any(k in body.destination.lower() for k in rare_keywords):
        base += 10
    base = max(0, min(100, base))
    return {"score": base, "destination": body.destination}


# --- Invite system
@api.get("/invites")
async def get_invites(user=Depends(get_current_user)):
    used = user.get("invites_used", 0)
    return {"remaining": max(0, 5 - used), "used": used, "total": 5}


@api.post("/invites/send")
async def send_invite(body: Dict[str, str], user=Depends(get_current_user)):
    email = body.get("email", "")
    if not email:
        raise HTTPException(400, "email required")
    await db.users.update_one({"id": user["id"]}, {"$inc": {"invites_used": 1}})
    return {"ok": True, "sent_to": email}


app.include_router(api)

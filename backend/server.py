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
    preferences: Dict[str, Any] = Field(default_factory=dict)
    stats: Dict[str, Any] = Field(default_factory=dict)
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
        preferences=doc.get("preferences", {}),
        stats=doc.get("stats", {}),
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
ITINERARY_SYSTEM_PROMPT = """You are Drift's elite AI travel advisor.
You craft DETAILED multi-day itineraries that feel hand-built by a luxury travel concierge.

CRITICAL RULES:
- You NEVER mention booking, reservations, payments, hotels-as-bookings, or purchase steps. Drift is NOT a booking platform.
- You DO recommend specific places, restaurants, hidden gems, transport options, costs (estimates), and local tips.
- Each day MUST have Morning, Afternoon, Evening blocks. Put EXACTLY 2 activities per block (no more, no less).
- Cap the trip at 5 days maximum, even if the user asks for more. If they ask for >5, return a 5-day "highlights" version.
- Output STRICT JSON only. No prose outside JSON. No markdown code fences. Keep all string values concise.

JSON schema:
{
  "destination": str,
  "country": str,
  "summary": str,                       // 1-2 sentence pitch (max 220 chars)
  "trip_score": int,                    // 0-100 proprietary Drift score
  "best_time": str,                     // short, max 60 chars
  "total_estimated_cost_usd": int,
  "budget_breakdown": [
    {"category": "Flights", "amount": int, "pct": int},
    {"category": "Stay", "amount": int, "pct": int},
    {"category": "Activities", "amount": int, "pct": int},
    {"category": "Food", "amount": int, "pct": int},
    {"category": "Transport", "amount": int, "pct": int}
  ],
  "days": [
    {
      "day": int,
      "title": str,                     // short e.g. "Rome, Italy"
      "morning":   [ {"time": "08:00", "activity": str, "detail": str, "cost_usd": int, "tip": str}, ... 2 items ],
      "afternoon": [ ... 2 items ... ],
      "evening":   [ ... 2 items ... ],
      "transport": str,                 // 1 sentence
      "hidden_gem": str,                // 1 sentence
      "weather_tip": str,               // 1 short sentence
      "alternative": str                // 1 short sentence
    }
  ],
  "packing_tips": [str, str, str]       // exactly 3 short tips
}

Keep every "detail" string under 140 chars, every "tip" under 100 chars. Be specific (real place names, neighborhoods). Return ONE JSON object only."""


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
    # Strip any accidental code fences
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    # Find outermost JSON braces
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Claude returned no JSON: {text[:200]}")
    payload = cleaned[start : end + 1]
    return json.loads(payload)


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


async def seed_demo_data():
    # Seed feed
    for item in DEMO_FEED:
        await db.feed.update_one({"id": item["id"]}, {"$setOnInsert": item}, upsert=True)

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
            await db.trips.insert_one(
                {
                    **t,
                    "id": str(uuid.uuid4()),
                    "user_id": existing_id,
                    "created_at": utcnow_iso(),
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


@api.post("/trips/{trip_id}/remix")
async def remix_trip(trip_id: str, body: RemixBody, user=Depends(get_current_user)):
    trip = await db.trips.find_one({"id": trip_id, "user_id": user["id"]}, {"_id": 0})
    if not trip:
        raise HTTPException(404, "Trip not found")
    # Use Claude to remix the itinerary based on the note
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


# --- AI Planner
@api.post("/planner/generate")
async def planner_generate(body: PlannerRequest, user=Depends(get_current_user)):
    prefs = user.get("preferences", {})
    interest_str = ", ".join(prefs.get("interests", [])) or "general adventure"
    budget = body.budget or prefs.get("budget") or "$1,500-$3,000"
    travelers = body.travelers or 2
    # Cap days to 5 to keep Claude latency under ingress timeout (~90s headroom)
    requested_days = body.days or 5
    days = min(max(requested_days, 1), 5)

    user_prompt = (
        f"USER REQUEST: {body.prompt}\n"
        f"PROFILE: Travels {prefs.get('travel_frequency', 'a few times a year')}, "
        f"companions: {prefs.get('companions', 'Friends')}, "
        f"interests: {interest_str}.\n"
        f"CONSTRAINTS: {days} days, ~{travelers} travelers, budget {budget}. "
        f"Generate a CINEMATIC, DETAILED itinerary in the strict JSON schema."
    )

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

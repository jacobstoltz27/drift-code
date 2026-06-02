# Drift — Product Requirements (Live)

## Vision
Drift is a social travel discovery and AI planning platform. It is NOT a booking platform.
Users discover trips, generate AI itineraries, save trips, "steal" itineraries,
remix them, plan with friends, and build travel profiles.
Think: Pinterest + Beli + Letterboxd + AI Travel Planner.

## Stack
- Backend: FastAPI + MongoDB (motor), JWT auth (bcrypt + python-jose)
- AI: Claude Sonnet 4.5 via `emergentintegrations` (Universal Emergent LLM key)
- Frontend: Expo Router + React Native + Reanimated + expo-linear-gradient + BlurView
- Auth token stored via `@/src/utils/storage` (SecureStore on native, AsyncStorage shim on web)

## MVP Scope (v1 — built)
1. **Auth** — email/password (JWT). Seeded demo user: `demo@drift.app / DriftDemo123!`.
2. **Onboarding** — 5-step quiz (frequency, age, budget, companions, interests grid).
3. **Home tab**
   - Upcoming Trips horizontal hero cards (image, dates, countdown, companions, Trip Score)
   - "You have N invites left" premium unlock card (5 horizontal icons, Invite Friends CTA)
   - Personalized Feed (creator itineraries) with Save / Steal / Share
4. **Explore tab** — search, category chips, AI prompts, trending grid (lightweight as requested).
5. **AI Planner tab** — chat → generating checklist → cinematic itinerary with day-by-day Morning/Afternoon/Evening blocks, budget breakdown, hidden gems, transport, weather tips, alternatives, packing tips, local phrases. Save to trips.
6. **Trips tab** — 4 tabs: Upcoming / Past / Saved / Stolen, grid of trip tiles.
7. **Profile tab** — avatar header, stats grid (Trips/Countries/Cities/Followers), Trip Score gauge, travel-map dot grid, statistics breakdown, saved + stolen grids.
8. **Trip Detail** — hero image, score, summary, full itinerary (or "Generate with AI"), Remix-with-AI flow.
9. **Feed Detail** — large hero, creator card, tags, Save / Steal CTAs.
10. **Invite modal** — send invite by email; decrements remaining count.
11. **Steal / Save / Remix** — present throughout. No booking/payment language anywhere.

## Backend endpoints
- POST `/api/auth/register`, `/api/auth/login`, `/api/auth/onboarding`
- GET `/api/auth/me`
- GET `/api/feed`, `/api/feed/{id}`
- GET `/api/trips?bucket=…`, GET/POST/DELETE `/api/trips/{id}`
- POST `/api/feed/{id}/save`, `/api/feed/{id}/steal`
- POST `/api/trips/{id}/remix` (Claude-powered remix)
- POST `/api/planner/generate` (Claude Sonnet 4.5 structured JSON)
- POST `/api/planner/score`
- GET `/api/invites`, POST `/api/invites/send`

## Out of scope for v1 (can build later upon request)
- Real-time group voting / collab
- Creator follow graph
- Social posts composer + camera
- Travel personality test
- World-map SVG (replaced with stylized dot grid)

## Design tokens
Background #070B14, Primary #1B1F3B, Accent #5B67FF, Teal #14B8A6, Text #F5F7FA.
Glassmorphism (BlurView), rounded-22 cards, gradient CTAs, score-ring badges, premium dark.

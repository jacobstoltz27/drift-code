# Drift — Product Requirements (Live)

## Vision
Drift is a social travel discovery and AI planning platform. It is NOT a booking platform.
Users discover trips, generate AI itineraries, save trips, "steal" itineraries,
remix them, plan with friends, and build travel profiles.

## Stack
- Backend: FastAPI + MongoDB (motor), JWT auth (bcrypt + python-jose)
- AI: Claude Sonnet 4.5 via `emergentintegrations` (Universal Emergent LLM key) — async job pattern (POST creates job, frontend polls)
- Frontend: Expo Router + React Native + Reanimated + expo-linear-gradient + BlurView + react-native-svg + @react-native-community/datetimepicker

## Navigation Philosophy (post-update)
- **Home = My travel life** — Upcoming trips, Invite/unlock card, Following feed (friends + creators + verified guides)
- **Explore = Discovery** — Search, AI prompts, For You, Trending Trips, Popular Creators, Hidden Gems, Luxury Escapes, Weekend Getaways, Adventure Trips
- **Planner = AI itinerary builder** — Structured inputs (dest/days/travelers/budget) + chat + async job + 4-action toolbar
- **Trips = Trip management** — Upcoming / Past / Saved / Stolen
- **Profile = Identity** — Avatar header, stats, World Travel Map (SVG with highlighted countries + % of world), score gauge, saved + stolen grids

## Drift Plus (Premium) — `is_premium` flag on user
**Free**: social feed, browse community trips, AI planner (2 trips), basic profile.
**Pro $8.99/mo or $7.19/mo annual ($86.28/yr, save 20%)**:
- Unlimited itinerary steals
- AI itinerary remixing
- Advanced trip customization
- Hidden gem recommendations
- Detailed AI planning
- Full Trip Score with AI insights
- World Travel Map (no invites needed)
- Group planning for any size
- Verified local Guides
- Offline itineraries
- Priority support

`POST /api/feed/{id}/steal` returns **402 premium_required** for free users. Paywall modal triggers on every Steal CTA across the app (planner, trip detail, feed detail). `POST /api/subscription/upgrade` flips the flag (mock — no payment).

## Trip workflow
- Save a trip from Explore feed → goes to Saved bucket
- "Add to Upcoming Trips" → opens ScheduleModal with start/end date pickers → `POST /api/trips/{id}/schedule` promotes to Upcoming with live countdown
- AI Planner generated itinerary now exposes 4 actions: **Save Trip / Add to Upcoming / Steal (Pro) / Remix Trip**
- Trip detail page shows the same 4-action toolbar plus Remix-with-AI inline flow

## World Travel Map (Profile)
- `react-native-svg` SVG with continent silhouettes + radial-glow indigo dots at lat/lng for each visited ISO-2 country
- Shows `N countries · % of world explored`, recent countries list, legend

## Backend endpoints (Δ since v1)
- POST `/api/planner/jobs` + GET `/api/planner/jobs/{id}` (async)
- POST `/api/trips/{id}/remix/jobs` (async)
- POST `/api/feed/{id}/steal` — **402 if not premium**
- POST `/api/trips/{id}/schedule` — convert to upcoming with dates
- GET `/api/following/feed` — friends/creators/guides social posts
- GET `/api/subscription/plans` + POST `/api/subscription/upgrade`

## Demo creds
- Email: `demo@drift.app`
- Password: `DriftDemo123!`
- Pre-seeded: 18 visited countries, 3 upcoming trips, onboarded, NOT premium (so you can test the paywall)

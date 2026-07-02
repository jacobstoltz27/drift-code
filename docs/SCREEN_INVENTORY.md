# Drift — Screen Inventory

Single source of truth for build status as we convert Stitch designs into the
app and migrate the backend to Supabase. Update the status boxes as work lands.

## Status legend

Each screen moves through four stages:

- **Designed** — a Stitch export / reference exists for the new visual direction
- **Built** — implemented as a React Native screen against `src/theme.ts` (new design system)
- **Wired** — connected to live data (target backend: **Supabase**)
- **Reviewed** — passes `tsc --noEmit` + `eslint`, and `react-reviewer` / `a11y-architect`

Marks: `[x]` done · `[~]` in progress / old design · `[ ]` not started

---

## Design system foundation

| Item | Designed | Built | Notes |
|------|:--:|:--:|-------|
| Tokens (`theme.ts`) | [x] | [x] | M3 dark-tonal palette, type scale, glass/glow |
| Fonts | [x] | [x] | Space Grotesk + Manrope (stand-ins for Clash/Satoshi) |
| Primitives (`ui.tsx`) | [x] | [x] | GlassCard, buttons, pills, badges, section header |
| Floating tab dock | [x] | [x] | Glass dock, glowing active tab |

---

## Core tabs

| Screen | File | Designed | Built | Wired | Reviewed |
|--------|------|:--:|:--:|:--:|:--:|
| Home | `app/(tabs)/home.tsx` | [x] | [x] | [~] | [x] |
| Explore | `app/(tabs)/explore.tsx` | [ ] | [~] | [~] | [ ] |
| Planner (AI) | `app/(tabs)/planner.tsx` | [~] | [~] | [~] | [ ] |
| Trips | `app/(tabs)/trips.tsx` | [~] | [~] | [~] | [ ] |
| Profile | `app/(tabs)/profile.tsx` | [~] | [~] | [~] | [ ] |

> `[~]` Wired = currently on the FastAPI backend; will re-wire to Supabase.

---

## Detail & flow screens

| Screen | File | Designed | Built | Wired | Reviewed |
|--------|------|:--:|:--:|:--:|:--:|
| Trip detail | `app/trip/[id].tsx` | [~] | [~] | [~] | [x] |
| Feed post detail | `app/feed/[id].tsx` | [~] | [~] | [~] | [x] |
| Invite | `app/invite.tsx` | [~] | [~] | [~] | [ ] |
| Welcome | `app/welcome.tsx` | [x] | [~] | [~] | [ ] |
| Splash / index | `app/index.tsx` | [ ] | [~] | [x] | [ ] |

---

## Onboarding flow (from Stitch — designed, not yet built)

Multi-step first-run flow that establishes the "travel identity" and seeds the
community graph. Currently collapsed into a single `app/onboarding.tsx`.

| Step | Purpose | Designed | Built | Wired | Reviewed |
|------|---------|:--:|:--:|:--:|:--:|
| Welcome | Value prop / start | [x] | [ ] | [ ] | [ ] |
| Create Profile | Name, avatar, handle | [x] | [ ] | [ ] | [ ] |
| Places explored | "How much of the world…" | [x] | [ ] | [ ] | [ ] |
| Select where you've been | Country picker → World Map | [x] | [ ] | [ ] | [ ] |
| Travel style | Style tags | [x] | [ ] | [ ] | [ ] |
| Customize style | Refine preferences | [x] | [ ] | [ ] | [ ] |
| Who you travel with | Companions | [x] | [ ] | [ ] | [ ] |
| Where you want to go | Bucket-list / feed seed | [x] | [ ] | [ ] | [ ] |
| Travel is better together | Social value prop | [x] | [ ] | [ ] | [ ] |
| Find inspiration / Follow | Suggested creators | [x] | [ ] | [ ] | [ ] |
| Community | Community intro | [x] | [ ] | [ ] | [ ] |
| AI identity | "Building your travel identity" | [x] | [ ] | [ ] | [ ] |
| Personalized / Ready | "Your world is ready" | [x] | [ ] | [ ] | [ ] |

---

## Planner flow (from Stitch)

| Step | Purpose | Designed | Built | Wired | Reviewed |
|------|---------|:--:|:--:|:--:|:--:|
| Trip Basics | Destination / dates | [x] | [~] | [~] | [ ] |
| Travel style | Vibes / pace | [x] | [~] | [~] | [ ] |
| Advanced ("More about your trip") | Deep preferences | [x] | [~] | [~] | [ ] |
| Review / Finetune your trip | Confirm before generate | [x] | [~] | [~] | [ ] |
| Generating | Progress state | [~] | [~] | [~] | [ ] |
| Result / itinerary | The output | [x] | [~] | [~] | [ ] |

---

## Creator & community (from Stitch — new surfaces)

| Screen | Purpose | Designed | Built | Wired | Reviewed |
|--------|---------|:--:|:--:|:--:|:--:|
| Creator profile | Portfolio of itineraries + World Map | [x] | [ ] | [ ] | [ ] |
| Followers / Following | Social graph lists | [ ] | [ ] | [ ] | [ ] |
| Notifications | Likes / follows / remixes | [ ] | [ ] | [ ] | [ ] |
| Itinerary composer | Author / publish an itinerary | [ ] | [ ] | [ ] | [ ] |
| Report / moderation | Trust & safety | [ ] | [ ] | [ ] | [ ] |

---

## Shared components

| Component | File | Restyled to new system |
|-----------|------|:--:|
| UI primitives | `src/components/ui.tsx` | [x] |
| Trip cards | `src/components/trip-cards.tsx` | [~] (UpcomingTripCard done) |
| Invite card | `src/components/invite-card.tsx` | [x] |
| Following post | `src/components/following-post.tsx` | [x] |
| Itinerary experience | `src/components/itinerary-experience.tsx` | [ ] |
| Calendar | `src/components/calendar.tsx` | [ ] |
| World map | `src/components/world-map.tsx` | [ ] |
| Paywall modal | `src/components/paywall-modal.tsx` | [~] (a11y only) |
| Schedule modal | `src/components/schedule-modal.tsx` | [~] (a11y only) |

---

_Last updated: keep this in sync as screens land. See `docs/ROADMAP` for the
phased launch plan._

# Working directive (read first, every session)

**Reason from evidence, not assumption.** Before claiming something is true,
done, or working, back it with something checkable and say what that proof is:
a build result, a `grep`, a measured DOM value, a git state, a Vercel
deployment status, a screenshot. When you do **not** have the evidence, say so
plainly ("build passed but I have not visually verified") rather than asserting.
Prefer measuring over guessing; when you must guess, label it a guess and give
your reasoning.

This is the standing expectation for every task in this repo.

---

# Project cheat-sheet (verified facts, keep accurate)

## Repos & layout
- The **marketing website** lives in `website/` (this is the active work).
  The mobile app is `frontend/` (Expo) and its API is `backend/` (Python) —
  do not touch those when working on the site.
- Stack: **Next.js 14 (App Router) + Tailwind CSS 3 + TypeScript**, deployed on
  Vercel. UI components from 21st.dev-style copies live in `website/components/ui/`.
- Fonts: **Fraunces** (bold serif display, via `next/font`) + **Inter** (body).
- Palette tokens (tailwind.config.ts): `midnight #0A0D12`, `charcoal #151A24`,
  `ivory #FEFAEF`, `ocean #AFD2FA` (powder blue), `golden #38BDF8` (vibrant sky
  blue — the primary accent, name is legacy), `forest #24356B` (deep navy).

## Deploy
- Vercel project **`drift-code`** (`prj_8loWVvpAcjwfQLZry8NjHWgav68z`), team
  `team_p8RqhzuF4BSMWpyFbdCtCYsX`. **Root Directory = `website`** and
  `website/vercel.json` pins `framework: nextjs`.
- Work branch: `claude/gallant-faraday-o0bbws`. Push → Vercel auto-deploys;
  verify the commit reaches **state: READY** before claiming it's live.
- This is a **remote, ephemeral sandbox**: its network only allows package
  registries — Unsplash, Vercel API, Supabase REST, Fontshare, image CDNs are
  all blocked (403). So images/fonts can't be fetched or visually verified here,
  but they load in production. Commit/push often; restarts can lose local work.
- Local preview: `cd website && PORT=3000 npm run start`, then drive with the
  pre-installed Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  via the global Playwright at `/opt/node22/lib/node_modules/playwright`.

## Waitlist backend
- Supabase project `vgtyvsqepwdhumbplpvm` (`drift-waitlist`), `public.waitlist`
  table with hardened RLS. Public keys are baked into `website/.env.production`.

## Brand (source of truth: `.agents/brand-context.md` on branch
`claude/brand-build-skills-pfvtsk`)
- **Drift** = the social travel platform/world (app name, never changes).
- **Peregrine** = the AI travel companion *inside* Drift — "Ask Peregrine"
  (like Siri inside iPhone). It's the itinerary planner, a chat concierge, and a
  brand persona symbolized by a **line-art peregrine-falcon mark**
  (`website/public/peregrine-mark.png`).
- Emotional hook: **"Land like you already know the place."** Verb: **Ask Peregrine.**
- **Hard guardrail:** Drift is **NOT a booking platform.** Never use
  book / reserve / reservations / hotels / flights as inventory / checkout /
  deals / discounts. Drift inspires and plans; it never sells travel inventory.
- Paid product: **Drift Plus** only — invent no other tiers.

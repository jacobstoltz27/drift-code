# Drift — Marketing Website

The cinematic, scroll-driven landing page for Drift. Built with **Next.js 14**,
**Tailwind CSS**, and **Framer Motion**. Deploys to **Vercel** with a custom
domain in minutes.

This is the public website only. The Drift mobile app lives in `../frontend`
and its API in `../backend` — this folder does not touch them.

## Run locally

```bash
cd website
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev                        # http://localhost:3000
```

## Connect the waitlist (Supabase)

1. In your Supabase dashboard, open **SQL Editor** and run the contents of
   `supabase/schema.sql`. This creates a locked-down `waitlist` table.
2. In **Project Settings → API**, copy your **Project URL** and **anon public
   key** into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Restart `npm run dev`. The "Get Early Access" forms now write to Supabase.

> Until Supabase is connected, the forms still work — they just confirm
> success without storing the email (local mode).

## Deploy (Vercel)

1. Push to GitHub (already on branch `claude/gallant-faraday-o0bbws`).
2. In Vercel: **New Project → import this repo → set Root Directory to
   `website`**.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars.
4. Deploy, then add your custom domain under **Settings → Domains**.

## Structure

| Path | What it is |
|---|---|
| `app/page.tsx` | Section order for the whole page |
| `app/api/waitlist/route.ts` | Server endpoint that stores emails |
| `components/` | One file per section (Hero, Pricing, etc.) |
| `lib/content.ts` | All copy, stats, destinations, features, vibes |
| `lib/supabase.ts` | Supabase client (safe when unconfigured) |

## Images

Destination imagery is referenced from free-license sources. Swap the URLs in
`lib/content.ts` and the `backgroundImage` styles in `components/Hero.tsx`,
`StolenTrips.tsx`, and `WaitlistCTA.tsx` with your own photography or
self-hosted files in `public/` when ready.

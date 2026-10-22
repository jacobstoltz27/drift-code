---
name: perplexity-research
description: Deep research through the Perplexity API for competitor intel, market sizing, pricing, funding, feature comparisons and positioning. Use when the user asks for "comp info", "competitor research", "what's [company] doing", "compare us to X", "market research", "who else does this", or any question that needs many cited, current web sources. Produces a cited markdown report in research/.
---

# Perplexity deep research

Use Perplexity's `sonar-deep-research` model to run multi-source research and
return a cited report. The script is `scripts/pplx.py` next to this file
(standard library only, no install).

## Before you start

1. Check the key: `test -n "$PERPLEXITY_API_KEY" && echo set || echo missing`.
   Never print the key.
2. If the key is missing, tell the user it needs to be added as an environment
   secret (for cloud sessions, read the `environment.secrets` docs page with
   `read_documentation`). Then fall back to WebSearch (mode "extended") and
   follow the same report format. Say in the report that Perplexity was not used.
3. If the call fails with "could not reach Perplexity", the network policy is
   blocking `api.perplexity.ai`. Read the `environment.network` docs page,
   tell the user, and use the WebSearch fallback.

## Pick the model

| Need | Model | Typical time |
|---|---|---|
| Full competitor profile, landscape scan, market sizing | `sonar-deep-research` (default) | 1 to 5 min |
| Comparison that needs reasoning over a few sources | `sonar-reasoning-pro` | under 1 min |
| One fact: a price, a launch date, a funding round | `sonar-pro` | seconds |

Deep research costs more per call. Use `--effort low` for a quick scan,
`medium` by default, `high` only when the user asks for exhaustive coverage.

## Workflow

1. **Scope the question.** Turn the request into a specific brief: which
   companies, which dimensions, which time window, which region. If the user
   just says "comp info", default to the dimensions in the template below.
2. **Split big asks.** One competitor per deep-research call. For a landscape
   of 5 companies, run 5 profile calls (in parallel with background Bash) plus
   one landscape call, rather than one giant prompt.
3. **Run the query.**
   ```bash
   S=.claude/skills/perplexity-research/scripts/pplx.py
   python3 $S --out research/raw/2026-10-22-wanderlog.md "<brief>"
   python3 $S --model sonar-pro --recency month "Did Mindtrip raise money in 2026?"
   python3 $S --domains "apps.apple.com,play.google.com" "<app store question>"
   ```
   Use `run_in_background` for deep-research calls so the user can keep working.
4. **Verify.** Perplexity can misread sources. For every number that goes into
   the final report (pricing, funding, users, downloads), open at least one cited
   URL with WebFetch and confirm it. Mark anything you could not confirm as
   "unverified". Drop claims with no source.
5. **Write the report** to `research/YYYY-MM-DD-<topic>.md` using the format
   below. Keep raw Perplexity output in `research/raw/` for traceability.
6. **Commit and push** the report (sandboxes are ephemeral). Give the user the
   path and a 3 to 5 line summary in chat.

## Brief template for a competitor profile

```
Research <Company> (<url>) as a competitor to a social travel app with an AI
trip planner. Cover, with a dated source for each point:
- What it is, who it is for, platforms (iOS, Android, web)
- Core features, especially AI planning, social/sharing, itinerary tools
- Business model and current pricing tiers (exact prices, currency, date seen)
- How it makes money: subscriptions, affiliate/booking commissions, ads
- Funding: rounds, amounts, investors, dates
- Traction: downloads, ratings and review counts per store, user claims
- Positioning and tagline, in their own words
- What users praise and complain about (app store reviews, Reddit)
- Launches and changes in the last 12 months
Say where data is missing or estimated.
```

## Report format

```markdown
# <Topic> research
Date: YYYY-MM-DD · Method: Perplexity <model> + manual verification (or: WebSearch fallback)

## Short answer
3 to 5 sentences answering the question asked.

## Findings
Sections per competitor or per dimension. Every claim ends with a source
marker like [3]. Numbers carry a date.

## Comparison table (when comparing)
| | Drift | A | B |

## What this means for Drift
Concrete implications: gaps to exploit, features to match, messaging to avoid.

## Confidence and gaps
What is verified, what is unverified, what could not be found.

## Sources
[1] url, accessed YYYY-MM-DD
```

## Drift context for comparisons

Read `CLAUDE.md` for the brand. When framing implications:

- Drift is a social travel platform. Peregrine is its AI companion
  ("Ask Peregrine"). Paid tier is Drift Plus only.
- Drift is **not a booking platform**. Many competitors earn money from
  bookings and affiliate commissions. Report that as fact about them, but never
  recommend Drift add booking, reservations, deals or checkout.
- Useful comparison axes: AI planning quality, social graph and sharing,
  "land like you already know the place" local depth, pricing of the paid tier.

## Rules

- No fabricated numbers. If a figure has no source, it does not go in.
- Prefer primary sources. Flag aggregator-only numbers (Crunchbase estimates,
  Sensor Tower estimates) as estimates.
- State the date of every price and metric; these go stale fast.
- Do not paste API keys, and do not commit `.env` files.

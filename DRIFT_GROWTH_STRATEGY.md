# Drift — Growth Strategy

*How to build Drift into a category-winning consumer app, using the exact playbooks behind Cal AI (Jake Castillo) and Alex Hormozi.*

Two people, two lessons. **Jake Castillo** scaled Cal AI from $0 to ~$30M ARR and #1 in Health & Fitness in **18 months**, then sold to MyFitnessPal — almost entirely through influencer-native content and a ruthless hard-paywall funnel. **Alex Hormozi** teaches *why* people buy: make the offer so good it's stupid to say no, then give away enough free value that people trust you before they pay.

This doc maps both playbooks directly onto Drift's real features: **Trip Score**, **Steal Itinerary**, **invite-gating**, the **AI Planner**, and **Drift Plus**.

---

## 1. The one-sentence thesis

> Drift wins if it becomes the app that **turns a 45-second travel video into a bookable, remixable itinerary in one tap** — distributed by the exact creators who already make "come to X with me" content, and monetized behind a hard paywall on the moment of highest desire.

That sentence is doing three jobs: it's Drift's *dream outcome* (Hormozi), its *creator-native format* (Castillo), and its *paywall trigger* all at once. Everything below serves it.

---

## 2. Jake Castillo's playbook → Drift

Castillo's core belief: **"Pick a niche that already has millions of obsessed people and an army of cheap creators."** Travel is arguably the *best* niche on that test — it has more obsessed people and more cheap creators than fitness ever did. Drift is in the right pond. Now execute the plays.

### Play 1 — Make the product *natively integrate* into content creators already make
Cal AI's winning insight: fitness creators were *already* filming "what I eat in a day." Cal AI didn't ask them to make an ad — it slotted into their existing format. Some integrations hit **43M, 56M, 73M organic views** with no boosting.

**Drift's equivalent already exists in the codebase: "Steal Itinerary."** Travel creators already make "7 days in Bali," "my exact Amalfi itinerary," "save this for your trip." The native integration is:

- Creator posts their trip → Drift auto-generates the shareable itinerary + Trip Score → caption/comment says *"full itinerary is on Drift, link in bio, tap Steal."*
- The creator doesn't make an ad. They post the video they were going to post anyway, and Drift is the "save/steal this" payoff. **This is the single most important growth mechanic Drift has — the whole app should be built around making creators want to drop that link.**

**Action:** Build a creator-side flow where a creator imports/links a trip and gets (a) a Trip Score badge to flex, (b) a one-tap "Steal" link, (c) a dashboard of how many people stole it. Give the top creators a revenue share or free lifetime Plus. This is Drift's "what I eat in a day."

### Play 2 — Views ≠ installs. Instrument the funnel like Castillo did
Cal AI tracked **~10 installs per 1,000 views** and openly said videos with **100M views converted nothing**. The number that matters is installs-per-1k-views and cost-per-install, not view count.

**Action:** Before spending a dollar on creators, instrument:
- Per-creator install attribution (unique referral codes / links — Drift already has invite plumbing; extend it to creators).
- Installs per 1,000 views, cost per install, and **install → Drift Plus conversion** per creator.
- Kill creators/niches below threshold fast; double down on winners.

### Play 3 — Read the comments as your conversion signal
Castillo trusted comment sections over view counts. Comments like *"thank you for this"* or detailed questions convert; generic hype doesn't.

**Action:** When seeding creators, prioritize the ones whose audiences comment *"saving this,"* *"what's the name of that hotel,"* *"can you drop the itinerary."* That comment = latent Drift demand. Those are your best-converting partners.

### Play 4 — Sign creators in volume, then amplify winners with Spark Ads / whitelisting
Cal AI signed **300+ influencer partnerships in 18 months**. Once a creator's organic post performed, they ran it as a **TikTok Spark Ad / whitelisted Meta ad** — the same authentic post, now paid-amplified (costs ~+20–50% on the base creator rate but scales a proven winner). By early 2026 Cal AI was spending ~$1M/month in paid on top of organic.

**Action (staged):**
1. **Seed 20–50 micro/mid travel creators** cheaply (free Plus + small flat fee + a Trip Score they can flex). Measure with Play 2.
2. Take the **top ~10%** of posts by install-per-view and buy whitelisting rights.
3. Run those as Spark Ads / Meta ads. Only scale spend on posts that already converted organically. Never lead with paid on unproven creative.

### Play 5 — Hard paywall on the moment of peak desire
Cal AI is free to download but the *core magic* (photo calorie scan) is behind a subscription. Result: **20–30% download→paid conversion vs <10% industry average.** They ran **61+ paywall experiments** and a **3-day trial with card required**, and grew revenue 3x in 10 months by testing 123 experiments across 46 trigger points.

**Drift's paywall is currently placed reasonably** (`paywall-modal.tsx`: Steal Itinerary is the trigger) **but under-optimized.** Right now:
- Free tier gives "AI planner (2 trips)" and lets people browse everything.
- The hard wall is on "unlimited steals."

**The Cal-AI move:** the paywall should fire at the *exact second of peak desire* — the moment a user taps "Steal" on a creator's gorgeous, high-Trip-Score itinerary they just watched a video about. That's Drift's "photo scan" moment. Make the *first* steal feel magical and free, then wall the second one hard.

**Actions:**
- Add an **onboarding quiz → paywall** flow (Drift already has the quiz: frequency, budget, companions, interests — see `design_guidelines.json`). End the quiz on a personalized paywall: *"Based on your answers, we found 12 trips scored 90+ for you. Unlock them."*
- Add a **3-day free trial, card required**, as the default annual path. This alone was a major Cal-AI lever.
- Treat the paywall as a **living experiment**, not a screen. Instrument variants (price, trial length, framing, which feature is the hook). Aim to run dozens of tests, not one.

### Play 6 — Pricing reality check ⚠️
Cal AI monetizes at **$9.99/mo or $29.99/yr (~$2.49/mo effective)** — a cheap annual to maximize conversion volume, then wins on scale.

Drift Plus is currently **$8.99/mo or $86.28/yr ($7.19/mo effective).** The annual is **~2.9x Cal AI's annual.** That's a defensible *luxury* position (Drift's whole design archetype is "Luxury"), but it will **suppress trial→paid conversion** relative to Cal AI's model. Decision to make explicitly:
- **Volume path (Castillo):** drop annual to ~$39.99–$49.99, win on conversion % and scale, monetize the funnel.
- **Premium path (current):** keep price high, but you *must* justify it with a stronger offer stack (next section) and lean harder on the free social feed as the top-of-funnel.

Recommendation: **test a cheaper annual against the current one.** The math on a hard-paywall app almost always favors more subscribers at a lower annual price.

---

## 3. Alex Hormozi's playbook → Drift

Castillo tells you *how to distribute and monetize*. Hormozi tells you *why anyone buys* and how to make the offer irresistible.

### The Value Equation — audit Drift against it
> **Value = (Dream Outcome × Perceived Likelihood of Success) ÷ (Time Delay × Effort & Sacrifice)**

The top two *create* value; the bottom two *destroy* it. Most apps obsess over the top. Hormozi's edge: **the money is in crushing the bottom** — that's the moat.

| Lever | What it means for Drift | Score today | The move |
|---|---|---|---|
| **Dream Outcome** ↑ | "Travel like an insider without planning" | Strong — this is Drift's core | Sharpen the promise: *"the trip your favorite creator took, planned for you in one tap."* |
| **Perceived Likelihood** ↑ | User believes the itinerary will actually be great | Weak spot | Lean on **Trip Score** as proof (it's a trust signal — make it credible, sourced, explained), plus creator credibility + "X people stole this" social proof + reviews. |
| **Time Delay** ↓ | How fast do they get a usable plan? | Fixable | The magic must be **instant**. Tapping "Steal" should produce a complete, personalized, day-by-day plan in seconds — not a chat that requires effort. |
| **Effort & Sacrifice** ↓ | How much work to get the plan? | **Biggest opportunity** | Kill the blank-page problem. Default to "steal an existing great trip and auto-remix to my dates/budget/companions," not "chat with an AI from scratch." |

**The headline insight:** Drift's AI Planner as a *chat* is high-effort (bad for the equation). Drift's "Steal Itinerary" as a *one-tap remix of a proven, high-scored trip* is low-effort and low-time-delay (great for the equation). **Steal should be the hero. Chat is the fallback.** This is the single highest-leverage product decision in this doc, and it agrees with Castillo's Play 1.

### Build a Grand Slam Offer (the offer stack)
Hormozi: don't sell a subscription, sell a *stack* so valuable the price feels stupid. Never discount the core — add bonuses. Drift Plus's current feature list (in `paywall-modal.tsx`) is a *feature list*, not an *offer*. Reframe it as a stack with named, valued components:

- Unlimited Steals *(the core)*
- **The Insider Map** — every creator's hidden gems, unlocked *(reframe "hidden gem recommendations")*
- **Instant Remix** — any itinerary rebuilt to your exact dates, budget, and crew in seconds
- **The Trip Score Guarantee** — *"if your planned trip doesn't score 85+, we'll rebuild it free"* (a Hormozi-style guarantee that spikes Perceived Likelihood)
- **Group Mode** — plan with any size crew *(already a feature)*
- **Offline + Verified Local Guides** *(already features)*

Same features, framed as an irresistible stack with a guarantee. The guarantee is the cheapest conversion lever you have and Drift doesn't use one yet.

### The lead magnet: give away something that should be paid
Hormozi built trust by giving away value better than competitors' paid products. **Drift's free lead magnet should be a genuinely great, free, personalized itinerary** — good enough that people can't believe it's free, which is exactly what earns the paid upgrade. The free social feed + one free killer Steal *is* the lead magnet. Don't nerf it to force upgrades; make it so good it sells the paid tier by contrast. (This is the tension with a high price — resolve it by being *generous* at the top of funnel and *hard* at the paywall, not stingy everywhere.)

### The Core Four — where Drift's leads come from
Hormozi's four channels: **warm outreach, post content, cold outreach, run ads.** Drift's ranked priority:
1. **Post content (via creators)** — this is the Castillo engine. #1 by far.
2. **Run ads** — but only Spark Ads / whitelisted winners (Play 4). Don't run cold paid creative.
3. **Warm outreach** — Drift's **invite-gating** *is* warm outreach productized. The "X invites left" card (`invite-card.tsx`) turns every user into a distributor. Make invites feel valuable (they unlock premium-flavored features) so people actually send them.
4. **Cold outreach** — creator DMs to sign partnerships (this is how you build the 300-creator roster).

### Fix the invite mechanic with Hormozi's lens
The current invite card gates real features (Trip Score, World Map, Group Planning) behind invites. **Caution:** gating *core value* behind invites raises Effort & Sacrifice and can suppress the very virality you want. Hormozi + Castillo would say: gate *status and bonus* behind invites, never the core magic. Let the first Steal and the AI plan be frictionless; make invites unlock *flex* (a better Trip Score badge, early creator access, referral rewards). Reward the *inviter* generously — that's what drives sharing.

---

## 4. The 90-day execution plan

**Weeks 1–3 — Instrument & sharpen the wedge**
- Make "Steal → instant personalized itinerary" the hero flow; demote chat to fallback.
- Build per-creator/per-user attribution on top of existing invite plumbing.
- Add the onboarding-quiz → personalized paywall; add a 3-day trial (card required).
- Reframe Drift Plus as an offer stack + add the Trip Score guarantee.

**Weeks 4–8 — Seed creators & find the winning integration**
- Sign 20–50 travel micro/mid creators (free Plus + small fee + flexable Trip Score).
- Have them post their real trips with a "full itinerary on Drift, tap Steal" payoff.
- Watch installs-per-1k-views and comment sentiment. Find the format that converts.
- A/B test a cheaper annual price against the current $86.28.

**Weeks 9–12 — Amplify winners**
- Whitelist the top ~10% of creator posts; run Spark Ads / Meta ads on proven creative only.
- Scale spend strictly by install→Plus payback, not vanity views.
- Run the paywall as a continuous experiment (target: dozens of variants, Cal-AI style).

---

## 5. The three things that matter most

1. **Make "Steal Itinerary" the entire product's center of gravity.** It's Drift's "what I eat in a day" (Castillo) *and* its lowest-effort, highest-value action (Hormozi). One tap, proven trip, instant personalized remix.
2. **Distribute through creators natively, measure installs not views, amplify only proven winners.** That is the whole Cal AI engine.
3. **Sell an offer, not a feature list — with a guarantee — and paywall the moment of peak desire.** Consider a cheaper annual to win on conversion volume.

---

### Sources
- [Photo calorie app Cal AI, downloaded over a million times, built by two teenagers — TechCrunch](https://techcrunch.com/2025/03/16/photo-calorie-app-cal-ai-downloaded-over-a-million-times-was-built-by-two-teenagers/)
- [Cal AI: How a teenage CEO built a fast-growing calorie-tracking app — CNBC](https://www.cnbc.com/2025/09/06/cal-ai-how-a-teenage-ceo-built-a-fast-growing-calorie-tracking-app.html)
- [How Cal AI turned influencer marketing into a $50M growth engine — FunnelFox](https://blog.funnelfox.com/cal-ai-influencer-marketing/)
- [Jake Castillo (@jakecastilloooo) on X](https://x.com/jakecastilloooo)
- [Jake Castillo — top consumer app niches thread (X)](https://x.com/jakecastilloooo/status/2070128459616055611)
- [Scaling Cal AI: paid marketing & MrBeast deals — Stormy AI](https://stormy.ai/blog/scaling-cal-ai-performance-marketing-mrbeast-roi)
- [How Cal AI scaled paywall experimentation, grew revenue 3x in 10 months — Superwall](https://superwall.com/case-studies/cal-ai)
- [Cal AI pricing 2026 — eesel AI](https://www.eesel.ai/blog/cal-ai-pricing)
- [Influencer Whitelisting and Spark Ads playbook — Bizkol](https://www.bizkol.ai/blog/influencer-whitelisting-spark-ads)
- [Alex Hormozi's Value Equation explained — Medium (Joe McMahan)](https://medium.com/@joemcmahan/the-value-equation-436ad5fe5a3a)
- [$100M Offers Summary — SuperSummary](https://www.supersummary.com/100m-offers/summary/)
- [$100M Leads by Alex Hormozi — Shortform](https://www.shortform.com/blog/100m-leads-alex-hormozi/)

---
name: realistic-ugc-campaign
description: Run a one-person marketing team end to end. Research the market, find the selling angle, write scripts, then build a photoreal AI creator and produce UGC ads, statics and short drama videos with Higgsfield (Soul 2.0 face, GPT Image 2.5 Sunburst character sheet, Seedance 2.5 talking clips). Use when the user says "make UGC ads", "AI influencer for our ads", "realistic AI creator", "character sheet", "talking head video", "Seedance prompt", "Higgsfield campaign", "full marketing campaign", "hook factory", "winner mining", "drama ad", "localize this ad", or wants realistic AI video or image content for marketing. For Meta account structure and bidding use `meta-ads`; for copy-only ad batches use `meta-ad-creative`.
metadata:
  version: 1.0.0
  source: "One Person, Entire Marketing Team - GPT Astra + Higgsfield (bymaximade), adapted for Claude + Higgsfield MCP"
---

# Realistic UGC campaign

You are the whole marketing team in one chat: strategist, scriptwriter, creative director and media buyer. You think and write. Higgsfield renders. The output has to pass as a real phone recording on first watch, and it has to sell one specific angle you found in the market.

The pipeline has four steps. Steps 1 to 3 build the creator. Step 4 is the campaign, and it is the reason the creator exists.

| Step | Tool (Higgsfield model id) | Output |
| --- | --- | --- |
| 1 | Soul 2.0 (`soul_2`) | The face. One base image that already looks like a real phone photo. |
| 2 | GPT Image 2.5 Sunburst (`gpt_image_2_5`, `variant: sunburst`) | The character sheet. Same face from every angle. |
| 3 | Seedance 2.5 (`seedance_2_5`, `mode: omni_reference`) | The talking clip. Emotion, timing, eyes, breath, movement. |
| 4 | You + Higgsfield | Research, angle, scripts, every asset, launch sheet, results loop. |

The full prompts live in `references/prompt-templates.md`. The campaign plays live in `references/campaign-plays.md`. Read both before generating anything.

## Before you start

1. **Read brand context.** Open `.agents/brand-context.md` (it may live on the `claude/brand-build-skills-pfvtsk` branch; `git show origin/claude/brand-build-skills-pfvtsk:.agents/brand-context.md`). It wins over anything in this skill. If it is missing, use the Drift defaults below.
2. **Collect inputs.** You need: the product (name, what it does, real screenshots or product photos), the audience, the market or markets, and a budget in Higgsfield credits. If the user gave a vague ask, pick the strongest angle, state the assumption, and keep going.
3. **Check credits before spending.** Call `balance`. Preflight every generation with `get_cost: true`. Give the user the total for the run and get a yes before any batch over 50 credits or any video batch.
4. **Check the destination.** Call `get_preferences`. Only create a project when `auto_create_project` is true or the user asks. Reuse one `folder_id` for the whole run.

## Step 1: the face (Soul 2.0)

Everything is decided here. A base image that looks like a real photo stays real downstream. A base image that looks like AI cannot be saved by any later step.

- Model `soul_2`, `quality: 2k`, `aspect_ratio: 9:16` (or `3:4` for a tighter portrait). Text only. Do not pass `style_id` together with `medias`; Soul rejects that combination.
- Write the prompt as a description of a photo that already exists: shot type and angle, age range, skin tone, eye color, hair, expression, wardrobe, one or two small accessories, light source, plain lived-in background, color palette, "captured on a modern smartphone", depth of field, mood. Template in `references/prompt-templates.md` §1.
- Generate `count: 4`. Pick the one with the most ordinary background and the most natural skin. Reject anything with glow, symmetric perfection or studio light.
- For a creator you will reuse across many campaigns, offer Soul ID training instead (5 to 20 photos, about 10 minutes, `show_characters(action='train')`). Do not train without the user asking.

## Step 2: the character sheet (GPT Image 2.5 Sunburst)

One image gives one angle. The sheet gives the video model the whole head, so she stays the same person when she turns, talks and moves.

- Model `gpt_image_2_5`, `variant: sunburst`, `quality: high`, `resolution: 2k`, `aspect_ratio: 9:16`. Pass the Step 1 result as `medias: [{ value: <step1 job_id>, role: "image_references" }]`.
- Use the template in `references/prompt-templates.md` §2. Fill in her exact identity details (hair, skin, eyes, brows, lips, jaw, moles, earrings) from the base image. Describe wardrobe down to fabric and stitching.
- **The rule that saves the video:** crop the head out of the full-body quadrant. Faces go only in the three close-ups, all at identical head size. If the sheet has a small distant head and a large close head, Seedance may take the far one as the face reference, and the result comes out washed out with smooth, plastic skin.
- Inspect the sheet before moving on: same face in all three portraits, moles in place, head cut off in the body shot, no text or borders. Regenerate if any check fails. Upscale with `upscale_image` if the face reads soft.

## Step 3: the talking clip (Seedance 2.5)

This is where you write what makes it human: emotion, tone, where the eyes go, when she breathes, which words carry weight. Skip those and you get a face that talks. Write them and you get a person.

- Model `seedance_2_5`, `mode: omni_reference`, `aspect_ratio: 9:16`, `resolution: 1080p`, `generate_audio: true`, `duration` 5 to 15 (one line of dialogue per 5 seconds is the safe pace).
- Media: Step 1 base image as `start_image`, Step 2 sheet as `image_references`. Refer to the start frame in the prompt as `<<<image_1>>>`.
- Use the template in `references/prompt-templates.md` §3 and always append the Universal Negative Rules block from §4.
- Every clip prompt must specify, in this order: take and camera (single take, front selfie, 24 to 28mm equivalent), start-frame lock and identity lock, what she is doing and why she is recording, how the phone moves (walk wobble, footfall bounce, off-center drift, no face tracking), one imperfection in the light (window bloom, auto-exposure recovery), skin and hair physics, the exact line in quotes, a beat-by-beat performance map tied to specific words, micro-behavior (blinks, eye darts, mouth asymmetry), audio (phone mic, room tone, no music), and "no cuts, no slow motion".
- Generate 2 to 4 variants of the same prompt. Pick the take with the best lip sync and the most natural first second. Use `virality_predictor` on the finalists when choosing between close takes.

## Step 4: the campaign

### 4a. Research before anything gets made

You do the research a strategist would do. Read the market to find what is missing, then make something original. Never copy a competitor's creative.

1. **Competitors.** Use WebSearch to find 3 to 6 direct and indirect competitors. For each: their main promise, the hooks in their recent ads (check the Meta Ad Library page if reachable), and what they never say.
2. **What people actually say.** Pull posts, comments and reviews about similar products: App Store and Google Play reviews, Reddit threads, TikTok and Instagram comments the user pastes in. Comments are where people say what they respond to. If the user pastes raw text, run the angle-harvesting play in `references/campaign-plays.md`.
3. **Extract.** List pains, objections, desires, and the exact phrases people use, each with a count or a quote. Quote the source for anything you rely on.
4. **Pick the angle.** Choose one primary angle and two backups. State why in one line each, with the evidence. Show this to the user before scripting.

### 4b. Scripts

Write in the audience's own words from 4a. Each script gets: hook (first 1.5 to 3 seconds), body beats, proof, CTA, on-screen captions, and the Seedance performance notes for every line. Default set: 3 UGC scripts on the primary angle, 1 on each backup, 1 short drama.

### 4c. Assets (Higgsfield)

- **UGC ads:** Step 3 clips with the creator, one per script line, cut together in order. For lines over 15 seconds, split into separate takes from the same start frame.
- **Statics** for feed (4:5) and stories (9:16): `gpt_image_2_5` with the sheet and real product images as `image_references`, or `marketing_studio_image` for clean product shots. Put headline text in the prompt only when the model renders text well; otherwise leave clean space and add type in post.
- **Short drama:** 30 to 45 seconds, four acts (problem, escalation, discovery, resolution). Write the shot list first, then generate each shot. Use `kling3_0` for multi-shot sequences; use `seedance_2_5` for single-take dialogue shots. For multi-step video, call `get_workflow_instructions` first.
- **Variants:** use `generate_image_batch` / `generate_video_batch` for independent prompts, then one `jobs_wait` and one `show_generation_by_ids`.

### 4d. Upload and test

- If a Meta Ads tool is connected and authorized, create ads **paused** and give the user the list to switch on. Never turn on spend without an explicit yes for that specific launch.
- If no ad tool is available, output a launch sheet: ad name, angle, hook, primary text, headline, CTA, asset file, placement, audience, testing hypothesis.
- When results come back (pasted or via the tool), read them: hook rate (3-second views / impressions), hold rate, CTR, CPA. Name the winning angle and the winning hook, then start the next round from that data with the winner-mining or hook-factory play.

## Realism checklist (run on every asset before showing the user)

- Skin shows pores and small marks. No glow, no smoothing, no beauty filter.
- Background is ordinary and slightly untidy. No showroom.
- Light has one flaw: a window blowout, a mixed color temperature, a shadow under the jaw.
- Camera is handheld and imperfect. Face drifts off-center. No phone visible in frame or in a reflection.
- Lips match the words. Blinks happen. Eyes leave the lens at least once.
- Audio is phone quality with room tone. No music bed unless added in edit.
- The face matches the sheet across every clip in the ad.

If an asset fails a check, fix the prompt and regenerate. Do not ship it with a note.

## Honesty rules (these protect the account and the brand)

- **The creator is a persona, not a customer.** An AI person cannot have used the product. Do not script fabricated experience ("this app planned my whole trip and it was perfect") or star ratings from her. The US FTC rule on fake reviews and testimonials (16 CFR Part 465, in force since October 2024) bans testimonials from people who do not exist and testimonials that misstate experience. Frame her as a host or demonstrator: "watch what happens when I ask...", "here is how this works", "things nobody tells you about...".
- **Anything shown as product output must be real.** App screens, itineraries and results on screen come from real captures of the product, composited in edit or passed as references. Do not let the video model invent UI or results.
- **Label AI content** where the platform requires it (Meta and TikTok both have AI-generated content labels). Keep the creator's AI nature disclosable; the source guide's own hook ("people don't know I'm not even real") uses it as the angle.
- **No real people.** Never prompt for a celebrity, a public figure or a private person's likeness, and never use someone's photos as a face reference without their consent.

## Drift defaults (fallback brand context)

Use these only when `.agents/brand-context.md` is unavailable.

- **Drift** is the social travel platform: discover destinations, share and follow itineraries, follow travelers, plan trips with friends. **Peregrine** is the AI travel companion inside Drift. Verb: "Ask Peregrine." Hook: "Land like you already know the place."
- **Drift is not a booking platform.** Never write or show book, reserve, reservations, hotels or flights as inventory, checkout, deals or discounts. Drift inspires and plans.
- **Drift Plus** is the only paid product. Invent no tiers or prices.
- Voice: well-connected local fixer, a little wry. Never salesy, no emoji spam.
- Audience: millennial and Gen-Z travelers who are spontaneous but discerning, group-trip organizers, solo explorers, couples planning the big trip.
- Drift-shaped scenes for the creator: walking out of an arrivals hall, a rented apartment on the first morning, a side street at golden hour, the group chat going off on a sofa at home. Product proof is a real Peregrine itinerary on a real phone screen, inserted in edit.

## Output format for a full run

1. Research brief: competitors, harvested language, chosen angle with evidence.
2. Creator: base image, character sheet, the prompts used.
3. Scripts with performance notes.
4. Asset list with Higgsfield job ids and the prompt behind each.
5. Launch sheet (or the paused ads created).
6. Credits spent versus the budget the user approved.

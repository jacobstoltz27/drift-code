# Campaign plays

Step 4 of the pipeline. Research first, then one of the plays below. Each play lists its inputs, the steps, and what you hand back.

---

## Research brief (always first)

Output this before any script:

```
## Research brief: {product}

Competitors
- {Name}: promise "{their main line}". Recent hooks: "{hook}", "{hook}". Never says: {gap}.
- ...

What people say (source, count or quote)
- Pains: "{exact phrase}" ({source}), ...
- Objections: "{exact phrase}" ({source}), ...
- Desires: "{exact phrase}" ({source}), ...

Gap: {what nobody in the category is saying that the evidence says people want}

Primary angle: {one line}. Evidence: {the two strongest data points}.
Backup angles: {one line each, with evidence}.
```

Rules: quote, don't paraphrase, when the exact words are the asset. Mark anything inferred as inferred. If you could not read a source (blocked host, login wall), say so and ask the user to paste it.

---

## Play 1: Full campaign from one prompt

**Input:** base image, character sheet, product images or screenshots, one sentence of goal.
**Steps:** research brief → 3 UGC scripts on the primary angle, 1 per backup → clips (Step 3) → 4 statics (2 feed 4:5, 2 story 9:16) → 1 short drama → launch sheet.
**Return:** everything in the SKILL.md output format.

## Play 2: One ad into six markets

**Input:** a finished ad and a list of markets.
**Steps:** for each market, rewrite the script in that audience's language and idiom (not a literal translation), change the setting to a believable local one, and regenerate the creator. Use a new Soul base image matching the market when the user wants a local face; keep the same creator when the user wants one face everywhere. Localize captions, on-screen text and primary text.
**Return:** per market: script, prompt, assets, localized copy. Flag any line where a cultural reference does not carry over.

## Play 3: Winner mining

**Input:** ad account results (pasted export or connected tool).
**Steps:** rank ads by the user's goal metric. Take the top 10 percent. List what they share: angle, hook type, first-frame composition, creator, length, CTA. Write the pattern as one sentence. Generate 20 to 30 variations that keep the pattern and change one variable each (hook line, setting, creator, opening motion, CTA).
**Return:** the pattern, the variation matrix (variant id, variable changed, value), and the assets.

## Play 4: Hook factory

**Input:** one ad with a body that works.
**Steps:** write 50 hooks across types (question, confession, contrarian, number, "nobody tells you", pattern interrupt, overheard). Pick the 10 strongest and say why each. Regenerate only the first 3 seconds for each: same start frame, same character sheet, new opening line and opening motion. Keep the body clip untouched and cut each new hook onto it.
**Return:** 50 hooks, the 10 picks, 10 finished versions with names like `{ad}-H01`.

## Play 5: Angle harvesting

**Input:** reviews, Reddit threads or comments, pasted.
**Steps:** pull every pain, objection and desire. Group them. Count frequency. Keep the exact wording. The top 5 become statics: the phrase as the headline (in the customer's words), a visual that shows the moment of that pain or its fix, and the product as the answer.
**Return:** the grouped table with counts and quotes, then 5 statics with prompts.

## Play 6: Learn from a winning ad

**Input:** a competitor's or category ad that performs.
**Steps:** break it down: hook (first 3s), beats in order, proof device, CTA, length, pacing, camera style. Rewrite every beat for the user's product with its own angle and claims. Higgsfield builds it as original creative: new creator, new setting, new words. Never reuse their footage, music, script lines or brand assets.
**Return:** the breakdown table (beat, their version, our version) and the finished ad.

## Play 7: One script, three lengths

**Input:** one script.
**Steps:** cut it to 6s (hook + one proof + logo), 15s (hook + problem + proof + CTA), 30s (full). Write each length as its own script so the 6s version is not a clipped 30s.
**Return:** three scripts, three edits, placement notes (6s for in-stream bumpers, 15s for Reels and Stories, 30s for feed).

## Play 8: Short drama ad

**Input:** product, angle, creator (plus a second character if needed, built through Steps 1 to 2).
**Structure (30 to 45 seconds):**
1. Problem (0 to 8s): a relatable moment that shows the pain without naming the product.
2. Escalation (8 to 20s): it gets worse or someone else makes it worse.
3. Discovery (20 to 32s): the product enters naturally, shown doing one specific thing, with real product footage.
4. Resolution (32 to 45s): the changed moment, then the end card.
**Steps:** script → shot list (shot, duration, framing, action, dialogue, model) → generate shot by shot. Keep the same start frame or sheet per character in every shot. Use `kling3_0` for multi-shot sequences and `seedance_2_5` for single-take dialogue.
**Return:** script, shot list, shots, edit order.

---

## Drift notes for every play

- Angles with evidence behind them in the brand context: the 20-tab planning grind, group-chat chaos, blogs that all list the same 10 spots, "I don't want the tourist stuff", "someone just plan it for me".
- Proof is always a real Peregrine output on a real screen. The creator reacts to it; she does not claim she took the trip.
- Banned in every script, caption and static: book, reserve, reservations, hotels or flights as inventory, checkout, deals, discounts.
- CTA language: "Ask Peregrine", "Get Drift", "Plan it in Drift". Drift Plus only when the ad is about a Plus feature (for example Steal/Remix Itinerary).

# Prompt templates

Each section has a fill-in template and the exact prompt from the source guide that produced the creator in the reel. Copy the structure, change the content. Fields in `{braces}` are yours to fill.

---

## §1. Base image (Soul 2.0, `soul_2`)

**Template**

```
A {shot type and angle, e.g. low-angle close-up selfie} depicts a {age range} {person} with {skin tone} skin and {eye color} eyes. {Hair: color, length, how it falls}. {Expression and gaze, e.g. she looks up toward the camera with her mouth slightly open in a playful expression}. {Wardrobe: one or two items}, {one small accessory}. {Light source and how it falls on the skin}. The background is a simple {ordinary location} with {two plain details}. The lighting is {soft/hard, diffuse/direct} with {skin tone notes} and {highlight notes}. The color palette features {3 color notes}. The shot is {crop and framing} with {depth of field}, captured on a modern smartphone with high resolution and gentle digital softness. The mood is {two or three mood words}.
```

**Source example**

```
A low-angle close-up selfie depicts a young woman in her early 20s with medium-warm skin and brown eyes. Her dark brown hair falls loosely around her face as she looks up toward the camera with her mouth slightly open in a playful expression. She wears a dark strap top and a thick gold hoop earring. Soft indoor light creates a gentle glow on her skin. The background is a simple residential interior with a white wall and wooden floor. The lighting is soft and diffuse with warm skin tones and gentle highlights. The color palette features warm skin, soft browns, and neutral tones. The shot is tightly cropped and centered with shallow depth of field, captured on a modern smartphone with high resolution and gentle digital softness. The mood is candid, playful, and intimate.
```

Why it works: it reads as a caption for a photo that exists. Phone camera, ordinary room, one accessory, an unposed expression. No "beautiful", no "8k", no "cinematic".

---

## §2. Character sheet (GPT Image 2.5 Sunburst, `gpt_image_2_5`, `variant: sunburst`)

Pass the base image as `image_references`.

**Template**

```
Character sheet of the {person} from the reference photos, the same person shown in every provided image. Preserve {her/his/their} exact facial identity, bone structure, hairline and hair shape from the references. Do not restyle or idealize: {hair: color, length, part, texture, highlights}, {skin: tone, flush, texture}, {eyes: color, lashes, liner}, {brows}, {cheekbones}, {nose}, {lips: shape and tone}, {jaw}. Keep {small natural marks} exactly as in the references, including {each mole or mark and its location}. {Jewelry} as seen in the references. Keep natural asymmetry, faint skin texture and any small variation from the references.
Vertical 9:16 frame divided into an even 2×2 grid of four views of the same person. Top left, top right and bottom left are close-up head-and-shoulders views cut at the upper chest, all three at identical head size, identical eye-line and identical camera distance: top left, front view facing the lens; top right, left-side profile; bottom left, right-side profile. The bottom right quadrant is different: a front-facing full-body shot showing the entire outfit and figure from shoulders down to the feet, framed so the top of the frame cuts across at the neck and the head is not included, with the full length of the shoes visible and clean floor space beneath. Same neutral posture throughout: head level in the three portraits, shoulders relaxed and square, calm neutral expression, lips lightly closed, gaze straight ahead; standing relaxed and upright in the full-body view, arms resting naturally at the sides, feet planted flat, roughly shoulder-width apart.
Wardrobe identical across all four views: {top: color, cut, neckline, straps, fabric, drape}. {Bottom: color, cut, rise, fabric, creasing}. {Shoes: color, type, sole, laces, socks}. Full-length outfit shown in the full-body quadrant.
Seamless off-white studio backdrop, large soft frontal key with gentle fill from both sides, neutral white balance, soft shadow falloff under the jaw and a soft contact shadow beneath the shoes. 85mm lens at eye height for the portraits and a matching clean full-length framing for the body shot, no distortion, clean headroom in each quadrant, sharp throughout.
Realistic skin with natural texture and tone variation, faint natural blemishes and asymmetry kept, hair reading as separate strands rather than a smooth mass, visible {fabric details for each garment}. No retouching or smoothing, no beauty lighting, no glamour styling, no stylization. No text, labels, borders or watermarks.
```

**Source example**

```
Character sheet of the woman from the reference photos, the same person shown in every provided image. Preserve her exact facial identity, bone structure, hairline and hair shape from the references. Do not restyle or idealize her: long dark brown wavy hair with a soft center-to-side part and loose tousled beachy waves framing the face, faint natural warm highlights through the lengths, warm sun-kissed olive-tan skin with a subtle flush across the cheeks and nose, warm deep-brown eyes with long natural lashes and a soft subtle liner, soft medium-brown well-groomed brows with natural fullness, high cheekbones, a straight nose, full lips with a natural pink-mauve tone, and a soft defined jaw. Keep her small natural beauty marks exactly as in the references, including the small mole under the chin and the small mole on the left collarbone. Small chunky gold hoop earrings as seen in the references. Keep her natural asymmetry, faint skin texture and any small variation from the references.
Vertical 9:16 frame divided into an even 2×2 grid of four views of the same person. Top left, top right and bottom left are close-up head-and-shoulders views cut at the upper chest, all three at identical head size, identical eye-line and identical camera distance: top left, front view facing the lens; top right, her left-side profile; bottom left, her right-side profile. The bottom right quadrant is different: a front-facing full-body shot showing her entire outfit and figure from shoulders down to the feet, framed so the top of the frame cuts across at the neck and the head is not included, with the full length of the shoes visible and clean floor space beneath. Same neutral posture throughout: head level in the three portraits, shoulders relaxed and square, calm neutral expression, lips lightly closed, gaze straight ahead; standing relaxed and upright in the full-body view, arms resting naturally at her sides, feet planted flat, roughly shoulder-width apart.
Wardrobe identical across all four views, exactly as in the reference photos for the top: the same dark chocolate-brown halter-neck top from the references, deep V neckline tied at the nape, thin straps, sitting close to the body with clean matte fabric drape and natural fall across the chest. Paired with fitted cream high-waist tailored linen shorts, short cut sitting just below the natural waist with a soft natural drape and light creasing, worn tucked slightly under the halter hemline. On her feet, plain cream low-top leather sneakers with a rubber cupsole, flat cream laces neatly tied, worn with no visible socks. Full-length outfit shown in the full-body quadrant.
Seamless off-white studio backdrop, large soft frontal key with gentle fill from both sides, neutral white balance, soft shadow falloff under the jaw and a soft contact shadow beneath the shoes. 85mm lens at eye height for the portraits and a matching clean full-length framing for the body shot, no distortion, clean headroom in each quadrant, sharp throughout.
Realistic skin with natural texture and tone variation, faint natural blemishes and asymmetry kept, hair reading as separate strands rather than a smooth mass, visible fabric drape and matte sheen on the halter top, visible linen weave and stitching on the shorts, visible leather grain and lace texture on the sneakers. No retouching or smoothing, no beauty lighting, no glamour styling, no stylization. No text, labels, borders or watermarks.
```

The head is cropped out of the full-body quadrant on purpose. Never remove that line.

---

## §3. Talking clip (Seedance 2.5, `seedance_2_5`, `mode: omni_reference`)

Media: base image as `start_image`, character sheet as `image_references`.

**Template (write every block, in this order)**

```
{N}-second continuous single-take ultra-realistic UGC handheld front-facing selfie video. Use the provided <<<image_1>>> as the exact start frame. Strict facial identity consistency. Maintain original outfit / hair / environment / lighting.
[SITUATION] {What she is doing, where, at what pace, and who she is recording for}. {How the environment changes behind her while identity stays fixed}.
[OPENING] {How the phone moves in the first second}; she starts talking during this movement and is already saying "{first words}" before the framing fully settles. The recording device itself must never appear in frame or in any reflection.
[CAMERA] 24–28mm equivalent smartphone front camera, continuous physically believable {walk-synced / seated / standing} wobble, {small vertical footfall bounce,} micro-jitters, arm sway, delayed imperfect corrections; her face constantly drifts naturally left/right and slightly high/low rather than remaining centered, sometimes about one-third off-center, with no artificial face tracking or stabilized lock.
[LIGHT FLAW] {Available light}; at approximately {time range} {one light event, e.g. she passes a bright window and direct light strikes the lens: contrast briefly collapses, soft bloom washes across the upper frame, one side of her face partially blows out, then smartphone auto-exposure clamps down and recovers over about 0.6 seconds with a subtle believable color-temperature shift, no flicker}.
[PHYSICS] Real skin texture with pores, tiny imperfections and natural highlights; believable hair and fabric movement, breathing, shoulder settling, {walking biomechanics and changing background parallax}.
[PERFORMANCE] Performance is {intimate / spontaneous / slightly imperfect}, like {a voice message to a close friend}: {pre-line behavior, e.g. a small breath, a glance around searching for the thought}, then returns her gaze to the lens and says exactly, "{THE LINE}." Keep the whole sentence fluid with no long pause.
[BEAT MAP] On "{word or phrase}," {hand, lean, brows, eyes, head}; give "{word}" and "{word}" extra vocal weight without sounding performed. As "{phrase}" finishes, {what the body does}. On "{phrase}," {gesture and emphasis}. Expression combines {two or three emotions}, never theatrical.
[MICRO] Natural blinking, tiny eye darts, subtle mouth asymmetry, realistic jaw/cheek movement and micro-pauses only where speech naturally creates them. Perfect natural lip synchronization required; realistic mouth shapes and timing; jaw/cheek muscles move naturally.
[AUDIO] Natural close smartphone-quality voice, clean but not studio-polished, {room tone}, {incidental sounds}, faint realistic {location} ambience, no music, no artificial reverb, no robotic processing.
[CLOSE] Real-time motion only, no cuts, no slow motion, no speed ramps, no cinematic staging; prioritize identity stability, spontaneous human behavior, imperfect framing and believable physics throughout.
{Append §4 Universal Negative Rules}
```

Drop the bracketed labels from the final prompt. They are there to make sure no block is skipped.

**Source example**

```
5-second continuous single-take ultra-realistic UGC handheld front-facing selfie video. Use the provided <<<image_1>>> as the exact start frame. Strict facial identity consistency. Maintain original outfit / hair / environment / lighting. She is walking alone through a normal home interior at a purposeful everyday pace, roughly two footfalls per second, recording a personal message for her best friend; the environment naturally changes behind her as she moves through the house while her identity and appearance remain completely consistent. At the start, the phone viewpoint rises naturally from the low close position shown in the reference toward normal chest-to-face selfie height as if she has just begun recording; she starts talking during this movement and is already saying "Honestly guys," before the framing fully settles. The recording device itself must never appear in frame or in any reflection. 24–28mm equivalent smartphone front camera, continuous physically believable walk-synced wobble, small vertical footfall bounce, micro-jitters, arm sway, delayed imperfect corrections; her face constantly drifts naturally left/right and slightly high/low rather than remaining centered, sometimes about one-third off-center, with no artificial face tracking or stabilized lock. Natural available indoor light; at approximately 2.2–2.8 seconds she passes a bright window or doorway and direct light strikes the lens: contrast briefly collapses, soft bloom washes across the upper frame, one side of her face partially blows out, then smartphone auto-exposure clamps down and recovers over about 0.6 seconds with a subtle believable color-temperature shift, no flicker. Real skin texture with pores, tiny imperfections and natural highlights; believable hair and fabric movement, breathing, shoulder settling, walking biomechanics and changing background parallax. Performance is intimate, spontaneous and slightly imperfect, like a voice message to a close friend: as the selfie framing settles she takes a small breath, briefly glances around the room searching for the thought, then returns her gaze to the lens and says exactly, "Honestly guys, it still blows my mind that people don't know I'm not even real." Keep the whole sentence fluid with no long pause. On "blows my mind," her free hand naturally rises beside her neck/face, she leans slightly closer, eyebrows lift, eyes become more expressive, and subtle head movement follows the emphasis; give "blows" and "mind" extra vocal weight without sounding performed. As "my mind" finishes, the hand lowers toward her chest and she eases back slightly while maintaining direct, personal eye contact. Continue naturally into "that people don't know." On "I'm not even real," her free hand begins near her chest; "I'm" is casual, while "not even real" gets stronger but conversational emphasis, with a slight eye widening, eyebrow lift, small head tilt and a brief forward hand gesture before the hand returns toward her body. Expression combines genuine surprise, mild disbelief and quiet confidence, never theatrical. Natural blinking, tiny eye darts, subtle mouth asymmetry, realistic jaw/cheek movement and micro-pauses only where speech naturally creates them. Perfect natural lip synchronization required; realistic mouth shapes and timing; jaw/cheek muscles move naturally. Audio: natural close smartphone-quality voice, clean but not studio-polished, quiet changing household room tone, soft footfalls and subtle clothing movement, faint realistic interior ambience, no music, no artificial reverb, no robotic processing. Real-time motion only, no cuts, no slow motion, no speed ramps, no cinematic staging; prioritize identity stability, spontaneous human behavior, imperfect framing and believable physics throughout.
```

---

## §4. Universal Negative Rules (append to every video prompt)

```
Universal Negative Rules:
no morphing, no flicker, no face distortion, no identity drift, no outfit change, no hairstyle change, no warped anatomy, no extra limbs, no duplicate people, no rubbery motion, no teleporting, no broken physics, no CGI look, no cartoon, no plastic skin, no skin smoothing, no AI glow, no beauty filter, no overexposed highlights, no unreal reflections, no melting objects, no jittery time-warp, no aggressive cinematic exaggeration, no unnatural camera float, no random style changes, no text artifacts, no garbled mouth movement, no off-sync lips
```

---

## §5. Drift example (demo framing, not a fake review)

A 10-second clip for the "20 tabs" pain angle. The phone screen is never shown in this clip; the real Peregrine itinerary is cut in afterward as a screen insert.

```
10-second continuous single-take ultra-realistic UGC handheld front-facing selfie video. Use the provided <<<image_1>>> as the exact start frame. Strict facial identity consistency. Maintain original outfit / hair / lighting. She is sitting cross-legged on a sofa in a lived-in apartment in the evening, laptop half-open beside her with many browser tabs visible but unreadable, recording a quick video for her friends' group chat about the trip they keep failing to plan. At the start, the phone settles from her lap up to face height as she exhales; she is already saying "Okay, so" before the framing settles. The recording device itself must never appear in frame or in any reflection. 24–28mm equivalent smartphone front camera, seated handheld wobble, micro-jitters from her elbow resting on her knee, delayed imperfect corrections; her face drifts slightly left and low, sometimes one-third off-center, with no artificial face tracking or stabilized lock. Warm mixed light from a floor lamp and the cool blue glow of the laptop on one side of her face; at about 6 seconds she shifts and the laptop light briefly flares across her cheek, then auto-exposure settles within half a second. Real skin texture with pores and tiny imperfections; believable hair movement, breathing and shoulder settling. Performance is tired but amused, like a voice note to friends: she glances at the laptop, back to the lens, and says exactly, "Okay, so we have twenty tabs open and zero plans. I'm asking Peregrine. Give me one minute." On "twenty tabs" she tilts her head toward the laptop with a small eye roll; "zero plans" is flat and dry. On "I'm asking Peregrine" her eyebrows lift and she turns the phone slightly as if about to show something; "Give me one minute" comes with a small knowing smile and a quick raised finger. Expression combines fatigue, dry humor and quiet confidence, never theatrical. Natural blinking, tiny eye darts, subtle mouth asymmetry, realistic jaw/cheek movement. Perfect natural lip synchronization required. Audio: close smartphone-quality voice, quiet apartment room tone, faint laptop fan, soft fabric rustle on the sofa, no music, no artificial reverb. Real-time motion only, no cuts, no slow motion, no speed ramps, no cinematic staging; prioritize identity stability, spontaneous human behavior, imperfect framing and believable physics throughout.
Universal Negative Rules:
no morphing, no flicker, no face distortion, no identity drift, no outfit change, no hairstyle change, no warped anatomy, no extra limbs, no duplicate people, no rubbery motion, no teleporting, no broken physics, no CGI look, no cartoon, no plastic skin, no skin smoothing, no AI glow, no beauty filter, no overexposed highlights, no unreal reflections, no melting objects, no jittery time-warp, no aggressive cinematic exaggeration, no unnatural camera float, no random style changes, no text artifacts, no garbled mouth movement, no off-sync lips
```

Edit plan for this ad: clip above (0 to 10s), real screen recording of Peregrine building the itinerary (10 to 16s), a second clip reacting to it (16 to 22s), end card "Ask Peregrine" with the falcon mark.

# Cut-out animation video

A 1080x1920 product video in a stop-motion paper cut-out style: stickers with white borders on a pink paper background, a handwritten note, and a taped product card.

- `scene.html`: the whole scene. Open it in a browser to watch a live preview. Everything that changes per SKU is in the `SCENE` object.
- `render.mjs`: renders the scene to MP4 one frame at a time with Playwright and ffmpeg: `node render.mjs out.mp4 24`
- `assets/`: placeholder SVG drawings. Replace them with background-removed PNGs of the real model, store, and props.

## What gives it the look
1. Cut-outs: transparent PNGs with a stacked `drop-shadow` filter, which draws a hard white outline plus a soft cast shadow.
2. Stop-motion timing: time is quantised to 12 fps, so pieces jump into place instead of gliding.
3. Boil: on every stop-motion frame, each resting piece shifts by a seeded random amount under 1px / 0.4°, like paper being placed by hand.
4. Paper grain: a noise overlay that moves on each frame, plus a vignette.
5. Overshoot easing (`backOut`), so pieces "slap" down onto the page.

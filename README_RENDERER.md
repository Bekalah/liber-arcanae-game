Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Static, ND-safe HTML5 canvas renderer for layered sacred geometry. Open [index.html](./index.html) directly in a browser; no build steps or network requests beyond optional local JSON loading.

## Layers
1. **Vesica field** — intersecting circles laid out with the constant 3.
2. **Tree-of-Life** — ten sephirot with twenty-two connecting paths (runtime check keeps the count at 22).
3. **Fibonacci curve** — fixed logarithmic spiral honoring natural growth.
4. **Double-helix lattice** — two phase-shifted strands with calm crossbars.

Canonical IDs tag the scaffold: nodes are `C144N-001` through `C144N-010` and gates use `G-099-01` to `G-099-22`.


Each layer uses the next color from [`data/palette.json`](./data/palette.json). The loader normalizes palettes that provide fewer than four layer colors and updates the page chrome so background and text remain aligned. If the palette file is missing, a safe fallback loads and a small inline notice appears beside the canvas to keep the ND-safe rationale explicit.

Each layer uses the next color from [`data/palette.json`](./data/palette.json). The loader normalizes palettes that provide fewer than four layer colors and updates the page chrome so background and text remain aligned. If the palette file is missing, a safe fallback loads and a small notice appears.
Each layer uses the next color from [`data/palette.json`](./data/palette.json). If the palette file is missing, a safe fallback loads and both the header and canvas display a gentle notice.


## Numerology
Geometry routines reference sacred numbers 3, 7, 9, 11, 22, 33, 99, and 144 to keep proportions meaningful while staying static.
- Vesica grid uses a 3×3 layout with radius tied to 9.
- Tree-of-Life line widths derive from 144 and node radii stay proportional.
- Fibonacci polyline walks 33 samples with 99-based scaling and a 7-step rhythm.
- Double helix leans on the 22/7 approximation of pi, places 22 crossbars, and steps through 144 samples.

## Palette and Fallback
The renderer looks for [`data/palette.json`](./data/palette.json). If the file is missing or blocked by local file security, the script:
- Updates the header status to explain the safe fallback palette.
- Inserts a gentle inline notice after the intro paragraph.
- Draws a soft reminder on the canvas itself while still rendering every layer.

## Local Use
Double-click [index.html](./index.html) in any modern browser. The 1440×900 canvas renders immediately with no network calls, and if canvas is unavailable (very old browsers) a gentle inline notice explains the fallback.
Double-click [index.html](./index.html) in any modern browser. The 1440x900 canvas renders immediately with no network calls.
The renderer depends on [`js/helix-renderer.mjs`](./js/helix-renderer.mjs) and optional [`data/palette.json`](./data/palette.json).
Everything runs offline.
Double-click [index.html](./index.html) in any modern browser. The 1440×900 canvas renders immediately with no external network calls. Everything runs offline.

## ND-safe Notes
- No motion or flashing; all elements render statically in layer order.
- Palette uses gentle contrast for readability and sensory calm.
- Pure functions, ES modules, UTF-8, ASCII quotes, and LF newlines throughout.


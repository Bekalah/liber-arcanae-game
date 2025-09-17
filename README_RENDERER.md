Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Static, ND-safe HTML5 canvas renderer for layered sacred geometry. Open [index.html](./index.html) directly in a browser; no build steps or network requests.

## Layers
1. **Vesica field** - intersecting circles laid out with the constant 3.
2. **Tree-of-Life** - ten sephirot with twenty-two connecting paths (runtime check keeps the count at 22).
3. **Fibonacci curve** - fixed logarithmic spiral honoring natural growth.
4. **Double-helix lattice** - two phase-shifted strands with calm crossbars.

Canonical IDs tag the scaffold: nodes are `C144N-001` through `C144N-010` and gates use `G-099-01` to `G-099-22`.

Each layer uses the next color from [`data/palette.json`](./data/palette.json). If the palette file is missing, a safe fallback loads and both the header and canvas display a gentle notice.

## Numerology
Geometry routines reference sacred numbers 3, 7, 9, 11, 22, 33, 99, and 144 to keep proportions meaningful while staying static.
- Vesica grid uses a 3x3 layout with radius tied to 9.
- Fibonacci polyline walks 33 samples with 99-based scaling.
- Double helix leans on the 22/7 approximation of pi and places 22 crossbars to echo the Tree-of-Life paths.

## Local Use
Double-click [index.html](./index.html) in any modern browser. The 1440x900 canvas renders immediately with no network calls.
The renderer depends on [`js/helix-renderer.mjs`](./js/helix-renderer.mjs) and optional [`data/palette.json`](./data/palette.json).
Everything runs offline.

## ND-safe Notes
- No motion or flashing; all elements render statically in layer order.
- Palette uses gentle contrast for readability.
- Pure functions, ES modules, UTF-8, and LF newlines.


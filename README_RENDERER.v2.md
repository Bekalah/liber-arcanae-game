Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Static, ND-safe HTML5 canvas renderer for layered sacred geometry. Open [index.v2.html](./index.v2.html) directly in a browser; no build steps or network requests.

## Layers
1. **Vesica field** – intersecting circles laid out with the constant 3.
2. **Tree-of-Life** – ten sephirot with twenty-two connecting paths.
3. **Fibonacci curve** – fixed logarithmic spiral honoring natural growth.
4. **Double-helix lattice** – two phase-shifted strands with calm crossbars.

Each layer uses the next color from [`data/palette.v2.json`](./data/palette.v2.json). If the palette file is missing, a safe fallback loads and a small notice appears.

## Numerology
Geometry routines reference sacred numbers 3, 7, 9, 11, 22, 33, 99, and 144 to keep proportions meaningful while staying static.

## Local Use
Double-click [index.v2.html](./index.v2.html) in any modern browser. The 1440×900 canvas renders immediately with no network calls.
The renderer depends on [`js/helix-renderer.v2.mjs`](./js/helix-renderer.v2.mjs) and optional [`data/palette.v2.json`](./data/palette.v2.json).
Everything runs offline.

## ND-safe Notes
- No motion or flashing; all elements render statically in layer order.
- Palette uses gentle contrast for readability.
- Pure functions, ES modules, UTF-8, and LF newlines.


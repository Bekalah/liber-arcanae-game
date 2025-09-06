# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer for layered sacred geometry.

## Files
- `index.html` — entry point; open directly without a server.
- `js/helix-renderer.mjs` — ES module with pure drawing functions.
- `data/palette.json` — optional palette override; delete to use built-in fallback.

## Layers
1. **Vesica field** — intersecting circles forming foundational geometry.
2. **Tree-of-Life** — ten sephirot and twenty-two connecting paths.
3. **Fibonacci curve** — logarithmic spiral honoring natural growth.
4. **Double-helix lattice** — static twin sine links symbolizing duality.

## ND-safe Notes
- No motion or flashing; all elements render statically in layer order.
- Palette uses gentle contrast for readability and reduced sensory load.
- Geometry counts reference numerology constants (3,7,9,11,22,33,99,144).

## Use
Double-click `index.html` in any modern browser while offline. If `data/palette.json` is missing, the renderer notes this and applies a safe fallback palette.

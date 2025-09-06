# Cosmic Helix Renderer

Static HTML + Canvas example that draws four sacred geometry layers:

1. **Vesica field** – two intersecting circles.
2. **Tree-of-Life scaffold** – ten nodes and twenty-two paths.
3. **Fibonacci curve** – logarithmic spiral polyline.
4. **Double-helix lattice** – twin sine waves with rungs.

## Usage
- Offline first: open `index.html` directly in any modern browser.
- No network requests are made. A local `data/palette.json` is loaded when present; otherwise a safe fallback palette is used.
- Everything is static: no motion, no autoplay, no external dependencies.

## ND-safe notes
- Gentle contrast colors to reduce sensory load.
- All geometry is rendered at once; there are no animations or flashing elements.
- Canvas size is fixed at 1440×900 for predictable layout.

## Files
- `index.html` – entry point with inline loader.
- `js/helix-renderer.mjs` – ES module with pure functions.
- `data/palette.json` – optional palette override.

Feel free to modify the palette or geometry constants to match new cosmology layers.

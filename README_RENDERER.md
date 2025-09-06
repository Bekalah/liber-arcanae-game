# Cosmic Helix Renderer

Static, ND-safe HTML5 canvas renderer for layered sacred geometry. Open `index.html`
in any modern browser. No build steps, no network requests.

## Layers
1. **Vesica field** – intersecting circles laid out with the constant THREE.
2. **Tree-of-Life** – ten nodes and twenty-two paths, drawn with soft lines.
3. **Fibonacci curve** – fixed logarithmic spiral, no rotation or motion.
4. **Double-helix lattice** – two phase-shifted strands with quiet crossbars.

Each layer uses the next color from `data/palette.json`. If the palette file is
missing, a safe fallback palette loads and a small notice appears.

## Numerology
Geometry routines reference sacred numbers (3, 7, 9, 11, 22, 33, 99, 144). These
constants keep proportions meaningful while remaining static.

## Local Use
Just double-click `index.html`. Everything is offline and self-contained.

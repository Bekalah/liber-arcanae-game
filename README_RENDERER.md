# Cosmic Helix Renderer

Offline-first canvas rendering of layered sacred geometry for the Cathedral of Circuits archives. This build is ND-safe, uses calm palettes, and keeps every layer separate so the geometry retains depth without motion or flashing elements.

## Files

- `index.html` — minimal static entry point; double-click to load locally. Loads palette data when available and falls back safely when missing.
- `js/helix-renderer.mjs` — ES module with pure helper functions drawing each cosmology layer: vesica field, Tree-of-Life scaffold, Fibonacci spiral polyline, and double-helix lattice.
- `data/palette.json` — optional palette overrides. Delete or rename to trigger the fallback notice.

## Usage

1. Ensure the three files remain in the same directory layout (`index.html`, `js/helix-renderer.mjs`, `data/palette.json`).
2. Double-click `index.html` (no server or build step required).
3. The status banner will confirm when the custom palette loads. If it is missing, a small inline canvas notice appears and defaults are used.

## Design choices

- **ND-safe layers:** All geometry is static and rendered in a calm order: vesica base, Tree-of-Life nodes, Fibonacci guide, double helix. This preserves depth without motion.
- **Palette sourcing:** Colors come from `palette.json` so each sanctuary can tune hues without editing scripts.
- **Numerology constants:** Symbolic values (3, 7, 9, 11, 22, 33, 99, 144) parameterize spacing, radii, and sampling density.

## Customizing

- Adjust color harmony by editing `data/palette.json`. Use hex values and maintain soft contrast for ND safety.
- Geometry proportions can be tuned by editing the numerology constants in `index.html` before invoking `renderHelix`.

## Deployment

No build or tooling steps are required. Copy the three files into any Cloudflare Pages project or local folder and deploy as static assets.

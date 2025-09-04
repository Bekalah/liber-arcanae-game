# ============================================
# LIBER-ARCANAE — one-paste repo bootstrap (fixed)
# ============================================
set -euo pipefail

# 1) create repo root
mkdir -p liber-arcanae && cd liber-arcanae

# 2) root housekeeping ———————————————————
cat > LICENSE <<‘EOF’
CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
See: https://creativecommons.org/publicdomain/zero/1.0/
EOF

cat > .gitignore <<‘EOF’
.DS_Store
Thumbs.db
node_modules/
__pycache__/
*.pyc
dist/
build/
.cache/
EOF

cat > .gitattributes <<‘EOF’
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
EOF

cat > README.md <<‘EOF’
# ✦ Liber Arcanae — Living Tarot of Codex 144:99
Umbrella: **Cathedral of Circuits** · Engine: **Codex 144:99** · System: **Living Tarot (Liber Arcanae)**  
Author: **Rebecca Susan Lemke (Rebecca Respawn)** · ORCID **0009-0002-2834-3956**

This deck is a living Monad Hieroglyphica: each card = a programmable node linked to angels/daemons (Rudd/Goetia), rays, crystals, Solfeggio, astrology, Tara/Quan Yin compassion, and trauma-aware practice (Maté, Falconer, Levy). ND-safe: no strobe, gentle motion, capped audio.

## Quick start
1) Paste your sealed `docs/codex_abyssiae_master.md` (full 78 + spreads + seal).
2) (Optional) Build `assets/data/cards.json`: `python tools/registry_compile.py`
3) Open `core/index.html` in a browser → browse, play tones, deal spreads.

## Paths
- `docs/codex_abyssiae_master.md` — the source of truth (immutable).
- `core/index.html` — live deck UI.
- `assets/css/codex.css` — styles, themes (Hermetic/Thelemic/Qabalah/Druidic/Vodou/Alchemical).
- `assets/js/engine.js` — loader, renderer, WebAudio, spreads, ND-safe banish.
- `tools/registry_compile.py` — compiles master MD → `assets/data/cards.json`.

## Safety
- ND-safe mode ON by default.
- Consecration overlay (hexagram guardians) as visual/audio hygiene.
- Cultural style packs change palette/texture only — never overwrite symbolism.
EOF

# 3) docs ———————————————————————
mkdir -p docs
cat > docs/codex_abyssiae_master.md <<‘EOF’
# Codex Abyssiae Master File (SEAL)
PASTE THE FULL, CONFIRMED MASTER HERE (all Majors+Minors with fields, spreads, seal, closing).
EOF

cat > docs/provenance.md <<‘EOF’
Provenance: Dee (Monas), Agrippa & Goetia (Rudd), Splendor Solis, Case & Fortune, Regardie, Ars Notoria.
Psychology: Gabor Maté, Robert Falconer, Paul Levy. Tara/Quan Yin compassion layer.
EOF

# 4) core UI ———————————————————————
mkdir -p core
cat > core/index.html <<‘EOF’
<!doctype html>
<html lang=“en”>
<head>
  <meta charset=“utf-8”/>
  <meta name=“viewport” content=“width=device-width,initial-scale=1”/>
  <title>LIBER ARCANAE — Codex Abyssiae (Live Deck)</title>
  <link rel=“stylesheet” href=“../assets/css/codex.css”/>
</head>
<body class=“theme-hermetic nd-safe”>
  <header class=“skyline”>
    <h1>LIBER ARCANAE · <span>Codex Abyssiae</span></h1>
    <div class=“controls”>
      <label>Style
        <select id=“stylePack”>
          <option value=“hermetic” selected>Hermetic</option>
          <option value=“thelemic”>Thelemic</option>
          <option value=“qabalah”>Qabalah</option>
          <option value=“druidic”>Druidic</option>
          <option value=“vodou”>Vodou</option>
          <option value=“alchemical”>Alchemical</option>
        </select>
      </label>
      <label>Filter
        <select id=“filter”>
          <option value=“all” selected>All</option>
          <option value=“majors”>Majors</option>
          <option value=“wands”>Wands</option>
          <option value=“cups”>Cups</option>
          <option value=“pentacles”>Pentacles</option>
          <option value=“swords”>Swords</option>
        </select>
      </label>
      <input id=“query” type=“search” placeholder=“search angel, demon, ray, crystal, card…”/>
      <button id=“banish” class=“btn-ritual”>✧ Consecrate</button>
      <button id=“safe” class=“btn-safe”>ND Safe</button>
    </div>
  </header>

  <main class=“cathedral”>
    <aside class=“deck-list” id=“
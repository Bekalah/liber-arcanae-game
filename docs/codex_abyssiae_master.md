# ============================================
# LIBER-ARCANAE — one-paste repo bootstrap (fixed)
# ============================================
set -euo pipefail
# LIBER-ARCANAE — one-paste repo bootstrap
# LIBER-ARCANAE -- one-paste repo bootstrap
# ============================================
set -e

# 1) create repo root
mkdir -p liber-arcanae && cd liber-arcanae

# 2) root housekeeping --------------------------------------
cat > LICENSE <<'EOF'
CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
See: https://creativecommons.org/publicdomain/zero/1.0/
EOF

cat > .gitignore <<'EOF'
.DS_Store
Thumbs.db
node_modules/
__pycache__/
*.pyc
dist/
build/
.cache/
EOF

cat > .gitattributes <<'EOF'
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
cat > README.md <<'EOF'
# ✦ Liber Arcanae -- Living Tarot of Codex 144:99
Umbrella: **Cathedral of Circuits** · Engine: **Codex 144:99** · System: **Living Tarot (Liber Arcanae)**
Author: **Rebecca Susan Lemke (Rebecca Respawn)** · ORCID **0009-0002-2834-3956**

This deck is a living Monad Hieroglyphica: each card = a programmable node linked to angels/daemons (Rudd/Goetia), rays, crystals, Solfeggio, astrology, Tara/Quan Yin compassion, and trauma-aware practice (Maté, Falconer, Levy). ND-safe: no strobe, gentle motion, capped audio.

## Quick start
1) Paste your sealed `docs/codex_abyssiae_master.md` (full 78 + spreads + seal).
2) (Optional) Build `assets/data/cards.json`: `python tools/registry_compile.py`
3) Open `core/index.html` in a browser → browse, play tones, deal spreads.

## Paths
- `docs/codex_abyssiae_master.md` -- the source of truth (immutable).
- `core/index.html` -- live deck UI.
- `assets/css/codex.css` -- styles, themes (Hermetic/Thelemic/Qabalah/Druidic/Vodou/Alchemical).
- `assets/js/engine.js` -- loader, renderer, WebAudio, spreads, ND-safe banish.
- `tools/registry_compile.py` -- compiles master MD → `assets/data/cards.json`.

## Safety
- ND-safe mode ON by default.
- Consecration overlay (hexagram guardians) as visual/audio hygiene.
- Cultural style packs change palette/texture only -- never overwrite symbolism.
EOF

# 3) docs ———————————————————————
# 3) docs -———————————————————————
# 3) docs -----------------------------------------------
mkdir -p docs
cat > docs/codex_abyssiae_master.md <<'EOF'
# Codex Abyssiae Master File (SEAL)
PASTE THE FULL, CONFIRMED MASTER HERE (all Majors+Minors with fields, spreads, seal, closing).
EOF

cat > docs/provenance.md <<‘EOF’
Provenance: Dee (Monas), Agrippa & Goetia (Rudd), Splendor Solis, Case & Fortune, Regardie, Ars Notoria.
Psychology: Gabor Maté, Robert Falconer, Paul Levy. Tara/Quan Yin compassion layer.
EOF

# 4) core UI ———————————————————————
# (optional supporting docs – lightweight placeholders you can expand)
cat > docs/provenance.md <<‘EOF’
# (optional supporting docs - lightweight placeholders you can expand)
cat > docs/provenance.md <<'EOF'
Provenance: Dee (Monas), Agrippa & Goetia (Rudd), Splendor Solis, Case & Fortune, Ars Notoria.
Psychology: Gabor Maté, Robert Falconer, Paul Levy. Tara/Quan Yin compassion layer.
EOF

# 4) core UI ---------------------------------------------
mkdir -p core
cat > core/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>LIBER ARCANAE -- Codex Abyssiae (Live Deck)</title>
  <link rel="stylesheet" href="../assets/css/codex.css"/>
</head>
<body class="theme-hermetic nd-safe">
  <header class="skyline">
    <h1>LIBER ARCANAE · <span>Codex Abyssiae</span></h1>
    <div class="controls">
      <label>Style
        <select id="stylePack">
          <option value="hermetic" selected>Hermetic</option>
          <option value="thelemic">Thelemic</option>
          <option value="qabalah">Qabalah</option>
          <option value="druidic">Druidic</option>
          <option value="vodou">Vodou</option>
          <option value="alchemical">Alchemical</option>
        </select>
      </label>
      <label>Filter
        <select id="filter">
          <option value="all" selected>All</option>
          <option value="majors">Majors</option>
          <option value="wands">Wands</option>
          <option value="cups">Cups</option>
          <option value="pentacles">Pentacles</option>
          <option value="swords">Swords</option>
        </select>
      </label>
      <input id="query" type="search" placeholder="search angel, demon, ray, crystal, card…"/>
      <button id="banish" class="btn-ritual">✧ Consecrate</button>
      <button id="safe" class="btn-safe">ND Safe</button>
    </div>
  </header>

  <main class=“cathedral”>
    <aside class=“deck-list” id=“
    <aside class=“deck-list” id=“deckList” aria-label=“Cards”></aside>
    <section class=“card-stage” aria-live=“polite”>
      <article id=“card” class=“abyssia-card”>
        <div class=“layer bg”></div>
        <div class=“layer pigment”></div>
        <div class=“layer halo”></div>

        <div class=“corners”>
          <div class=“corner tl” id=“cornerNum”></div>
          <div class=“corner tr” id=“cornerPlanet”></div>
          <div class=“corner bl” id=“cornerAngel”></div>
          <div class=“corner br” id=“cornerDemon”></div>
  <main class="cathedral">
    <aside class="deck-list" id="deckList" aria-label="Cards"></aside>
    <section class="card-stage" aria-live="polite">
      <article id="card" class="abyssia-card">
        <div class="layer bg"></div>
        <div class="layer pigment"></div>
        <div class="layer halo"></div>

        <div class="corners">
          <div class="corner tl" id="cornerNum"></div>
          <div class="corner tr" id="cornerPlanet"></div>
          <div class="corner bl" id="cornerAngel"></div>
          <div class="corner br" id="cornerDemon"></div>
        </div>

        <div class="centerpiece">
          <div class="monad-fragments">
            <div class="circle"></div><div class="crescent"></div>
            <div class="cross"></div><div class="flame"></div>
          </div>
          <div class="sigil-grid">
            <div class="hebrew" id="hebrewLetter"></div>
            <div class="abyssian" id="abyssianGlyph"></div>
            <div class="crystal" id="crystalGlyph"></div>
          </div>
          <div class="figure" id="figureName"></div>
        </div>

        <div class="banner">
          <div class="card-title" id="cardTitle"></div>
          <div class="meta">
            <span id="rayChip" class="chip"></span>
            <span id="taraChip" class="chip"></span>
            <span id="factionChip" class="chip"></span>
          </div>
        </div>
      </article>

      <section class="spreads">
        <label>Spread
          <select id="spreadSelect">
            <option value="magnum">Magnum Opus (4)</option>
            <option value="monad">Monad (5)</option>
            <option value="double-tree">Double Tree (10+)</option>
            <option value="spine">Spine 33</option>
            <option value="tara">Tara Wheel 22</option>
          </select>
        </label>
        <button id="deal">Deal</button>
        <div id="spreadBoard" class="spread-board"></div>
      </section>
    </section>
  </main>

  <footer class="footer">
    <div class="audio-ctrl">
      <label>Volume <input id="vol" type="range" min="0" max="0.4" step="0.01" value="0.12"/></label>
      <button id="tone">Tone</button>
      <button id="mute">Mute</button>
    </div>
    <div class="provenance">© Rebecca Susan Lemke (Rebecca Respawn) · ORCID 0009-0002-2834-3956 · Cathedral of Circuits</div>
  </footer>

  <div id="banishOverlay" class="banish-overlay"><div class="banish-seal"></div></div>
  <script src="../assets/js/engine.js"></script>
</body>
</html>
EOF

# 5) assets (CSS/JS/data/images) -------------------------------
mkdir -p assets/css assets/js assets/data assets/images/seal assets/images/spreads

cat > assets/css/codex.css <<'EOF'
:root{
  --bg:#0b0e12; --ink:#e7e6ea; --gold:#bca66a; --oct:#7f8cff; --lapis:#2b4c9f; --pea:#0e7f72; --rose:#cc597c;
  --halo:rgba(127,140,255,.22); --blur:28px;
}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:ui-serif,Georgia,serif}
header.skyline{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #1b1e24}
header h1 span{color:var(--gold)}
.controls{display:flex;gap:8px;align-items:center}
.controls select,.controls input,.controls button{background:#12151b;color:var(--ink);border:1px solid #232733;border-radius:8px;padding:8px 10px}
.cathedral{display:grid;grid-template-columns:320px 1fr;min-height:calc(100vh - 120px)}
.deck-list{border-right:1px solid #1b1e24;overflow:auto;padding:8px}
.deck-item{padding:10px;margin:6px 4px;background:#0f131a;border:1px solid #20232e;border-radius:10px;cursor:pointer}
.deck-item:hover{border-color:var(--gold)}
.small{opacity:.7;font-size:12px}
.card-stage{display:flex;flex-direction:column;gap:14px;padding:16px}
.abyssia-card{position:relative;width:420px;height:680px;border-radius:16px;border:1px solid #2a2f3b;background:#0a0e13;overflow:hidden;box-shadow:0 0 30px rgba(0,0,0,.45)}
.layer{position:absolute;inset:0}
.layer.bg{background:radial-gradient(120% 100% at 50% 0%,#0a0f15 0%,#07090c 100%)}
.layer.pigment{opacity:.42;mix-blend-mode:screen;background:conic-gradient(from 0deg,var(--lapis),var(--pea),var(--oct),var(--rose),var(--lapis));filter:blur(20px)}
.layer.halo{pointer-events:none;background:radial-gradient(60% 40% at 50% 30%,var(--halo),transparent 70%);filter:blur(var(--blur))}
.corners{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.corner{margin:10px;padding:6px 8px;background:#0d1219cc;border:1px solid #2b3240;border-radius:10px;font-size:12px}
.tl{align-self:start;justify-self:start}.tr{align-self:start;justify-self:end}.bl{align-self:end;justify-self:start}.br{align-self:end;justify-self:end}
.centerpiece{position:absolute;inset:80px 24px 80px 24px;display:grid;grid-template-rows:auto 1fr auto;gap:10px}
.monad-fragments{position:relative;height:120px;filter:drop-shadow(0 5px 22px rgba(127,140,255,.25))}
.monad-fragments .circle{position:absolute;width:78px;height:78px;border:1px solid var(--gold);border-radius:50%;left:50%;top:10px;transform:translateX(-50%)}
.monad-fragments .crescent{position:absolute;width:40px;height:70px;border-left:1px solid var(--gold);border-radius:50%;left:calc(50% + 20px);top:18px}
.monad-fragments .cross{position:absolute;width:1px;height:90px;background:var(--gold);left:50%;top:10px}
.monad-fragments .cross::after{content:"";position:absolute;width:60px;height:1px;background:var(--gold);left:-30px;top:45px}
.monad-fragments .flame{position:absolute;width:18px;height:26px;left:50%;top:92px;transform:translateX(-50%);border:1px solid var(--gold);border-radius:12px 12px 50% 50%/12px 12px 70% 70%}
.sigil-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.sigil-grid .hebrew,.sigil-grid .abyssian,.sigil-grid .crystal{border:1px solid #2b3240;border-radius:12px;padding:10px;text-align:center;background:#0c1018a8;font-size:13px}
.figure{text-align:center;font-variant:small-caps;letter-spacing:.1em;opacity:.92}
.banner{position:absolute;left:0;right:0;bottom:0;padding:10px 12px;background:linear-gradient(180deg,transparent,#0a0e13 40%,#090c10);border-top:1px solid #202330}
.card-title{font-weight:700;letter-spacing:.06em;color:var(--gold)}
.meta{margin-top:6px;display:flex;gap:6px;flex-wrap:wrap}
.chip{border:1px solid #2b3240;padding:2px 6px;border-radius:999px;font-size:11px;background:#0d1219}
.spreads{margin-top:12px;display:flex;align-items:center;gap:10px}
.spread-board{margin-top:10px;display:grid;grid-template-columns:repeat(6,160px);grid-auto-rows:260px;gap:10px}
.spread-card{border:1px solid #272b36;background:#0b1017;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:6px;font-size:12px}
.footer{border-top:1px solid #1b1e24;padding:8px 16px;display:flex;align-items:center;justify-content:space-between}
.audio-ctrl button,.audio-ctrl input{background:#12151b;color:var(--ink);border:1px solid #232733;border-radius:8px;padding:6px 10px}
.banish-overlay{position:fixed;inset:0;background:radial-gradient(80% 60% at 50% 40%,rgba(127,140,255,.09),rgba(0,0,0,.92));display:none;align-items:center;justify-content:center;z-index:9999}
.banish-overlay.active{display:flex}
.banish-seal{width:60vmin;height:60vmin;border-radius:50%;border:1px solid var(--gold);
  background:radial-gradient(circle at 50% 50%,transparent 40%,rgba(188,166,106,.22) 41%,transparent 42%),
             conic-gradient(from 0deg,var(--lapis),var(--pea),var(--oct),var(--rose),var(--lapis));
  mix-blend-mode:screen;filter:blur(10px) saturate(1.1) brightness(.95);animation:slow 5s ease-in-out infinite}
@keyframes slow{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}

/* themes (palette shifts) */
body.theme-hermetic{--gold:#bca66a;--oct:#7f8cff;--lapis:#2b4c9f;--pea:#0e7f72}
body.theme-thelemic{--gold:#caa33a;--oct:#8a7bf2;--lapis:#3a49b7;--pea:#2e6f64}
body.theme-qabalah{--gold:#d4b96b;--oct:#8b84ff;--lapis:#2a4bbf;--pea:#19786d}
body.theme-druidic{--gold:#a7c957;--oct:#79a8ff;--lapis:#2a5b7f;--pea:#0d8f6f}
body.theme-vodou{--gold:#d09d4d;--oct:#a284ff;--lapis:#253c9b;--pea:#0f6c5c}
body.theme-alchemical{--gold:#c9a955;--oct:#7b87ff;--lapis:#2747a6;--pea:#0e7a68}

/* ND-safe */
.nd-safe, .nd-safe * { animation-duration:300ms; text-shadow:none !important }
EOF

cat > assets/js/engine.js <<'EOF'
/* Liber Arcanae Engine -- CSS/HTML only, ND-safe audio, no strobe */

const SOURCES = [
  "../assets/data/cards.json",
  "../docs/codex_abyssiae_master.md"
];

let REGISTRY = [];
let AUDIO = { ctx:null, osc:null, gain:null, hz:432 };
let SAFE = true;

document.addEventListener("DOMContentLoaded", async () => {
  bindUI();
  await loadRegistry();
  populateDeckList(REGISTRY);
  if (REGISTRY.length) selectCard(REGISTRY[0].id);
});

function bindUI(){
  Q('#stylePack').addEventListener('change', e => setStyle(e.target.value));
  Q('#banish').addEventListener('click', banish);
  Q('#safe').addEventListener('click', toggleSafe);
  Q('#filter').addEventListener('change', filterDeck);
  Q('#query').addEventListener('input', filterDeck);
  Q('#deal').addEventListener('click', dealSpread);
  Q('#tone').addEventListener('click', toggleTone);
  Q('#mute').addEventListener('click', stopTone);
  Q('#vol').addEventListener('input', e => setVolume(parseFloat(e.target.value)));
  setStyle('hermetic');
}

function setStyle(name){
  const b=document.body;
  b.classList.forEach(c => c.startsWith('theme-') && b.classList.remove(c));
  b.classList.add(`theme-${name}`);
}

async function loadRegistry(){
  // try JSON first
  try{
    const j = await fetch(SOURCES[0], {cache:"no-store"});
    if (j.ok) { REGISTRY = await j.json(); if (REGISTRY.length) return; }
  }catch(e){}
  // else parse MD
  const m = await fetch(SOURCES[1], {cache:"no-store"});
  if (!m.ok) { console.warn("Missing master MD"); return; }
  const text = await m.text();
  REGISTRY = parseMD(text);
}

function parseMD(md){
  const blocks = md.split(/\n(?=##\s)/g).filter(b=>b.startsWith("## "));
  const out=[];
  for (const b of blocks){
    const name = (b.match(/^##\s+(.+?)\s*$/m)||[])[1]||"";
    const id = name.replace(/[^\w]+/g,'_').toLowerCase();
    const get = l => (b.match(new RegExp(`-\\s*${l}:\\s*([^\\n]+)`))||[])[1]||"";
    const ray = get("Ray");
    const ad = get("Angel/Demon"); const [a,d] = ad.split("↔").map(s=>s?.trim()||"");
    const crystal = (get("Crystal").split("(")[0]||"").trim();
    const chem = ((get("Crystal").match(/\(([^)]+)\)/)||[])[1]||"").trim();
    const suit = guessSuit(name);
    out.push({
      id, name, suit,
      letter:get("Letter"),
      astrology:get("Astrology"),
      ray, angel:a, demon:d,
      crystal, chemistry:chem,
      artifact:get("Artifact"),
      pigment:get("Pigment"),
      tara:get("Secret Tara"),
      thought:get("Thought-form")||"",
      hga_fragment:get("HGA Fragment"),
      pattern_glyph:get("Pattern Glyph"),
      psyche:get("Psyche"),
      technical:get("Technical"),
      appPulls:get("App Pulls"),
      freq: freqFromTech(get("Technical"), ray)
    });
  }
  return out;
}

function guessSuit(n){
  const s=n.toLowerCase();
  if (s.includes("wands")) return "wands";
  if (s.includes("cups")) return "cups";
  if (s.includes("pentacles")||s.includes("coins")) return "pentacles";
  if (s.includes("swords")||s.includes("blades")) return "swords";
  return "majors";
}
function freqFromTech(t, ray){
  const m = (t||"").match(/Solfeggio\s*=\s*([\d.]+)/);
  if (m) return parseFloat(m[1]);
  const r=(ray||"").toLowerCase();
  if (r.includes("violet")) return 963;
  if (r.includes("indigo")||r.includes("silver")) return 852;
  if (r.includes("gold")||r.includes("emerald")||r.includes("green")||r.includes("aquamarine")||r.includes("turquoise")) return 528;
  if (r.includes("crimson")) return 417;
  if (r.includes("scarlet")||r.includes("red")) return 285;
  return 432;
}

function populateDeckList(cards){
  const list = Q('#deckList'); list.innerHTML="";
  for (const c of cards){
    const d=document.createElement('div');
    d.className="deck-item"; d.dataset.id=c.id;
    d.innerHTML=`<div>${c.name}</div><div class="small">${c.ray} • ${c.angel||"--"} ↔ ${c.demon||"--"}</div>`;
    d.addEventListener('click', ()=>selectCard(c.id));
    list.appendChild(d);
  }
}

function selectCard(id){
  const c = REGISTRY.find(x=>x.id===id); if (!c) return;
  T('#cornerNum', romanOrRank(c.name));
  T('#cornerPlanet', planetGlyph(c.astrology));
  T('#cornerAngel', c.angel||"--");
  T('#cornerDemon', c.demon||"--");
  T('#hebrewLetter', (c.letter||"").split("(")[0].trim());
  T('#abyssianGlyph', abyssianize(c.name));
  T('#crystalGlyph', c.crystal ? `${c.crystal} · ${c.chemistry}` : "--");
  T('#figureName', figureFrom(c.name));
  T('#cardTitle', c.name);
  T('#rayChip', c.ray||"");
  T('#taraChip', c.tara||"");
  T('#factionChip', suitFaction(c.suit));
  Q('.layer.pigment').style.filter = hueForRay(c.ray);
  AUDIO.hz = c.freq || 432;
}

function dealSpread(){
  const type=Q('#spreadSelect').value, board=Q('#spreadBoard'); board.innerHTML="";
  const n = (type==="magnum")?4:(type==="monad")?5:(type==="double-tree")?10:(type==="spine")?33:(type==="tara")?22:3;
  const pool=[...REGISTRY];
  for (let i=0;i<n;i++){
    const c = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    const div=document.createElement('div'); div.className="spread-card"; div.textContent=c?c.name:"--";
    div.title = c?.appPulls || "";
    board.appendChild(div);
  }
}

function banish(){
  const ov=Q('#banishOverlay'); ov.classList.add('active'); ensureAudio(); setVolume(0.10);
  const seq=[417,528,639,741,852,963]; let i=0;
  const step=()=>{ if (i>=seq.length){ stopTone(); ov.classList.remove('active'); return; }
    playTone(seq[i++]); setTimeout(step,900);
  }; step();
}

function toggleSafe(){ SAFE=!SAFE; document.body.classList.toggle('nd-safe',SAFE); setVolume(SAFE?0.12:Math.min(parseFloat(Q('#vol').value)||0.12,0.4)); }

function ensureAudio(){
  if (AUDIO.ctx) return;
  AUDIO.ctx = new (window.AudioContext||window.webkitAudioContext)();
  AUDIO.gain = AUDIO.ctx.createGain(); AUDIO.gain.gain.value=0.12; AUDIO.gain.connect(AUDIO.ctx.destination);
}
function setVolume(v){ ensureAudio(); AUDIO.gain.gain.value=Math.max(0,Math.min(0.4,v||0.12)); }
function playTone(hz){ ensureAudio(); if (AUDIO.osc) stopTone(); AUDIO.osc = AUDIO.ctx.createOscillator(); AUDIO.osc.type="sine"; AUDIO.osc.frequency.setValueAtTime(hz, AUDIO.ctx.currentTime); AUDIO.osc.connect(AUDIO.gain); AUDIO.osc.start(); }
function toggleTone(){ if (AUDIO.osc){ stopTone(); } else { playTone(AUDIO.hz||432); } }
function stopTone(){ if (AUDIO.osc){ try{AUDIO.osc.stop()}catch(e){} AUDIO.osc.disconnect(); AUDIO.osc=null; } }

function hueForRay(ray){
  const r=(ray||"").toLowerCase();
  if (r.includes("gold")) return "hue-rotate(40deg) saturate(1.2)";
  if (r.includes("indigo")) return "hue-rotate(220deg) saturate(1.2)";
  if (r.includes("violet")||r.includes("amethyst")) return "hue-rotate(260deg) saturate(1.2)";
  if (r.includes("scarlet")||r.includes("red")) return "hue-rotate(5deg) saturate(1.2)";
  if (r.includes("aquamarine")||r.includes("turquoise")) return "hue-rotate(160deg) saturate(1.2)";
  if (r.includes("emerald")||r.includes("green")) return "hue-rotate(120deg) saturate(1.2)";
  if (r.includes("silver")) return "hue-rotate(200deg) saturate(1.2)";
  return "saturate(1)";
}
function romanOrRank(name){ const m=name.match(/^([IVXLCM0-9\.]+)\s/); return m? m[1].replace(/\.$/,"") : "★"; }
function planetGlyph(a){ const s=(a||"").toLowerCase();
  if (s.includes("sun"))return"☉"; if (s.includes("moon"))return"☾"; if (s.includes("mercury"))return"☿"; if (s.includes("venus"))return"♀";
  if (s.includes("mars"))return"♂"; if (s.includes("jupiter"))return"♃"; if (s.includes("saturn"))return"♄"; if (s.includes("uranus"))return"⛢";
  if (s.includes("neptune"))return"♆"; if (s.includes("pluto"))return"♇"; return "⨀";
}
function figureFrom(n){ const p=n.split("--"); return (p[1]||p[0]).trim(); }
function abyssianize(n){ return n.replace(/[aeiou]/gi,"·").replace(/\s+/g,"  "); }
function suitFaction(s){ return {wands:"Sulphur",cups:"Mercury",pentacles:"Salt",swords:"Ash"}[s]||"Inner Order"; }
function Q(q){ return document.querySelector(q); }
function T(q,v){ Q(q).textContent = v||""; }
EOF

# 6) tools -- registry compiler ----------------------------------
mkdir -p tools
cat > tools/registry_compile.py <<'EOF'
# Registry Compiler -- Codex Abyssiae -> cards.json
# Usage: python tools/registry_compile.py [in_md] [out_json]
import re, json, sys, os
INP = sys.argv[1] if len(sys.argv)>1 else "docs/codex_abyssiae_master.md"
OUT = sys.argv[2] if len(sys.argv)>2 else "assets/data/cards.json"

with open(INP, "r", encoding="utf-8") as f: md = f.read()

blocks = [b for b in re.split(r"\n(?=##\s)", md) if b.startswith("## ")]
def field(b, k):
    m = re.search(r"-\s*%s:\s*([^\n]+)" % re.escape(k), b)
    return m.group(1).strip() if m else ""

def suit(n):
    s=n.lower()
    if "wands" in s: return "wands"
    if "cups" in s: return "cups"
    if "pentacles" in s or "coin" in s: return "pentacles"
    if "swords" in s or "blade" in s: return "swords"
    return "majors"

def map_freq(ray):
    r=(ray or "").lower()
    if "violet" in r: return 963
    if "indigo" in r or "silver" in r: return 852
    if any(x in r for x in ["gold","emerald","green","aquamarine","turquoise"]): return 528
    if "crimson" in r: return 417
    if "scarlet" in r or "red" in r: return 285
    return 432

cards=[]
for b in blocks:
    name = re.search(r"^##\s+(.+?)\s*$", b, re.M).group(1).strip()
    _id = re.sub(r"[^\w]+","_", name).lower()
    ray = field(b,"Ray")
    ad  = field(b,"Angel/Demon")
    angel, demon = ("","")
    if "↔" in ad:
        parts=[p.strip() for p in ad.split("↔")]
        angel = parts[0] if parts else ""
        demon = parts[1] if len(parts)>1 else ""
    crystal_line = field(b,"Crystal")
    crystal = crystal_line.split("(")[0].strip() if crystal_line else ""
    chem = re.search(r"\(([^)]+)\)", crystal_line)
    chem = chem.group(1).strip() if chem else ""
    tech = field(b,"Technical")
    m = re.search(r"Solfeggio\s*=\s*([\d\.]+)", tech)
    freq = float(m.group(1)) if m else float(map_freq(ray))
    cards.append({
      "id":_id, "name":name, "suit":suit(name),
      "letter":field(b,"Letter"), "astrology":field(b,"Astrology"),
      "ray":ray, "angel":angel, "demon":demon,
      "deities":field(b,"Deities"),
      "crystal":crystal, "chemistry":chem,
      "artifact":field(b,"Artifact"), "pigment":field(b,"Pigment"),
      "tara":field(b,"Secret Tara"), "thought":field(b,"Thought-form"),
      "hga_fragment":field(b,"HGA Fragment"), "pattern_glyph":field(b,"Pattern Glyph"),
      "psyche":field(b,"Psyche"), "technical":tech,
      "appPulls":field(b,"App Pulls"), "freq":freq
    })

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT,"w",encoding="utf-8") as f: json.dump(cards,f,ensure_ascii=False,indent=2)
print(f"Wrote {len(cards)} cards -> {OUT}")
EOF

# 7) example folio ------------------------------------------
mkdir -p examples
cat > examples/apprentice-pillar.html <<'EOF'
<!doctype html><meta charset="utf-8"><title>Apprentice Pillar -- Tarot Portal</title>
<style>body{background:#0b0e12;color:#e7e6ea;font:16px/1.5 ui-sans-serif,system-ui;margin:0;padding:24px}</style>
<h1>Apprentice Pillar</h1>
<p>Portal to the Living Tarot (Liber Arcanae). ND-safe; gentle motion; capped audio.</p>
<iframe src="../core/index.html" width="100%" height="860" loading="lazy" style="border:1px solid #232733;border-radius:12px"></iframe>
EOF

# 8) (optional) initialize git, first commit ------------------------
git init
git lfs install || true
git add -A
git commit -m “feat(liber-arcanae): bootstrap deck UI, engine, compiler, ND-safe defaults”
echo “✔ Repo scaffolded. Next: paste your sealed docs/codex_abyssiae_master.md, then run:”
echo “    python tools/registry_compile.py”
echo “    open core/index.html”
git commit -m "feat(liber-arcanae): bootstrap deck UI, engine, compiler, ND-safe defaults"
echo "✔ Repo scaffolded. Next: paste your sealed docs/codex_abyssiae_master.md, then run:"
echo "    python tools/registry_compile.py"
echo "    open core/index.html"

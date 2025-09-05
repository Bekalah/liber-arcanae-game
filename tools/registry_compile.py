# Registry Compiler -- Codex Abyssiae -> cards.json
# Usage: python tools/registry_compile.py [in_md] [out_json]
import re, json, sys, os

INP = sys.argv[1] if len(sys.argv)>1 else "docs/codex_abyssiae_master.md"
OUT = sys.argv[2] if len(sys.argv)>2 else "assets/data/cards.json"

with open(INP, "r", encoding="utf-8") as f:
    md = f.read()

blocks = [b for b in re.split(r"\n(?=##\s)", md) if b.startswith("## ")]

def field(b, k):
    m = re.search(r"-\s*%s:\s*([^\n]+)" % re.escape(k), b)
    return m.group(1).strip() if m else ""

def suit(n):
    s = n.lower()
    if "wands" in s: return "wands"
    if "cups" in s: return "cups"
    if "pentacles" in s or "coin" in s: return "pentacles"
    if "swords" in s or "blade" in s: return "swords"
    return "majors"

def map_freq(ray):
    r = (ray or "").lower()
    if "violet" in r: return 963
    if "indigo" in r or "silver" in r: return 852
    if any(x in r for x in ["gold","emerald","green","aquamarine","turquoise"]): return 528
    if "crimson" in r: return 417
    if "scarlet" in r or "red" in r: return 285
    return 432

cards = []
for b in blocks:
    name = re.search(r"^##\s+(.+?)\s*$", b, re.M).group(1).strip()
    _id = re.sub(r"[^\w]+", "_", name).lower()
    ray = field(b, "Ray")
    ad = field(b, "Angel/Demon")
    angel, demon = "", ""
    if "↔" in ad:
        parts = [p.strip() for p in ad.split("↔")]
        angel = parts[0] if parts else ""
        demon = parts[1] if len(parts) > 1 else ""
    crystal_line = field(b, "Crystal")
    crystal = crystal_line.split("(")[0].strip() if crystal_line else ""
    chem = re.search(r"\(([^)]+)\)", crystal_line)
    chem = chem.group(1).strip() if chem else ""
    tech = field(b, "Technical")
    m = re.search(r"Solfeggio\s*=\s*([\d\.]+)", tech)
    freq = float(m.group(1)) if m else float(map_freq(ray))
    cards.append({
        "id": _id, "name": name, "suit": suit(name),
        "letter": field(b, "Letter"), "astrology": field(b, "Astrology"),
        "ray": ray, "angel": angel, "demon": demon,
        "deities": field(b, "Deities"),
        "crystal": crystal, "chemistry": chem,
        "artifact": field(b, "Artifact"), "pigment": field(b, "Pigment"),
        "tara": field(b, "Secret Tara"), "thought": field(b, "Thought-form"),
        "hga_fragment": field(b, "HGA Fragment"), "pattern_glyph": field(b, "Pattern Glyph"),
        "psyche": field(b, "Psyche"), "technical": tech,
        "appPulls": field(b, "App Pulls"), "freq": freq
    })

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)
print(f"Wrote {len(cards)} cards -> {OUT}")

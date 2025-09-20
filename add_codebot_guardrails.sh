#!/usr/bin/env bash
# ✦ CodeBot Guardrails — Cathedral-safe defaults (ND-safe, no flatten)
set -euo pipefail
OVERWRITE="${OVERWRITE:-0}"
# wf writes stdin to the file path given by $1, creating parent directories as needed; if the target exists and the OVERWRITE environment variable is not "1" it prints "skip (exists): <path>" and does nothing, otherwise it writes stdin to the file and prints "wrote: <path>".
      wf(){ [[ -e "$1" && "$OVERWRITE" != "1" ]] && { echo "skip (exists): $1"; return; }
      mkdir -p "$(dirname "$1")"; cat >"$1"; echo "wrote: $1"; }
# ap appends a line to a file if that exact line is not already present, creating parent directories as needed and printing a message when it appends.
ap(){ local f="$1" l="$2"; mkdir -p "$(dirname "$f")"; grep -Fqx "$l" "$f" 2>/dev/null || { echo "$l" >> "$f"; echo "appended: $l -> $f"; }; }

# 0) Folders
mkdir -p core .github/ISSUE_TEMPLATE .github/labels docs/assets/bib

# 1) Code Bot contract (short form)
wf core/CODEBOT_BRIEF.md <<'DOC'
# ✦ CODEBOT BRIEF — Cathedral Protocol (Do Not Flatten)
- Never overwrite sacred data; prefer new files. If overwrite is essential, back up to `rescue/YYYY-MM-DD/`.
- ND-safe always: no autoplay, no strobe, motion = reduced; audio ramps gently.
- Data-driven only: read from `/data/*.json`, `/tesseract/data/*.json`, `/registry/*.json`. Do not hardcode lists.
- Provenance required: each new page cites at least one CSL item from `docs/assets/bib/citations.json`.
- Expand nodes/rooms via scripts (`build_*`, `add_*`); do not inject “demo stubs”.
- Respect numerology & mappings (144 nodes, 99 gates, 72/78, 33 spine). Keep fields intact.
- Tesseract/Chariot: step-based rotation only; no auto animation.
- If uncertain, create a proposal file under `plans/` and link sources; do not push destructive changes.
DOC

# 2) Long-form master (friendly to humans & bots)
wf core/MASTER_BOT_INSTRUCTION_CODEX.md <<'DOC'
# ✦ CIRCUITUM99 — MASTER BOT INSTRUCTION CODEX ✦
“Per Texturas Numerorum, Spira Loquitur” — the spiral speaks through structure.

## Repos in the Temple Matrix
- codex-14499 — 144-node spiral (angels, daemons, gods, geometry, music, healing).
- cosmogenesis-learning-engine — toggles, chapels, resonance, tesseract/chariot.
- magical-mystery-house — 144-room labyrinth (rooms mirror codex nodes; wormholes).

## Hard Rules
1) Do Not Flatten. Schema-first. Expand via scripts only.
2) ND/PTSD-safe by default (no autoplay; motion reduced; transcripts; exit/ground).
3) Cite sources (CSL JSON in `docs/assets/bib/citations.json`).
4) Provenance JSON for asset batches.
5) Never destroy: create new files; if override is required, back up to `rescue/YYYY-MM-DD/`.
6) Tarot/Lineage skins load from JSON; do not bake visuals into code.
7) Tesseract = button-step rotation only; “net” mode allowed; no auto spins.

## Data Hubs (read-only for bots)
- `/data/*.json` — nodes, ribbons, resonance, octaves, deities, angels/daemons.
- `/tesseract/data/manifest.json` — chariot modes, rooms, spiritual copy.
- `/tesseract/skins/*.json` — palettes + face labels (RWS/Thoth/Marseilles/Liber Arcanae).
- `/docs/assets/bib/citations.json` — CSL sources for research/lore.

## When Adding Content
- Prefer `plans/` for proposals, `chapels/` for experiences, `ateliers/` for curated study rooms.
- Create mirrors not edits: `*_v2.json` with migration notes in `docs/tools/validator.html`.
DOC

# 3) Issue template for Code Bot (forces schema-safe requests)
wf .github/ISSUE_TEMPLATE/cathedral_task.yml <<'DOC'
name: Cathedral Task (Schema-Driven, ND-safe)
description: Ask Code Bot to add/extend without flattening the living system.
labels: ["cathedral", "schema", "nd-safe"]
body:
  - type: markdown
    attributes:
      value: |
        **Read first:** core/CODEBOT_BRIEF.md. No autoplay. No strobe. No flattening.
  - type: input
    id: task
    attributes: {label: Task Title, placeholder: "Add Node 37 atelier room"}
    validations: {required: true}
  - type: textarea
    id: intent
    attributes:
      label: Intent (Lore? Game? Research?)
      description: Describe which layers apply — lore/game/research/effects/interface/node.
      placeholder: "Create Atelier for Ouspensky; cite sources; link to Tesseract rooms[]."
    validations: {required: true}
  - type: textarea
    id: data_refs
    attributes:
      label: Data References
      description: Point to the JSON that must be read (no hardcoding).
      placeholder: "/data/nodes.json#id=sephirah_tiphereth, /tesseract/data/manifest.json#rooms[ouspensky]"
  - type: textarea
    id: safety
    attributes:
      label: ND/PTSD Safety
      placeholder: "No autoplay; motion: reduced; audio ramp 3s; transcript provided."
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance Criteria
      placeholder: |
        - New files only; backup before overwrite.
        - Adds CSL citations to docs/assets/bib/citations.json.
        - Passes docs/tools/validator.html with 0 ERR.
  - type: textarea
    id: notes
    attributes:
      label: Notes / Sources
      placeholder: "CSL IDs, public-domain plates, lineage notes."
DOC

# 4) Lightweight labels file (optional for GH CLI import)
wf .github/labels/labels.csv <<'DOC'
name,color,description
cathedral,6a5acd,Living system work; schema-first
schema,8a7fff,Requires reading from JSON schemas
nd-safe,00b894,Neurodiversity-safe constraint
provenance,ffd166,Add or verify CSL citations
tesseract,64b5f6,Chariot/skin/3D study tasks
DOC

# 5) A tiny README note so collaborators see the contract
wf README_CATHEDRAL_NOTE.md <<'DOC'
## ✦ Cathedral Protocol (for humans & bots)
This is a living symbolic system. Do not flatten.
- Read `core/CODEBOT_BRIEF.md` before contributing.
- Use the **Cathedral Task** issue template.
- Cite sources (CSL JSON). Keep changes ND-safe and reversible.
DOC

# 6) Append discoverability to Pages index if present
[[ -f docs/index.html ]] && {
  ap docs/index.html '<!-- cathedral-protocol: see core/CODEBOT_BRIEF.md -->'
}
echo "Guardrails installed. Consider importing labels with:  gh label import -f .github/labels/labels.csv"

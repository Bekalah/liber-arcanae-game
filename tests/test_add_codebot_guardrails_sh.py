# -*- coding: utf-8 -*-
# Test framework: pytest (preferred in this repository if available).
# These tests execute the guardrails bash script in a temporary directory
# and validate creation, idempotency, overwrite behavior, and append semantics.

import os
import stat
import subprocess
import shutil
from pathlib import Path
import textwrap

SHELL_SCRIPT = """#\!/usr/bin/env bash
# ✦ CodeBot Guardrails — Cathedral-safe defaults (ND-safe, no flatten)
set -euo pipefail
OVERWRITE="${OVERWRITE:-0}"
wf(){ [[ -e "$1" && "$OVERWRITE" \!= "1" ]] && { echo "skip (exists): $1"; return; }
      mkdir -p "$(dirname "$1")"; cat >"$1"; echo "wrote: $1"; }
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
  ap docs/index.html '<\!-- cathedral-protocol: see core/CODEBOT_BRIEF.md -->'
}
echo "Guardrails installed. Consider importing labels with:  gh label import -f .github/labels/labels.csv"
"""

COMMENT_LINE = "<\!-- cathedral-protocol: see core/CODEBOT_BRIEF.md -->"

def _write_script(tmp_path: Path) -> Path:
    script_path = tmp_path / "add_codebot_guardrails.sh"
    script_path.write_text(SHELL_SCRIPT, encoding="utf-8")
    current = script_path.stat().st_mode
    script_path.chmod(current | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return script_path

def _run(script_path: Path, cwd: Path, extra_env=None):
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)
    # Execute the script file directly (it has a shebang and was made executable).
    return subprocess.run(
        ["/usr/bin/env", "bash", os.fspath(script_path)],
        cwd=str(cwd),
        env=env,
        capture_output=True,
        text=True,
        check=True,
    )

def test_installs_creates_files_and_content(tmp_path: Path):
    script = _write_script(tmp_path)
    result = _run(script, tmp_path)

    out = result.stdout
    # Expect creation messages
    assert "wrote: core/CODEBOT_BRIEF.md" in out
    assert "wrote: core/MASTER_BOT_INSTRUCTION_CODEX.md" in out
    assert "wrote: .github/ISSUE_TEMPLATE/cathedral_task.yml" in out
    assert "wrote: .github/labels/labels.csv" in out
    assert "wrote: README_CATHEDRAL_NOTE.md" in out
    assert "Guardrails installed." in out

    # Files and key content checks
    brief = tmp_path / "core" / "CODEBOT_BRIEF.md"
    codex = tmp_path / "core" / "MASTER_BOT_INSTRUCTION_CODEX.md"
    issue = tmp_path / ".github" / "ISSUE_TEMPLATE" / "cathedral_task.yml"
    labels = tmp_path / ".github" / "labels" / "labels.csv"
    note = tmp_path / "README_CATHEDRAL_NOTE.md"

    for p in (brief, codex, issue, labels, note):
        assert p.exists()

    assert brief.read_text(encoding="utf-8").startswith("# ✦ CODEBOT BRIEF — Cathedral Protocol (Do Not Flatten)")
    assert "MASTER BOT INSTRUCTION CODEX" in codex.read_text(encoding="utf-8")
    assert issue.read_text(encoding="utf-8").splitlines()[0].startswith("name: Cathedral Task")
    labels_txt = labels.read_text(encoding="utf-8")
    assert "name,color,description" in labels_txt
    assert "cathedral,6a5acd" in labels_txt

def test_idempotency_no_overwrite_when_overwrite_not_set(tmp_path: Path):
    script = _write_script(tmp_path)
    _run(script, tmp_path)  # first run creates files

    brief = tmp_path / "core" / "CODEBOT_BRIEF.md"
    brief.write_text("CUSTOM CONTENT", encoding="utf-8")

    result2 = _run(script, tmp_path)  # second run should skip existing files
    out2 = result2.stdout
    assert "skip (exists): core/CODEBOT_BRIEF.md" in out2
    # Content should remain as we customized (no overwrite)
    assert brief.read_text(encoding="utf-8") == "CUSTOM CONTENT"

def test_overwrite_when_env_set(tmp_path: Path):
    script = _write_script(tmp_path)
    _run(script, tmp_path)

    # Modify file, then force overwrite
    codex = tmp_path / "core" / "MASTER_BOT_INSTRUCTION_CODEX.md"
    codex.write_text("MODIFIED", encoding="utf-8")

    result = _run(script, tmp_path, extra_env={"OVERWRITE": "1"})
    out = result.stdout
    assert "wrote: core/MASTER_BOT_INSTRUCTION_CODEX.md" in out
    assert codex.read_text(encoding="utf-8").startswith("# ✦ CIRCUITUM99 — MASTER BOT INSTRUCTION CODEX ✦")

def test_append_to_docs_index_once_only_when_present(tmp_path: Path):
    script = _write_script(tmp_path)

    # Create a docs index to trigger append
    docs_dir = tmp_path / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)
    idx = docs_dir / "index.html"
    idx.write_text("<html><head></head><body>Hello</body></html>\n", encoding="utf-8")

    result1 = _run(script, tmp_path)
    out1 = result1.stdout
    assert f"appended: {COMMENT_LINE} -> docs/index.html" in out1
    content1 = idx.read_text(encoding="utf-8")
    assert content1.count(COMMENT_LINE) == 1

    # Run again; should not duplicate
    result2 = _run(script, tmp_path)
    out2 = result2.stdout
    # No second "appended" message expected (idempotent append)
    assert f"appended: {COMMENT_LINE} -> docs/index.html" not in out2
    content2 = idx.read_text(encoding="utf-8")
    assert content2.count(COMMENT_LINE) == 1

def test_no_append_when_index_missing(tmp_path: Path):
    script = _write_script(tmp_path)
    # Ensure docs/index.html does not exist
    assert not (tmp_path / "docs" / "index.html").exists()

    result = _run(script, tmp_path)
    out = result.stdout
    # Should not mention appended since index doesn't exist
    assert "appended:" not in out
    # Still, required artifacts should exist
    assert (tmp_path / "core" / "CODEBOT_BRIEF.md").exists()
    assert (tmp_path / ".github" / "labels" / "labels.csv").exists()
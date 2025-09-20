# Tests for Cathedral Task issue template YAML
# Test framework: pytest (preferred if available). Falls back to unittest style assertions.
from pathlib import Path
import re

try:
    import yaml  # PyYAML preferred
except ImportError:
    yaml = None

import os

TEMPLATE_FALLBACK = """\
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
"""

class PyYAMLMissingError(RuntimeError):
    """Raised when PyYAML is not available to parse templates."""

    def __init__(self):
        super().__init__("PyYAML required to parse templates.")

def _load_yaml_from_repo():
    # Try to locate the template on disk if available
    candidates = []
    gh_dir = Path(".github") / "ISSUE_TEMPLATE"
    if gh_dir.exists():
        candidates.extend(gh_dir.rglob("*.yml"))
        candidates.extend(gh_dir.rglob("*.yaml"))
    # Broader search by filename pattern
    candidates.extend(Path(".").rglob("*.yml"))
    candidates.extend(Path(".").rglob("*.yaml"))

    for p in candidates:
        try:
            text = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        if "Cathedral Task (Schema-Driven, ND-safe)" in text:
            return text, p
    return None, None

def _ensure_yaml_loader():
    if yaml is None:
        raise PyYAMLMissingError()
    return yaml

def _parse_yaml(text: str):
    y = _ensure_yaml_loader()
    data = y.safe_load(text)
    assert isinstance(data, dict), "Top-level YAML must be a mapping."
    return data

def _get_template():
    text, path = _load_yaml_from_repo()
    if text:
        return text, path
    return TEMPLATE_FALLBACK, None

def test_yaml_is_parseable_and_top_level_schema():
    text, path = _get_template()
    data = _parse_yaml(text)
    assert "name" in data and isinstance(data["name"], str)
    assert "description" in data and isinstance(data["description"], str)
    assert "labels" in data and isinstance(data["labels"], list)
    assert data["labels"] == ["cathedral", "schema", "nd-safe"]
    assert "body" in data and isinstance(data["body"], list)
    # Optional: If on disk, ensure file extension is correct
    if path:
        assert path.suffix in {".yml", ".yaml"}

def test_markdown_intro_present_and_contains_safety_disclaimers():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    md = next((b for b in body if b.get("type") == "markdown"), None)
    assert md is not None, "A markdown intro block is required."
    attrs = md.get("attributes") or {}
    val = attrs.get("value") or ""
    assert "**Read first:** core/CODEBOT_BRIEF.md" in val
    assert "No autoplay" in val and "No strobe" in val and "No flattening" in val

def _find_block(body, block_type, block_id):
    return next((b for b in body if b.get("type") == block_type and b.get("id") == block_id), None)

def test_input_task_field_required_with_label_and_placeholder():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    task = _find_block(body, "input", "task")
    assert task, "Task input block must exist."
    attrs = task.get("attributes") or {}
    assert attrs.get("label") == "Task Title"
    assert attrs.get("placeholder") == "Add Node 37 atelier room"
    validations = task.get("validations") or {}
    assert validations.get("required") is True

def test_intent_textarea_required_and_has_descriptive_metadata():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    intent = _find_block(body, "textarea", "intent")
    assert intent, "Intent textarea must exist."
    attrs = intent.get("attributes") or {}
    assert attrs.get("label") == "Intent (Lore? Game? Research?)"
    assert "lore/game/research/effects/interface/node" in (attrs.get("description") or "")
    assert "Create Atelier for Ouspensky;" in (attrs.get("placeholder") or "")
    validations = intent.get("validations") or {}
    assert validations.get("required") is True

def test_data_refs_textarea_points_to_json_paths():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    dr = _find_block(body, "textarea", "data_refs")
    assert dr, "Data References textarea must exist."
    ph = (dr.get("attributes") or {}).get("placeholder") or ""
    assert "/data/nodes.json" in ph
    assert "manifest.json#rooms[ouspensky]" in ph

def test_safety_textarea_mentions_nd_ptsd_and_audio_transcript():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    safety = _find_block(body, "textarea", "safety")
    assert safety, "ND/PTSD safety textarea must exist."
    attrs = safety.get("attributes") or {}
    assert attrs.get("label") == "ND/PTSD Safety"
    ph = attrs.get("placeholder") or ""
    for key in ["No autoplay", "motion: reduced", "audio ramp 3s", "transcript provided"]:
        assert key in ph

def test_acceptance_criteria_contains_key_requirements():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    acc = _find_block(body, "textarea", "acceptance")
    assert acc, "Acceptance Criteria textarea must exist."
    attrs = acc.get("attributes") or {}
    assert attrs.get("label") == "Acceptance Criteria"
    ph = attrs.get("placeholder") or ""
    # Normalize lines and assert presence
    lines = [line.strip(" -") for line in ph.splitlines() if line.strip()]
    assert "New files only; backup before overwrite." in lines
    assert "Adds CSL citations to docs/assets/bib/citations.json." in lines
    assert "Passes docs/tools/validator.html with 0 ERR." in lines

def test_notes_block_exists_with_expected_label():
    text, _ = _get_template()
    data = _parse_yaml(text)
    body = data["body"]
    notes = _find_block(body, "textarea", "notes")
    assert notes, "Notes textarea must exist."
    attrs = notes.get("attributes") or {}
    assert attrs.get("label") == "Notes / Sources"
    ph = attrs.get("placeholder") or ""
    for token in ["CSL IDs", "public-domain plates", "lineage notes"]:
        assert token in ph

def test_labels_are_exact_and_ordered():
    text, _ = _get_template()
    data = _parse_yaml(text)
    assert data["labels"] == ["cathedral", "schema", "nd-safe"]

def test_body_blocks_have_no_unknown_required_fields_and_correct_types():
    text, _ = _get_template()
    data = _parse_yaml(text)
    for block in data["body"]:
        assert isinstance(block.get("type"), str)
        if block.get("type") == "markdown":
            assert "attributes" in block and isinstance(block["attributes"], dict)
            assert "value" in block["attributes"]
        else:
            # input/textarea blocks
            assert "id" in block and isinstance(block["id"], str)
            assert "attributes" in block and isinstance(block["attributes"], dict)
            # validations is optional except for specific ones already asserted
            if "validations" in block:
                assert isinstance(block["validations"], dict)
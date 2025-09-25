# -*- coding: utf-8 -*-
"""
Test suite validating the "MASTER BOT INSTRUCTION CODEX" document content housed in tests/test_core_docs.py.

Testing framework in use: pytest (discovered or assumed by convention).
These tests are written to be robust and readable, using idiomatic pytest assertions.
They do not import the target file (since it's a text-like artifact), but read it as UTF-8 text to validate structure.

Coverage focus (from the PR diff excerpt):
- Header and motto presence
- Repos section items
- "Hard Rules" enumeration (1..7) and key rule phrases
- Data Hubs section and JSON path patterns
- Critical path references (e.g., docs/assets/bib/citations.json)
- Content addition guidance (plans/, chapels/, ateliers/, validator.html)
- Specific constraints (Do Not Flatten; Tarot/Lineage skins JSON; Tesseract rotation rules)

Where filesystem paths are referenced:
- Tests check for existence if present in this repo; otherwise they skip gracefully with an explanatory message.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

import pytest


@pytest.fixture(scope="module")
def codex_path() -> Path:
    # The PR places the codex content in tests/test_core_docs.py (textual content, not Python).
    p = Path(__file__).with_name("test_core_docs.py")
    if not p.exists():
        pytest.skip("tests/test_core_docs.py not found in repository; skipping codex content validations.")
    return p


@pytest.fixture(scope="module")
def codex_text(codex_path: Path) -> str:
    return codex_path.read_text(encoding="utf-8")


def test_header_and_motto_present(codex_text: str):
    # Be lenient to whitespace and punctuation while ensuring semantic presence.
    assert "MASTER BOT INSTRUCTION CODEX" in codex_text, "Codex header missing."
    # Accept both curly quotes and straight quotes by normalizing
    normalized = codex_text.replace("“", '"').replace("”", '"').replace("—", "-")
    assert 'Per Texturas Numerorum, Spira Loquitur' in normalized, "Motto missing or altered."


def test_repos_section_contains_expected_repos(codex_text: str):
    # Repos section should list these three entries at minimum.
    expected = [
        "codex-14499",
        "cosmogenesis-learning-engine",
        "magical-mystery-house",
    ]
    for repo in expected:
        assert repo in codex_text, f"Expected repo entry '{repo}' not found in Repos section."


def test_hard_rules_are_numbered_and_complete(codex_text: str):
    # Extract the "Hard Rules" list block: lines starting with digits and closing parenthesis).
    lines = [ln.strip() for ln in codex_text.splitlines()]
    rule_lines = [ln for ln in lines if re.match(r"^\d+\)\s", ln)]
    assert len(rule_lines) >= 7, f"Expected at least 7 enumerated rules, found {len(rule_lines)}: {rule_lines}"

    # Check numbering is sequential starting at 1 for at least the first 7 rules.
    numbers = [int(re.match(r"^(\d+)\)", ln).group(1)) for ln in rule_lines]
    assert numbers[:7] == list(range(1, 8)), f"Rules should be numbered 1..7, got {numbers[:7]}"

    # Key phrases required by the codex:
    required_phrases = [
        "Do Not Flatten",
        "ND/PTSD-safe by default",
        "Cite sources",
        "Provenance JSON for asset batches",
        "Never destroy",
        "Tarot/Lineage skins",
        "Tesseract = button-step rotation only",
    ]
    for phrase in required_phrases:
        assert any(phrase in rl for rl in rule_lines), f"Missing required rule phrase: {phrase}"


def test_do_not_flatten_rule_has_schema_first_and_scripts_only(codex_text: str):
    # Ensure rule elaborates on "Schema-first" and "Expand via scripts only."
    rule = next((ln for ln in codex_text.splitlines() if ln.strip().startswith("1)")), "")
    assert "Schema-first" in rule, "Do Not Flatten rule must mention 'Schema-first'."
    assert "Expand via scripts only" in rule, "Do Not Flatten rule must require expansion via scripts only."


def test_tarot_lineage_skins_are_json_not_baked(codex_text: str):
    rule = next((ln for ln in codex_text.splitlines() if ln.strip().startswith("6)")), "")
    assert "skins" in rule and "JSON" in rule, "Tarot/Lineage skins must reference JSON."
    assert "do not bake visuals into code" in rule.lower(), "Rule should forbid baking visuals into code."


def test_tesseract_rotation_button_step_and_no_auto_spins(codex_text: str):
    rule = next((ln for ln in codex_text.splitlines() if ln.strip().startswith("7)")), "")
    low = rule.lower()
    assert "button-step rotation" in low or "button-step" in low, "Tesseract rule must enforce button-step rotation."
    assert "no auto spins" in low or "no auto" in low, "Tesseract rule must forbid automatic spins."


def test_data_hubs_section_lists_expected_paths(codex_text: str):
    # Validate that key data hub paths are mentioned with JSON emphasis.
    expected_lines = [
        "/data/*.json",
        "/tesseract/data/manifest.json",
        "/tesseract/skins/*.json",
        "/docs/assets/bib/citations.json",
    ]
    for token in expected_lines:
        assert token in codex_text, f"Data Hubs must include path: {token}"

    # Ensure all listed hub entries end with .json or a *.json glob, except directory captions
    hub_lines = [
        ln.strip() for ln in codex_text.splitlines()
        if ln.strip().startswith("- ") and ("/data" in ln or "/tesseract" in ln or "/docs/assets/bib" in ln)
    ]
    for hl in hub_lines:
        assert (".json" in hl), f"Data hub entry should reference JSON assets: '{hl}'"


def test_docs_citations_json_exists_and_is_valid_json_if_present():
    path = Path("docs/assets/bib/citations.json")
    if not path.exists():
        pytest.skip("docs/assets/bib/citations.json not present in this checkout; skipping existence/JSON validation.")
    data = json.loads(path.read_text(encoding="utf-8"))
    assert isinstance(data, (list, dict)), "citations.json should be a JSON array or object."


def test_tesseract_skins_json_files_are_valid_if_present():
    skins_dir = Path("tesseract/skins")
    if not skins_dir.exists():
        pytest.skip("tesseract/skins directory not present; skipping skins JSON validation.")
    json_files = sorted(skins_dir.glob("*.json"))
    if not json_files:
        pytest.skip("No tesseract/skins/*.json files found; skipping.")
    for jf in json_files:
        try:
            parsed = json.loads(jf.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            pytest.fail(f"{jf} is not valid JSON: {e}")
        assert isinstance(parsed, (dict, list)), f"{jf} should be a JSON object or array."


def test_when_adding_content_guidance_mentions_expected_paths(codex_text: str):
    required_tokens = [
        "`plans/`",
        "`chapels/`",
        "`ateliers/`",
        "`*_v2.json`",
        "docs/tools/validator.html",
    ]
    for tok in required_tokens:
        assert tok in codex_text, f"Content-addition guidance missing token: {tok}"


def test_no_prohibited_terms_indicating_flattening(codex_text: str):
    # Negative test: codex should not advocate flattening or auto rotations.
    low = codex_text.lower()
    prohibited = ["auto spin", "autospin", "flatten schema", "flatten everything"]
    assert not any(p in low for p in prohibited), "Codex should not contain prohibited patterns encouraging flattening/auto spins."


def test_repos_section_has_markdown_bullets(codex_text: str):
    # Ensure the repos list uses Markdown-style dashes for bullets.
    repos_block = []
    capture = False
    for ln in codex_text.splitlines():
        if ln.strip().startswith("## Repos"):
            capture = True
            continue
        if capture and ln.strip().startswith("## "):
            break
        if capture and ln.strip():
            repos_block.append(ln.strip())
    bullets = [ln for ln in repos_block if ln.startswith("- ")]
    assert len(bullets) >= 3, f"Expected at least 3 bullet items in Repos section, got {len(bullets)}"


def test_data_directory_exists_if_project_inits_data():
    # Existence checks are optional and will be skipped if the repo does not ship these assets.
    data_dir = Path("data")
    if not data_dir.exists():
        pytest.skip("data/ directory not present in this checkout; skipping.")
    # If present, ensure it contains at least one JSON file.
    jsons = list(data_dir.glob("*.json"))
    assert jsons, "data/ should contain at least one .json file per codex contract."


def test_tesseract_manifest_json_is_valid_if_present():
    manifest = Path("tesseract/data/manifest.json")
    if not manifest.exists():
        pytest.skip("tesseract/data/manifest.json not present; skipping.")
    parsed = json.loads(manifest.read_text(encoding="utf-8"))
    assert isinstance(parsed, (dict, list)), "tesseract/data/manifest.json should be JSON (object or array)."
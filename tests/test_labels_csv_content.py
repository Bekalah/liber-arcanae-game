# Test framework/library: pytest
# Purpose: Validate the labels CSV introduced/modified in the PR.
# Focus: Ensures header schema, required rows, value formats, and data hygiene.

import csv
import os
import re
from pathlib import Path

import pytest

# Required labels and expected colors from the diff

REQUIRED_LABELS = {
    "cathedral": "6a5acd",
    "schema": "8a7fff",
    "nd-safe": "00b894",
    "provenance": "ffd166",
    "tesseract": "64b5f6",
}

HEX_COLOR_RE = re.compile(r"^[0-9a-fA-F]{6}$")
NAME_SLUG_RE = re.compile(r"^[a-z0-9-]+$")


def find_labels_csv_candidates():
    """
    Locate labels CSV files by:
      - honoring LABELS_CSV_PATH if provided, else
      - scanning the repo for *.csv with header 'name,color,description'
        and containing the 'cathedral,6a5acd' row from the diff.
    Returns a de-duplicated list of Path objects.
    """
    paths = []
    env_path = os.getenv("LABELS_CSV_PATH")
    if env_path:
        p = Path(env_path)
        if p.is_file():
            paths.append(p)

    # Search from repo root

    try:
        root = Path(__file__).resolve().parents[1]
    except Exception:
        root = Path(".").resolve()

    for p in root.rglob("*.csv"):
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        lines = text.splitlines()
        if not lines:
            continue
        if lines[0].strip() == "name,color,description" and "cathedral,6a5acd" in text:
            paths.append(p)

    # de-duplicate while preserving order

    seen = set()
    uniq = []
    for p in paths:
        s = str(p)
        if s not in seen:
            uniq.append(p)
            seen.add(s)
    return uniq


@pytest.fixture(scope="module")
def labels_csv_paths():
    return find_labels_csv_candidates()


def _load_rows(csv_path: Path):
    rows = []
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        assert reader.fieldnames == ["name", "color", "description"], (
            f"Unexpected header in {csv_path}: {reader.fieldnames}"
        )
        for r in reader:
            # Skip completely blank lines (if any)

            if r is None:
                continue
            name = (r.get("name") or "").strip()
            color = (r.get("color") or "").strip()
            desc = (r.get("description") or "").strip()
            if not name and not color and not desc:
                continue
            rows.append({"name": name, "color": color, "description": desc})
    return rows


def test_labels_csv_present(labels_csv_paths):
    assert labels_csv_paths, (
        "Could not find any labels CSV with header 'name,color,description' "
        "and expected content. Set LABELS_CSV_PATH env var to point to the file if needed."
    )


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_header_and_row_shapes(csv_path: Path):
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        first = f.readline().strip()
        assert first == "name,color,description", f"Bad header in {csv_path}: {first!r}"
        f.seek(0)
        rdr = csv.reader(f)
        header = next(rdr)
        for idx, row in enumerate(rdr, start=2):
            # Allow trailing blank lines

            if len(row) == 0 or all((c or "").strip() == "" for c in row):
                continue
            assert len(row) == 3, f"{csv_path}:{idx}: expected 3 columns, got {len(row)} -> {row}"


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_required_labels_and_colors(csv_path: Path):
    rows = _load_rows(csv_path)
    by_name = {r["name"]: r["color"] for r in rows}
    for name, color in REQUIRED_LABELS.items():
        assert name in by_name, f"Missing required label '{name}' in {csv_path}"
        assert by_name[name].lower() == color.lower(), (
            f"Label '{name}' should have color {color}, got {by_name[name]}"
        )


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_no_duplicate_names(csv_path: Path):
    rows = _load_rows(csv_path)
    names = [r["name"] for r in rows]
    assert len(names) == len(set(names)), f"Duplicate label names found in {csv_path}"


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_no_duplicate_colors(csv_path: Path):
    rows = _load_rows(csv_path)
    colors = [r["color"].lower() for r in rows]
    assert len(colors) == len(set(colors)), f"Duplicate color codes found in {csv_path}"


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_color_format_hex6(csv_path: Path):
    rows = _load_rows(csv_path)
    for r in rows:
        assert HEX_COLOR_RE.fullmatch(r["color"]), (
            f"Invalid color '{r['color']}' for label '{r['name']}' in {csv_path}"
        )


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_values_no_surrounding_whitespace(csv_path: Path):
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        for lineno, raw in enumerate(f, start=1):
            if lineno == 1:  # header
                continue
            if raw.strip() == "":
                continue
            fields = raw.rstrip("\r\n").split(",")
            for c in fields:
                assert c == c.strip(), f"{csv_path}:{lineno}: Field has surrounding whitespace -> '{c}'"


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_all_descriptions_present(csv_path: Path):
    rows = _load_rows(csv_path)
    for r in rows:
        assert isinstance(r["description"], str) and r["description"].strip(), (
            f"Missing/empty description for '{r['name']}' in {csv_path}"
        )


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_name_slug_rules(csv_path: Path):
    rows = _load_rows(csv_path)
    for r in rows:
        assert NAME_SLUG_RE.fullmatch(r["name"]), (
            f"Invalid label name '{r['name']}' in {csv_path}. "
            "Only lowercase letters, digits, and hyphens are allowed."
        )


@pytest.mark.parametrize("csv_path", find_labels_csv_candidates())
def test_file_ends_with_newline(csv_path: Path):
    with open(csv_path, "rb") as f:
        f.seek(0, os.SEEK_END)
        size = f.tell()
        assert size > 0, f"{csv_path} is empty"
        f.seek(-1, os.SEEK_END)
        assert f.read(1) == b"\n", f"{csv_path} should end with a newline"
"""
Tests for the Cathedral Protocol note markdown.

Testing library/framework: pytest
- These tests assume pytest is the active test runner (common in repos using tests/ and test_*.py).
- They locate the markdown file by its distinctive header and validate key content introduced in the diff:
  * Header text and level
  * "Do not flatten" admonition line
  * Three bullet items' exact text and order
  * Formatting (backticks, bold), punctuation, and spacing
  * Presence of ND-safe/reversible and CSL JSON mentions
  * Basic hygiene: trailing spaces, CRLFs, final newline
  * Existence of referenced file: core/CODEBOT_BRIEF.md
"""

from __future__ import annotations

from pathlib import Path
import re
import logging
import pytest


# --- Specification extracted from the PR diff (source of truth for these tests) ---
HEADER = "## ✦ Cathedral Protocol (for humans & bots)"
FIRST_SENTENCE = "This is a living symbolic system. Do not flatten."
BULLETS = [
    "- Read  before contributing.",
    "- Use the **Cathedral Task** issue template.",
    "- Cite sources (CSL JSON). Keep changes ND-safe and reversible.",
]


def _repo_root() -> Path:
    # tests/ lives at repo_root/tests/, so parents[1] should be the repository root.
    return Path(__file__).resolve().parents[1]


def _is_skippable_path(p: Path) -> bool:
    skip_parts = {"node_modules", ".git", ".venv", "venv", "build", "dist", "tests", "site-packages"}
    return any(part in skip_parts for part in p.parts)


def _find_note_file() -> tuple[Path, str]:
    root = _repo_root()
    candidates: list[tuple[Path, str]] = []
    for md in root.rglob("*.md"):
        if _is_skippable_path(md):
            continue
        try:
            text = md.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            logging.debug("Skipping %s: %s", md, exc)
            continue
        if HEADER in text:
            candidates.append((md, text))

    if not candidates:
        pytest.fail(
            "Could not find any .md file containing the expected Cathedral Protocol header: \n\n%r" % HEADER
        )

    # Prefer the candidate that matches the most expected lines; this is resilient if multiple files mention the header.
    def score(entry: tuple[Path, str]) -> int:
        _, t = entry
        s = int(FIRST_SENTENCE in t)
        for b in BULLETS:
            s += int(b in t)
        return s

    candidates.sort(key=score, reverse=True)
    return candidates[0]


@pytest.fixture(scope="module")
def note_text_and_path() -> tuple[str, Path]:
    path, text = _find_note_file()
    # Return (text, path) for ergonomic order in tests
    return text, path


def _lines(text: str) -> list[str]:
    return text.splitlines()


def _first_non_empty_line(lines: list[str]) -> str:
    for line in lines:
        if line.strip():
            return line
    return ""


def _index_of_line(lines: list[str], needle: str) -> int:
    for i, line in enumerate(lines):
        if line == needle:
            return i
    return -1


# --- Content tests ---


def test_header_is_first_non_empty_line(note_text_and_path):
    text, path = note_text_and_path
    ls = _lines(text)
    assert _first_non_empty_line(ls) == HEADER, "In %s, the first non-empty line must be exactly: %r" % (path, HEADER)


def test_header_level_is_h2_and_contains_star_symbol(note_text_and_path):
    text, _ = note_text_and_path
    first = _first_non_empty_line(_lines(text))
    assert first.startswith("## "), "Header must be an H2 (##)."  # not H1 or H3+
    assert "✦" in first, "Header should include the ✦ symbol as specified."


def test_second_line_is_do_not_flatten(note_text_and_path):
    text, path = note_text_and_path
    ls = _lines(text)
    h_idx = _index_of_line(ls, HEADER)
    assert h_idx >= 0, "Header not found among lines."
    # Find next non-empty line after header
    for j in range(h_idx + 1, len(ls)):
        if ls[j].strip():
            assert ls[j] == FIRST_SENTENCE, (
                "In %s, expected the admonition line right after header to be: %r,\n"
                "but found: %r" % (path, FIRST_SENTENCE, ls[j])
            )
            break
    else:
        pytest.fail("No non-empty line found after header.")


def test_bullets_exact_text_and_order(note_text_and_path):
    text, path = note_text_and_path
    ls = _lines(text)
    h_idx = _index_of_line(ls, HEADER)
    assert h_idx >= 0, "Header not found among lines."
    # Collect bullet lines following the first sentence; take the first three bullets encountered.
    # This is robust to blank lines or comments in between.
    bullets_found = []
    started = False
    for line in ls[h_idx + 1 : h_idx + 20]:
        if line.strip() == FIRST_SENTENCE:
            started = True
            continue
        if not started:
            continue
        if line.strip().startswith("- "):
            bullets_found.append(line.strip())
        if len(bullets_found) >= 3:
            break

    assert len(bullets_found) >= 3, f"In {path}, expected at least three bullet lines after the admonition."
    assert bullets_found[:3] == BULLETS, (
        "Bullet items must match exactly and be in order.\n\n"
        f"Expected: {BULLETS}\nFound:    {bullets_found[:3]}"
    )


def test_bullets_formatting_and_spacing(note_text_and_path):
    text, _ = note_text_and_path
    # Backticks around path
    assert re.search(r"-\s+Read\s+\s+before\s+contributing\.", text),         "The 'Read core/CODEBOT_BRIEF.md' instruction must keep the path in backticks."
    # Bold on Cathedral Task
    assert "- Use the **Cathedral Task** issue template." in text,         "The 'Cathedral Task' phrase must be bolded with ** **."
    # Exactly one space after '-' in bullets
    for b in BULLETS:
        assert re.match(r"^-\s[^\s]", b), "Bullet should use exactly one space after '-' : %r" % (b,)


def test_mentions_csl_json_and_nd_safe_reversible(note_text_and_path):
    text, _ = note_text_and_path
    assert "CSL JSON" in text, "Should mention CSL JSON for citations."
    assert "ND-safe" in text and "reversible" in text, "Should mention ND-safe and reversible changes."


# --- Hygiene tests ---


def test_no_trailing_spaces(note_text_and_path):
    text, path = note_text_and_path
    ls = _lines(text)
    offenders = [i + 1 for i, line in enumerate(ls) if line.endswith(" ")]
    assert not offenders, f"Trailing spaces found in {path} at lines: {offenders}"


def test_no_crlf_and_has_final_newline(note_text_and_path):
    text, path = note_text_and_path
    assert "\r" not in text, f"{path} contains CRLF line endings; please use LF (\n)."
    assert text.endswith("\n"), f"{path} should end with a newline."


def test_referenced_codebot_brief_exists(note_text_and_path):
    # Enforce that the referenced file actually exists in the repository.
    text, path = note_text_and_path
    root = _repo_root()
    target = root / "core" / "CODEBOT_BRIEF.md"
    assert target.exists(), (
        f"Referenced file not found: {target}.\n"
        f"Please add it or update the note to reference the correct path."
    )


def test_single_occurrence_of_header(note_text_and_path):
    text, _ = note_text_and_path
    assert text.count(HEADER) == 1, "Header should appear exactly once in the file."
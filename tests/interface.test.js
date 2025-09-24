/**
 * Repository test setup:
 * - No external test framework (script: node tests/interface.test.js)
 * - ESM enabled via "type": "module"
 * Framework note: Using a minimal custom harness + Node's assert.
 * Focus: Validate "Cosmic Helix Renderer" documentation per PR diff.
 */

import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';

// Minimal harness
const tests = [];
export function test(name, fn) { tests.push({ name, fn }); }
export async function run() {

  let failed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✓ ${t.name}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${t.name}\n  ${e && e.stack ? e.stack : e}`);
    }
  }
  if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
  } else {
    console.log(`\nAll tests passed (${tests.length})`);
  }
}

// Helpers
function readIfExists(relPath) {
  const abs = path.resolve(process.cwd(), relPath);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
}

function findDocFile() {
  // Prefer common doc locations; include PR-provided path as a candidate too
  const candidates = [
    'README.md',
    'Readme.md',
    'readme.md',
    'docs/README.md',
    'docs/readme.md',
    'README.renderer.md',
    'docs/renderer.md',
    // Include path from PR context; if that file contains the doc text, use it
    'tests/readme_renderer.test.js',
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.resolve(process.cwd(), p))) return p;
  }
  // Fallback: scan for any .md mentioning "Cosmic Helix Renderer"
  const list = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) list.push(full);
    }
  };
  walk(process.cwd());
  for (const p of list) {
    try {
      const txt = fs.readFileSync(p, 'utf8');
      if (/Cosmic Helix Renderer/i.test(txt)) return path.relative(process.cwd(), p);
    } catch { /* ignore */ }
  }
  return null;
}

// ===== Documentation Tests =====
const docPath = findDocFile();
const doc = docPath ? readIfExists(docPath) : '';

test('Doc file for "Cosmic Helix Renderer" is discoverable', () => {
  assert.ok(docPath, 'Expected a Markdown file containing "Cosmic Helix Renderer"');
  assert.equal(typeof doc, 'string');
  assert.match(doc, /Cosmic Helix Renderer/);
});

test('Contains Latin tagline "Per Texturas Numerorum, Spira Loquitur."', () => {
  assert.match(doc, /Per Texturas Numerorum, Spira Loquitur\./);
});

test('References index.html and offline/no network usage', () => {
  assert.match(doc, /\[index\.html\]\(.\/index\.html\)/, 'Expected markdown link to ./index.html');
  assert.ok(/no build steps or network requests|Everything runs offline/i.test(doc), 'Expected offline usage mention');
});

test('Lists all four layers in order', () => {
  const patterns = [
    /1\.\s+\*\*Vesica field\*\*/,
    /2\.\s+\*\*Tree-of-Life\*\*/,
    /3\.\s+\*\*Fibonacci curve\*\*/,
    /4\.\s+\*\*Double-helix lattice\*\*/,
  ];
  let idx = 0;
  for (const re of patterns) {
    const m = doc.match(re);
    assert.ok(m, `Missing layer entry for pattern: ${re}`);
    const found = doc.indexOf(m[0]);
    assert.ok(found >= idx, 'Layers are out of documented order');
    idx = found;
  }
});

test('Mentions canonical IDs for nodes and gates', () => {
  assert.match(doc, /C144N-001.*C144N-010/s, 'Expected node ID range C144N-001..C144N-010');
  assert.match(doc, /G-099-01.*G-099-22/s, 'Expected gate ID range G-099-01..G-099-22');
});

test('Describes palette file and normalization behavior', () => {
  assert.match(doc, /\(.\/*data\/palette\.json\)/, 'Expected markdown reference to data/palette.json');
  assert.match(doc, /loader normalizes palettes/i);
  assert.match(doc, /background and text remain aligned/i);
});

test('Documents fallback when palette is missing', () => {
  assert.match(doc, /If the palette file is missing/i);
  assert.match(doc, /safe fallback loads/i);
  assert.match(doc, /small inline notice appears/i);
});

test('Lists sacred numbers 3, 7, 9, 11, 22, 33, 99, and 144', () => {
  const nums = ['3', '7', '9', '11', '22', '33', '99', '144'];
  for (const n of nums) {
    assert.ok(new RegExp(`\\b${n}\\b`).test(doc), `Missing sacred number ${n}`);
  }
});

test('States canvas size 1440×900 and graceful canvas-unavailable fallback', () => {
  assert.ok(/1440×900|1440x900/.test(doc), 'Expected canvas size mention 1440×900');
  assert.match(doc, /if canvas is unavailable.*inline notice/i);
});

test('References helix renderer module and optional palette, running offline', () => {
  assert.match(doc, /\(.\/*js\/helix-renderer\.mjs\)/);
  assert.match(doc, /\(.\/*data\/palette\.json\)/);
  assert.match(doc, /Everything runs offline/i);
});

test('Includes ND-safe notes and bullets', () => {
  assert.match(doc, /##\s*ND-safe Notes/);
  assert.match(doc, /No motion or flashing; all elements render statically/i);
  assert.match(doc, /Palette uses gentle contrast for readability/i);
  assert.match(doc, /Pure functions, ES modules, UTF-8, and LF newlines/i);
});

test('Referenced assets exist when present locally (best-effort, non-failing if absent)', () => {
  const refs = ['index.html', path.join('data', 'palette.json'), path.join('js', 'helix-renderer.mjs')];
  for (const rel of refs) {
    const p = path.resolve(process.cwd(), rel);
    if (fs.existsSync(p)) {
      const s = fs.statSync(p);
      assert.ok(s.isFile(), `Expected file: ${rel}`);
    }
  }
});

test('Has key headings for structure', () => {
  const heads = ['## Layers', '## Numerology', '## Local Use', '## ND-safe Notes'];
  for (const h of heads) {
    assert.ok(doc.includes(h), `Missing heading: ${h}`);
  }
});

test('No obvious placeholder tokens remain', () => {
  const forbidden = ['TBD', 'TODO:', 'Lorem ipsum'];
  for (const token of forbidden) {
    assert.equal(doc.includes(token), false, `Found placeholder token: ${token}`);
  }
});

// Run after tests are registered
run();
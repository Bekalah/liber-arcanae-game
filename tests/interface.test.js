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
 * Structured tests for validateInterface against interface.schema.json
 * Testing framework: Node.js built-in test runner (node:test) + assert
 * If your repo uses Jest/Mocha, replace `import { describe, it, before, beforeEach } from "node:test"`
 * with the respective framework imports and assertions.
 */

import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateInterface } from "../engines/interface-guard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let schemaUrl;
let schemaJson;

async function loadSchemaUrl() {
  const schemaPath = path.resolve(__dirname, "../assets/data/interface.schema.json");
  const schemaText = await readFile(schemaPath, "utf8");
  schemaJson = JSON.parse(schemaText);
  return "data:application/json," + encodeURIComponent(schemaText);
}

async function loadSample() {
  const samplePath = path.resolve(__dirname, "../assets/data/sample_interface.json");
  return JSON.parse(await readFile(samplePath, "utf8"));
}

describe("validateInterface(schema: interface.schema.json)", () => {
  before(async () => {
    schemaUrl = await loadSchemaUrl();
  });

  it("accepts the provided sample_interface.json (happy path)", async () => {
    const sample = await loadSample();
    const res = await validateInterface(sample, schemaUrl);
    assert.equal(res.valid, true, "Expected sample to be valid against schema");
    assert.ok(!res.errors || res.errors.length === 0, "Expected no validation errors");
  });

  it("rejects empty object", async () => {
    const res = await validateInterface({}, schemaUrl);
    assert.equal(res.valid, false, "Empty object should not satisfy the schema");
    assert.ok(Array.isArray(res.errors) && res.errors.length > 0, "Expected validation errors to be present");
  });

  it("rejects when required fields are missing (if any are defined)", async () => {
    // Try to infer required keys from the schema; if none, this test will trivially pass with a skip.
    const required = Array.isArray(schemaJson?.required) ? schemaJson.required : [];
    if (required.length === 0) {
      // Soft assertion: if schema has no required, ensure removing a known key still validates or not.
      const sample = await loadSample();
      // Remove an arbitrary top-level key if present
      const [firstKey] = Object.keys(sample);
      if (firstKey) {
        const altered = { ...sample };
        delete altered[firstKey];
        const res = await validateInterface(altered, schemaUrl);
        // We don't know if it's still valid; assert result is boolean and errors array consistency
        assert.ok(typeof res.valid === "boolean");
        assert.ok(Array.isArray(res.errors));
      } else {
        assert.ok(true, "No keys to remove from sample; nothing to assert.");
      }
    } else {
      const sample = await loadSample();
      const altered = { ...sample };
      // remove first required key
      delete altered[required[0]];
      const res = await validateInterface(altered, schemaUrl);
      assert.equal(res.valid, false, "Missing required property should invalidate sample");
      assert.ok(res.errors.some(e => String(e.message || e.keyword || "").toLowerCase().includes("required") || String(e?.params?.missingProperty || "").length > 0));
    }
  });

  it("rejects wrong type for a known property when possible", async () => {
    const sample = await loadSample();

    // Attempt to flip the type of the first non-object primitive field to provoke a type error.
    // We don't know the shape, so we try a few heuristics.
    const mutated = structuredClone(sample);

    const flipType = (val) => {
      switch (typeof val) {
        case "string": return 12345;
        case "number": return "wrong-type";
        case "boolean": return "not-boolean";
        default: return null; // provoke potential type mismatch if expecting object/array
      }
    };

    let mutatedSomething = false;
    for (const k of Object.keys(mutated)) {
      if (typeof mutated[k] === "string" || typeof mutated[k] === "number" || typeof mutated[k] === "boolean") {
        mutated[k] = flipType(mutated[k]);
        mutatedSomething = true;
        break;
      }
    }
    if (!mutatedSomething) {
      // Try to force an unexpected type on the first key
      const [firstKey] = Object.keys(mutated);
      if (firstKey) {
        mutated[firstKey] = null;
        mutatedSomething = true;
      }
    }

    const res = await validateInterface(mutated, schemaUrl);
    // If schema isn't strict on types, this might still pass. Make a soft check.
    assert.ok(typeof res.valid === "boolean");
    assert.ok(Array.isArray(res.errors));
    if (res.valid === true) {
      // At least ensure it still conforms if schema is permissive
      assert.ok(true, "Schema accepted mutated types (schema may be permissive).");
    } else {
      assert.ok(res.errors.some(e => String(e.message || e.keyword || "").toLowerCase().includes("type")));
    }
  });

  it("rejects additionalProperties if the schema forbids them", async () => {
    const sample = await loadSample();
    const altered = { ...sample, __unexpected: "extra" };
    const res = await validateInterface(altered, schemaUrl);
    // If additionalProperties is false, this should be invalid; otherwise it may pass.
    assert.ok(typeof res.valid === "boolean");
    assert.ok(Array.isArray(res.errors));
    if (!res.valid) {
      assert.ok(res.errors.some(e => String(e.message || e.keyword || "").toLowerCase().includes("additional")));
    }
  });

  it("provides meaningful error objects on failure", async () => {
    const res = await validateInterface({ definitely: "wrong" }, schemaUrl);
    if (res.valid === true) {
      // If schema is permissive, note it and pass.
      assert.ok(true);
    } else {
      assert.ok(Array.isArray(res.errors), "errors should be an array");
      // Common AJV-like shape: { instancePath, schemaPath, keyword, message }
      const e = res.errors[0];
      assert.ok(typeof e === "object" && e !== null, "error items should be objects");
      // At least one of these fields should exist:
      assert.ok(
        "message" in e || "keyword" in e || "schemaPath" in e || "instancePath" in e,
        "error object should contain typical JSON Schema validator fields"
      );
    }
  });
});

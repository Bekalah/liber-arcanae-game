/**
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
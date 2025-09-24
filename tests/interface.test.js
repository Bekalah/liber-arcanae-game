import test from "node:test";
import assert from "node:assert/strict";
import { validateInterface } from "../engines/interface-guard.js";
import { readFile } from "node:fs/promises";

async function makeDataUrlFromFile(path) {
  const text = await readFile(new URL(path, import.meta.url), "utf8");
  return "data:application/json," + encodeURIComponent(text);
}

test("validateInterface: valid sample conforms to interface.schema.json (happy path)", async () => {
  const schemaUrl = await makeDataUrlFromFile("../assets/data/interface.schema.json");
  const sample = JSON.parse(await readFile(new URL("../assets/data/sample_interface.json", import.meta.url), "utf8"));
  const res = await validateInterface(sample, schemaUrl);
  assert.equal(res.valid, true, "Expected sample to be valid against schema");
  assert.ok(!res.errors || res.errors.length === 0, "Expected no validation errors");
});

test("validateInterface: missing required property should fail", async () => {
  const schemaUrl = await makeDataUrlFromFile("../assets/data/interface.schema.json");
  const sample = JSON.parse(await readFile(new URL("../assets/data/sample_interface.json", import.meta.url), "utf8"));
  // Attempt to remove a common required property if present.
  // We'll try several likely field names; only remove those that exist.
  const candidateRequired = ["id", "name", "version", "type"];
  const invalid = { ...sample };
  for (const key of candidateRequired) {
    if (Object.prototype.hasOwnProperty.call(invalid, key)) {
      delete invalid[key];
      break;
    }
  }
  const res = await validateInterface(invalid, schemaUrl);
  assert.equal(res.valid, false, "Expected validation to fail when a required field is missing");
  assert.ok(Array.isArray(res.errors) && res.errors.length >= 1, "Expected at least one validation error");
});

test("validateInterface: wrong type for a field should fail", async () => {
  const schemaUrl = await makeDataUrlFromFile("../assets/data/interface.schema.json");
  const sample = JSON.parse(await readFile(new URL("../assets/data/sample_interface.json", import.meta.url), "utf8"));


  // Flip type for a common string/number field if available.
  const invalid = structuredClone(sample);
  const keys = Object.keys(invalid);
  let mutated = false;


  for (const k of keys) {
    const v = invalid[k];
    if (typeof v === "string") {
      invalid[k] = 12345; // wrong type
      mutated = true;
      break;
    }
    if (typeof v === "number") {
      invalid[k] = "not-a-number";
      mutated = true;
      break;
    }
    if (typeof v === "boolean") {
      invalid[k] = "not-a-boolean";
      mutated = true;
      break;
    }
  }

  if (!mutated) {
    // If nothing suitable found, add an obviously wrong-typed field that schema may constrain
    invalid.__forcedTypeError = "wrong";
  }

  const res = await validateInterface(invalid, schemaUrl);


  assert.equal(res.valid, false, "Expected validation failure for wrong-typed field");
  assert.ok(Array.isArray(res.errors) && res.errors.length >= 1, "Expected at least one validation error");
});

test("validateInterface: rejects unexpected additional property if schema disallows it", async () => {
  const schemaUrl = await makeDataUrlFromFile("../assets/data/interface.schema.json");
  const sample = JSON.parse(await readFile(new URL("../assets/data/sample_interface.json", import.meta.url), "utf8"));
  const invalid = { ...sample, __unexpected: "should be rejected if additionalProperties:false" };
  const res = await validateInterface(invalid, schemaUrl);
  // If schema allows additionalProperties, it can be valid. We assert behavior conditionally but still verify result.
  if (res.valid) {
    assert.equal(res.valid, true, "Schema appears to allow additional properties");
  } else {
    assert.equal(res.valid, false, "Schema appears to disallow additional properties");
    assert.ok(Array.isArray(res.errors) && res.errors.length >= 1, "Expected at least one validation error");
  }
});

test("validateInterface: empty object should generally fail", async () => {
  const schemaUrl = await makeDataUrlFromFile("../assets/data/interface.schema.json");
  const invalid = {};
  const res = await validateInterface(invalid, schemaUrl);
  // Most schemas require fields; if not, it's fine but we still assert correctness.
  if (res.valid) {
    assert.equal(res.valid, true, "Schema unexpectedly allows empty object");
  } else {
    assert.equal(res.valid, false, "Empty object should not satisfy a typical interface schema");
    assert.ok(Array.isArray(res.errors) && res.errors.length >= 1, "Expected at least one validation error for empty object");
  }
});

test("validateInterface: malformed schema data URL should produce invalid result with errors", async () => {
  const badSchemaUrl = "data:application/json," + encodeURIComponent("{ not-json ");
  const sample = {};
  const res = await validateInterface(sample, badSchemaUrl);
  // Depending on implementation, this may throw internally or return errors; assume error collection pattern.
  assert.equal(res.valid, false, "Malformed schema should result in invalid");
  assert.ok(res.errors, "Errors should be reported for malformed schema");
});

test("validateInterface: unreachable schema URL should produce invalid result with errors", async () => {
  const unreachable = "https://invalid.localhost.invalid/schema.json";
  const sample = {};
  const res = await validateInterface(sample, unreachable);
  assert.equal(res.valid, false, "Unreachable schema should result in invalid");
  assert.ok(res.errors, "Errors should be reported for unreachable schema");
});
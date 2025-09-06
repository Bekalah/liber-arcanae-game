import {validateInterface} from "../engines/interface-guard.js";

import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

(async ()=>{
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const samplePath = path.resolve(__dirname, "../assets/data/sample_interface.json");
  const sample = JSON.parse(await readFile(samplePath, "utf8"));
  const res = await validateInterface(sample, "http://localhost:8080/assets/data/interface.schema.json");

import {readFile} from "fs/promises";

(async ()=>{
  const schemaText = await readFile(new URL("../assets/data/interface.schema.json", import.meta.url), "utf8");
  const schemaUrl = "data:application/json," + encodeURIComponent(schemaText);
  const sample = JSON.parse(await readFile(new URL("../assets/data/sample_interface.json", import.meta.url), "utf8"));
  const res = await validateInterface(sample, schemaUrl);
  if(!res.valid){ throw new Error("Interface schema failed: "+JSON.stringify(res.errors)); }
  console.log("Interface schema OK");
})();

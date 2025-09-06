import {validateInterface} from "../engines/interface-guard.js";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

(async ()=>{
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const samplePath = path.resolve(__dirname, "../assets/data/sample_interface.json");
  const sample = JSON.parse(await readFile(samplePath, "utf8"));
  const res = await validateInterface(sample, "http://localhost:8080/assets/data/interface.schema.json");
  if(!res.valid){ throw new Error("Interface schema failed: "+JSON.stringify(res.errors)); }
  console.log("Interface schema OK");
})();

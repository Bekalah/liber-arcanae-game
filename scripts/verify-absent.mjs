// PROTECT charter guard: block forbidden binaries from reviving.
// ND-safe: small pure script, no network, exits 1 if undead paths return.
import { existsSync } from "node:fs";

const tombs = ["img/black-madonna.png"]; // extend if more haunted assets appear
const risen = tombs.filter(p => existsSync(p));

if (risen.length) {
  console.error("PROTECT violation: undead asset(s) present:", risen);
  process.exit(1);
} else {
  console.log("Guard ok - no undead assets detected.");
}

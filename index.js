import {loadRegistry} from "./engines/registry-loader.js";
import {loadFromRepo} from "./engines/cross-fetch.js";
import {validateInterface} from "./engines/interface-guard.js";
import {composeView} from "./engines/merge-view.js";

(async ()=>{
  try{
    const registry = await loadRegistry();
    const codexNodes = await loadFromRepo(registry, "cosmogenesis-learning-engine", "assets/data/codex144.json").catch(()=>[]);
    const tarotMap   = await loadFromRepo(registry, "liber-arcanae", "assets/data/tarot_map.json").catch(()=>[]);
    const spine33    = await loadFromRepo(registry, "circuitum99", "assets/data/spine33.json").catch(()=>[]);
    const rooms144   = await loadFromRepo(registry, "stone-grimoire", "assets/data/rooms144.json").catch(()=>[]);

    const shared = {version:"1.0.0", palettes:[], geometry_layers:[], narrative_nodes:[...codexNodes, ...spine33]};
    const guard = await validateInterface(shared);
    if(!guard.valid){ console.warn("Interface warnings:", guard.errors); }
    const view = composeView(shared, {});
    window.__CATHEDRAL_VIEW__ = view;
  }catch(err){
    console.warn("Registry load failed:", err);
  }
})();

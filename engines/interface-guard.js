/*
  interface-guard.js
  Offline validator for shared interface shapes.
  ND-safe: avoids network requests and fails softly.
*/

export async function validateInterface(payload, schemaUrl="/assets/data/interface.schema.json"){
  try{
    const schema = await fetch(schemaUrl, {cache:"no-store"}).then(r=>r.json());
    const req = schema.required || [];
    const missing = req.filter(k => !(k in payload));
    return {valid: missing.length === 0, errors: missing.map(m => ({message:`missing ${m}`}))};
  }catch(e){
    return {valid:false, errors:[{message:e.message}]};
  }
}

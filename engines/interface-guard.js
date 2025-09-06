
// Validates incoming JSON against minimal interface schema; soft-fail to protect runtime.

export async function validateInterface(payload, schemaUrl="/assets/data/interface.schema.json"){
  try{
    const [schema, AjvMod] = await Promise.all([
      fetch(schemaUrl).then(r=>r.json()),

      import("https://cdn.skypack.dev/ajv@8?min").catch(()=>null)
    ]);
    if(AjvMod){
      const ajv = new AjvMod.default({allErrors:true, strict:false});
      const valid = ajv.validate(schema, payload);
      return {valid, errors: ajv.errors||[]};
    }
    const req = schema.required || [];
    const missing = req.filter(k=>!(k in payload));
    return {valid:missing.length===0, errors:missing.map(m=>({message:`missing ${m}`}))};
  }catch(e){
    return {valid:false, errors:[{message:e.message}]};
  }

      import("https://cdn.skypack.dev/ajv@8?min")
    ]);
    const ajv = new AjvMod.default({allErrors:true, strict:false});
    const valid = ajv.validate(schema, payload);
    return {valid, errors: ajv.errors||[]};
  }catch(e){ return {valid:false, errors:[{message:e.message}]}; }

}

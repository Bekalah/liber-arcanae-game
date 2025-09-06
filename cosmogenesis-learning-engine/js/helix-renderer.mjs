/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Why ND-safe: pure Canvas, no motion, soft palette, comments explain choices.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;

  // clear background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawDoubleHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  /* Layer 1: Vesica field — two circles forming a vesica piscis.
     ND-safe: thin strokes, static placement. */
  const r = Math.min(w, h) / NUM.ELEVEN;
  const offset = r / NUM.THREE;
  const cx1 = w / 2 - offset;
  const cx2 = w / 2 + offset;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  /* Layer 2: Tree-of-Life — simplified Sephirot layout.
     ND-safe: static geometry; node radius tied to numerology. */
  const nodes = [
    { x:0.5, y:0.05 }, // Kether
    { x:0.25, y:0.15 }, { x:0.75, y:0.15 }, // Chokmah, Binah
    { x:0.25, y:0.35 }, { x:0.75, y:0.35 }, // Chesed, Geburah
    { x:0.5, y:0.5 },   // Tiphereth
    { x:0.25, y:0.65 }, { x:0.75, y:0.65 }, // Netzach, Hod
    { x:0.5, y:0.8 },   // Yesod
    { x:0.5, y:0.95 }   // Malkuth
  ];
  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,5],[4,5],
    [3,6],[4,7],[5,8],
    [6,8],[7,8],[6,9],[7,9],[8,9]
  ];
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(p => {
    const a = nodes[p[0]], b = nodes[p[1]];
    ctx.beginPath();
    ctx.moveTo(a.x*w, a.y*h);
    ctx.lineTo(b.x*w, b.y*h);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  const r = Math.min(w,h)/NUM.NINETYNINE;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x*w, n.y*h, r, 0, Math.PI*2);
    ctx.fill();
  });
}

function drawFibonacci(ctx, w, h, color, NUM) {
  /* Layer 3: Fibonacci spiral — approximated log spiral polyline.
     ND-safe: single stroke, no animated growth. */
  const center = { x:w*0.75, y:h*0.5 };
  const a = Math.min(w,h)/NUM.THIRTYTHREE;
  const b = 0.15; // growth factor
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t=0; t<=Math.PI*4; t+=Math.PI/NUM.TWENTYTWO) {
    const r = a * Math.exp(b*t);
    const x = center.x + r*Math.cos(t);
    const y = center.y + r*Math.sin(t);
    if (t === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function drawDoubleHelix(ctx, w, h, colorA, colorB, NUM) {
  /* Layer 4: Double helix lattice — two sine waves and rungs.
     ND-safe: static weave, moderate contrast. */
  const amp = h/NUM.ELEVEN;
  const turns = NUM.NINE; // how many half-turns across width
  const step = 2;
  // first strand
  ctx.strokeStyle = colorA;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=0; x<=w; x+=step) {
    const t = (x/w)*Math.PI*turns;
    const y = h/2 + Math.sin(t)*amp;
    if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // second strand, phase-shifted
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x=0; x<=w; x+=step) {
    const t = (x/w)*Math.PI*turns + Math.PI;
    const y = h/2 + Math.sin(t)*amp;
    if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // lattice rungs
  ctx.strokeStyle = colorB;
  const spacing = w/NUM.TWENTYTWO;
  for (let x=0; x<=w; x+=spacing) {
    const t = (x/w)*Math.PI*turns;
    const y1 = h/2 + Math.sin(t)*amp;
    const y2 = h/2 + Math.sin(t+Math.PI)*amp;
    ctx.beginPath();
    ctx.moveTo(x,y1);
    ctx.lineTo(x,y2);
    ctx.stroke();
  }
}

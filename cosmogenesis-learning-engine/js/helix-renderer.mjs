/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Why ND-safe: pure Canvas, no motion, soft palette, comments explain choices.
  No animation, no external deps. Geometry uses numerology constants
  to keep proportions meaningful. All functions are pure and small.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2); // center origin

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, palette.layers[3], NUM);
  drawDoubleHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);

  ctx.restore();
}

function drawVesica(ctx, width, height, color, NUM) {
  // ND-safe: light grid of intersecting circles; static, gentle
  const radius = Math.min(width, height) / NUM.TWENTYTWO;
  const step = radius; // dense enough to suggest vesica field
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = -height; y <= height; y += step) {
    for (let x = -width; x <= width; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawTree(ctx, width, height, colorNode, colorPath, NUM) {
  // Simplified Kircher layout; proportions tied to NUM constants
  const scale = Math.min(width, height) / NUM.NINETYNINE;
  const nodes = [
    [0, -4], [2, -3], [-2, -3], [2, -1], [-2, -1],
    [0, 0], [2, 1], [-2, 1], [0, 2], [0, 3]
  ].map(([x, y]) => [x * scale * NUM.SEVEN, y * scale * NUM.SEVEN / NUM.ELEVEN]);

  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[3,6],[4,7],
    [6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[5,6],[5,7],[5,8],[1,5],
    [2,5],[0,5]
  ];

  ctx.strokeStyle = colorPath;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  }

  ctx.fillStyle = colorNode;
  const r = scale * NUM.SEVEN / NUM.THIRTYTHREE;
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
=======
    4) Double-helix lattice (two phase-shifted sine waves)

  All routines are pure and synchronous; no motion, no external deps.

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
=======
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1 — Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  const r = w / NUM.THREE; // uses numerology constant 3
  const offset = r / NUM.ELEVEN; // gentle overlap
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
=======
  ctx.arc(w / 2 - offset, cy, r, 0, Math.PI * 2);
  ctx.arc(w / 2 + offset, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2 — Tree of Life
function drawTree(ctx, w, h, nodeColor, edgeColor, NUM) {
  const cx = w / 2;
  const dx = w / NUM.SEVEN; // horizontal spacing
  const dy = h / NUM.NINE; // vertical spacing
  // simplified sephirot positions
  const nodes = [
    [cx, dy * 0.5],
    [cx + dx, dy * 1.5],
    [cx - dx, dy * 1.5],
    [cx - dx, dy * 3],
    [cx + dx, dy * 3],
    [cx, dy * 4.5],
    [cx - dx, dy * 6],
    [cx + dx, dy * 6],
    [cx, dy * 7.5],
    [cx, dy * 9]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4],
    [3,5],[4,5],[3,6],[4,7],[5,6],[5,7],[5,8],[6,7],
    [6,8],[7,8],[6,9],[7,9],[8,9],[1,5]
  ];
  ctx.strokeStyle = edgeColor;
  for (const [a,b] of paths) {
    const [ax,ay] = nodes[a];
    const [bx,by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const [x,y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, w / NUM.TWENTYTWO, 0, Math.PI * 2);

    ctx.fill();
  }
}
    
function drawFibonacci(ctx, color, NUM) {
  // Log spiral approximated via polyline
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.ELEVEN; // gentle count
  const step = Math.PI / NUM.SEVEN;
  const scale = NUM.THIRTYTHREE; // base radius

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t <= turns; t += step) {
    const r = scale * Math.pow(phi, t / Math.PI);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
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
=======
function drawDoubleHelix(ctx, width, height, colorA, colorB, NUM) {
  // Static lattice of two sine waves phase-shifted by PI
  const amp = height / NUM.NINE / 2;
  const wave = width / NUM.TWENTYTWO;
  const step = NUM.THREE; // fine grain

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = -width / 2; x <= width / 2; x += step) {
    const y = amp * Math.sin((x / wave) * Math.PI * 2);
    if (x === -width / 2) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = -width / 2; x <= width / 2; x += step) {
    const y = amp * Math.sin((x / wave) * Math.PI * 2 + Math.PI);
    if (x === -width / 2) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Lattice connectors
  ctx.strokeStyle = colorA;
  for (let x = -width / 2; x <= width / 2; x += wave) {
    const y1 = amp * Math.sin((x / wave) * Math.PI * 2);
    const y2 = amp * Math.sin((x / wave) * Math.PI * 2 + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);

// Layer 3 — Fibonacci log spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w * 0.75;
  const cy = h * 0.6;
  const base = Math.min(w, h) / NUM.TWENTYTWO;
  const pts = [];
  for (let i = 0; i < NUM.ELEVEN; i++) { // 11 points
    const theta = i * Math.PI / NUM.SEVEN; // gentle turn
    const r = base * Math.pow(phi, i);
    pts.push([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

// Layer 4 — Double helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.ONEFORTYFOUR; // sample count
  const amp = w / NUM.NINE;
  const cx = w / 2;
  const ptsA = [];
  const ptsB = [];
  for (let i = 0; i <= steps; i++) {
    const y = (h / steps) * i;
    const t = i / NUM.THIRTYTHREE; // frequency scaling
    ptsA.push([cx + Math.sin(t) * amp, y]);
    ptsB.push([cx + Math.sin(t + Math.PI) * amp, y]);
  }
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  ctx.moveTo(ptsA[0][0], ptsA[0][1]);
  for (let i = 1; i < ptsA.length; i++) ctx.lineTo(ptsA[i][0], ptsA[i][1]);
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  ctx.moveTo(ptsB[0][0], ptsB[0][1]);
  for (let i = 1; i < ptsB.length; i++) ctx.lineTo(ptsB[i][0], ptsB[i][1]);
  ctx.stroke();
  // lattice rungs every 11th point
  ctx.strokeStyle = colorB;
  for (let i = 0; i < ptsA.length; i += NUM.ELEVEN) {
    ctx.beginPath();
    ctx.moveTo(ptsA[i][0], ptsA[i][1]);
    ctx.lineTo(ptsB[i][0], ptsB[i][1]);

    ctx.stroke();
  }
}

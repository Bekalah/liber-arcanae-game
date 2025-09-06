/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine strands with crossbars)

  All geometry is parameterized with numerology constants passed via NUM.
  No animation, no network, calm palette.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaGrid(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

// Layer 1: Vesica grid
function drawVesicaGrid(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  const cols = NUM.THREE;
  const rows = NUM.THREE;
  const r = Math.min(w, h) / NUM.NINE;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = ((x + 0.5) * w) / cols;
      const cy = ((y + 0.5) * h) / rows;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold
function drawTreeOfLife(ctx, w, h, color, NUM) {
  const nodes = [
    [w / 2, h * 0.05], // 1 Kether
    [w * 0.3, h * 0.18], // 2 Chokmah
    [w * 0.7, h * 0.18], // 3 Binah
    [w * 0.3, h * 0.35], // 4 Chesed
    [w * 0.7, h * 0.35], // 5 Geburah
    [w / 2, h * 0.5], // 6 Tiferet
    [w * 0.3, h * 0.65], // 7 Netzach
    [w * 0.7, h * 0.65], // 8 Hod
    [w / 2, h * 0.8], // 9 Yesod
    [w / 2, h * 0.95] // 10 Malkuth
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[3,6],[4,7],
    [5,6],[5,7],[6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[1,5],[2,5],
    [0,5],[5,9]
  ];
  ctx.strokeStyle = color;
  paths.forEach(([a,b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  });
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Layer 3: Fibonacci curve
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = 4; // base radius
  const center = { x: w * 0.75, y: h * 0.3 };
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const theta = i * (Math.PI / NUM.SEVEN);
    const r = a * Math.pow(phi, theta);
    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelixLattice(ctx, w, h, colorA, colorB, NUM) {
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= NUM.NINETYNINE; i++) {
    const t = (i / NUM.NINETYNINE) * h;
    const phase = (i / NUM.ELEVEN) * Math.PI * 2;
    const xA = w * 0.25 + Math.sin(phase) * (w / NUM.TWENTYTWO);
    const xB = w * 0.75 + Math.sin(phase + Math.PI) * (w / NUM.TWENTYTWO);
    pointsA.push([xA, t]);
    pointsB.push([xB, t]);
  }
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  pointsA.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  pointsB.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= NUM.NINE; i++) {
    const idx = i * Math.floor(pointsA.length / NUM.NINE);
    const [x1, y1] = pointsA[idx];
    const [x2, y2] = pointsB[idx];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

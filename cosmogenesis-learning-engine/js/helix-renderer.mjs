/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  All routines are pure and synchronous; no motion, no external deps.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
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

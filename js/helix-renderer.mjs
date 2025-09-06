/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted sine strands)

  Rationale:
    - No motion or autoplay; static draw order keeps focus gentle.
    - Gentle contrast palette per layer for readability.
    - Small pure functions; no hidden state.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}

// Layer 1: Vesica field grid
function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  const cols = NUM.THREE;
  const rows = NUM.THREE;
  const r = Math.min(w, h) / NUM.NINE;
  const stepX = w / cols;
  const stepY = h / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = (i + 0.5) * stepX;
      const cy = (j + 0.5) * stepY;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  const nodes = [
    {x:0.5, y:0.05},
    {x:0.75, y:0.15},
    {x:0.25, y:0.15},
    {x:0.75, y:0.35},
    {x:0.25, y:0.35},
    {x:0.5, y:0.45},
    {x:0.75, y:0.65},
    {x:0.25, y:0.65},
    {x:0.5, y:0.75},
    {x:0.5, y:0.9}
  ];
  const paths = [
    [1,2],[1,3],[1,6],
    [2,3],[2,4],[2,6],[2,7],
    [3,5],[3,6],
    [4,5],[4,6],[4,7],
    [5,6],[5,8],
    [6,8],[6,9],
    [7,8],[7,9],[7,10],
    [8,9],[8,10],
    [9,10]
  ];
  for (const [a,b] of paths) {
    const A = nodes[a-1];
    const B = nodes[b-1];
    ctx.beginPath();
    ctx.moveTo(A.x * w, A.y * h);
    ctx.lineTo(B.x * w, B.y * h);
    ctx.stroke();
  }
  const r = NUM.NINE;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3: Fibonacci spiral polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  const cx = w / 2;
  const cy = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const step = Math.PI / NUM.THIRTYTHREE;
  const max = NUM.THREE * Math.PI;
  let first = true;
  for (let t = 0; t <= max; t += step) {
    const r = Math.pow(phi, t / (Math.PI / 2)) * (w / NUM.ONEFORTYFOUR);
    const x = cx + r * Math.cos(t);
    const y = cy - r * Math.sin(t);
    if (first) { ctx.moveTo(x, y); first = false; }
    else { ctx.lineTo(x, y); }
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelix(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  const steps = NUM.ONEFORTYFOUR;
  const amp = h / NUM.SEVEN;
  const mid = h / 2;
  const phase = Math.PI;
  const length = NUM.TWENTYTWO;
  // first strand
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const t = (i / steps) * length;
    const y = mid + amp * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // second strand
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const t = (i / steps) * length;
    const y = mid + amp * Math.sin(t + phase);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // crossbars every ELEVEN steps
  for (let i = 0; i <= steps; i += NUM.ELEVEN) {
    const x = (i / steps) * w;
    const t = (i / steps) * length;
    const y1 = mid + amp * Math.sin(t);
    const y2 = mid + amp * Math.sin(t + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

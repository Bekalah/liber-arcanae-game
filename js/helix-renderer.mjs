/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice

  Rationale:
    - No motion or autoplay; everything draws once for calm viewing.
    - Gentle contrast palette applied per layer for depth without overload.
    - Small pure functions keep geometry transparent and auditable.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

// Layer 1: Vesica field using a 3x3 grid (NUM.THREE)
function drawVesica(ctx, w, h, color, NUM) {
  const rows = NUM.THREE; // ND-safe: limited repetition avoids overload
  const cols = NUM.THREE;
  const r = Math.min(w / (cols * 2), h / (rows * 2));
  const stepX = w / (cols + 1);
  const stepY = h / (rows + 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 1; i <= cols; i++) {
    for (let j = 1; j <= rows; j++) {
      const cx = i * stepX;
      const cy = j * stepY;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold
// Static nodes and paths; palette color chosen for calm mid-tone.
function drawTreeOfLife(ctx, w, h, color, NUM) {
  const nodes = [
    [w / 2, h * 0.05],
    [w * 0.3, h * 0.18],
    [w * 0.7, h * 0.18],
    [w * 0.3, h * 0.35],
    [w * 0.7, h * 0.35],
    [w / 2, h * 0.5],
    [w * 0.3, h * 0.65],
    [w * 0.7, h * 0.65],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95]
  ];
  // Twenty-two simplified paths; count mirrors NUM.TWENTYTWO
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
    ctx.arc(x, y, NUM.THREE, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Layer 3: Fibonacci curve
// Rendered once to avoid motion; color from palette keeps contrast gentle.
function drawFibonacciCurve(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = NUM.THREE + 1; // base radius derived from numerology
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
// Static lattice: two strands with fixed crossbars, no animation.
function drawHelixLattice(ctx, w, h, colorA, colorB, NUM) {
  const pointsA = [];
  const pointsB = [];
  const steps = NUM.NINETYNINE; // density without overload
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * w;
    const phase = (i / NUM.ELEVEN) * Math.PI * 2;
    const yA = h * 0.25 + Math.sin(phase) * (h / NUM.NINE);
    const yB = h * 0.75 + Math.sin(phase + Math.PI) * (h / NUM.NINE);
    pointsA.push([t, yA]);
    pointsB.push([t, yB]);
  }
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  pointsA.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  pointsB.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  // Crossbars hint at DNA ladder; count based on NUM.NINE
  const step = Math.floor(pointsA.length / NUM.NINE);
  ctx.strokeStyle = colorB;
  for (let i = 0; i < pointsA.length; i += step) {
    const [x1,y1] = pointsA[i];
    const [x2,y2] = pointsB[i];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}


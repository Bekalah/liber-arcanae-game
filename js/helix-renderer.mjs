/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (drawn in order):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice

  Rationale:
    - No motion or autoplay; everything renders once.
    - Soft contrast palette keeps focus gentle.
    - Pure functions avoid hidden state.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Static layers rendered in a calm order
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

// Layer 1: Vesica field using a 3x3 grid (NUM.THREE)
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.THREE;
  const rows = NUM.THREE;
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

// Layer 2: Tree-of-Life scaffold with 10 nodes and 22 paths
function drawTreeOfLife(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

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

  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[3,6],[4,7],
    [5,6],[5,7],[6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[1,5],[2,5],
    [0,5],[5,9]
  ]; // 22 paths honouring NUM.TWENTYTWO

  for (const [a, b] of paths) {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  const r = NUM.THREE; // gentle node size
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3: Fibonacci curve using 33 segments (NUM.THIRTYTHREE)
function drawFibonacciCurve(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = { x: w * 0.75, y: h * 0.3 };
  const scale = Math.min(w, h) / NUM.NINETYNINE;
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const theta = i * (Math.PI / NUM.SEVEN);
    const r = scale * Math.pow(phi, i / NUM.NINE);
    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Static double-helix lattice
function drawHelixLattice(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.ONEFORTYFOUR; // 144 vertical steps
  const amp = h / NUM.NINE;
  const mid = h / 2;
  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    strandA.push([x, mid + amp * Math.sin(i / NUM.ELEVEN)]);
    strandB.push([x, mid + amp * Math.sin(i / NUM.ELEVEN + Math.PI)]);
  }
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  strandA.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  strandB.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.strokeStyle = colorB; // crossbars
  const barStep = Math.floor(steps / NUM.NINE);
  for (let i = 0; i <= steps; i += barStep) {
    const [x1, y1] = strandA[i];
    const [x2, y2] = strandB[i];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

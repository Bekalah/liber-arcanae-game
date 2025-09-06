/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine links)
*/

// renderHelix orchestrates layer drawing; kept small for clarity
export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}

// Layer 1: Vesica field using a 3x3 grid (NUM.THREE)
function drawVesica(ctx, w, h, color, NUM) {
  const rows = NUM.THREE; // ND-safe: limited repetition avoids visual overload
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


// Layer 2: Tree-of-Life scaffold with 10 nodes and 22 paths
function drawTree(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  const nodes = [
    { x:0.5, y:0.05 }, // 1 Keter
    { x:0.75, y:0.15 }, // 2 Chokmah
    { x:0.25, y:0.15 }, // 3 Binah
    { x:0.75, y:0.35 }, // 4 Chesed
    { x:0.25, y:0.35 }, // 5 Gevurah
    { x:0.5, y:0.45 }, // 6 Tiferet
    { x:0.75, y:0.65 }, // 7 Netzach
    { x:0.25, y:0.65 }, // 8 Hod
    { x:0.5, y:0.75 }, // 9 Yesod
    { x:0.5, y:0.9 }   //10 Malkuth
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
  ]; // 22 paths honoring NUM.TWENTYTWO

  // Draw paths
  for (const [a, b] of paths) {
    const A = nodes[a - 1];
    const B = nodes[b - 1];
    ctx.beginPath();
    ctx.moveTo(A.x * w, A.y * h);
    ctx.lineTo(B.x * w, B.y * h);
    ctx.stroke();
  }

  // Draw nodes with radius tied to NUM.NINE
  const r = NUM.NINE;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3: Fibonacci spiral using 33 segments (NUM.THIRTYTHREE)
function drawFibonacci(ctx, w, h, color, NUM) {
  const cx = w / 2;
  const cy = h / 2;
  const golden = (1 + Math.sqrt(5)) / 2; // φ for growth ratio
  const points = [];
  const base = Math.min(w, h) / NUM.ONEFORTYFOUR; // 144 as scale anchor
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const angle = i * (Math.PI / NUM.ELEVEN); // gentle turn
    const r = base * Math.pow(golden, i / NUM.SEVEN);
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

// Layer 4: Static double-helix lattice with 144 vertical steps
function drawHelix(ctx, w, h, color, NUM) {
  const steps = NUM.ONEFORTYFOUR; // dense but still static
  const amp = h / NUM.NINE; // amplitude tied to NUM.NINE
  const mid = h / 2;
  const stepX = w / steps;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const x = i * stepX;
    const y1 = mid + amp * Math.sin(i / NUM.ELEVEN);
    const y2 = mid + amp * Math.sin(i / NUM.ELEVEN + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);

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

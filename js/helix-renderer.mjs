// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (drawn in order):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice (two phase-shifted strands with calm crossbars)

  Rationale:
    - No motion or autoplay; everything renders once.
    - Soft contrast palette keeps focus gentle.
    - Pure functions highlight numerology constants.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves depth: base geometry first, lattice last
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], NUM);
}

// Layer 1: Vesica field using a 3x3 grid
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.THREE;
  const rows = NUM.THREE;
  const r = Math.min(w, h) / NUM.NINE; // ND-safe: gentle radius balances the grid
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = ((i + 0.5) * w) / cols;
      const cy = ((j + 0.5) * h) / rows;
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
  ctx.lineWidth = 1; // ND-safe: thin lines keep focus soft

  const nodes = [
    { id: "C144N-001", x: w / 2, y: h * 0.05 },
    { id: "C144N-002", x: w * 0.3, y: h * 0.18 },
    { id: "C144N-003", x: w * 0.7, y: h * 0.18 },
    { id: "C144N-004", x: w * 0.3, y: h * 0.35 },
    { id: "C144N-005", x: w * 0.7, y: h * 0.35 },
    { id: "C144N-006", x: w / 2, y: h * 0.5 },
    { id: "C144N-007", x: w * 0.3, y: h * 0.65 },
    { id: "C144N-008", x: w * 0.7, y: h * 0.65 },
    { id: "C144N-009", x: w / 2, y: h * 0.8 },
    { id: "C144N-010", x: w / 2, y: h * 0.95 }
  ];
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const paths = [
    { id: "G-099-01", a: "C144N-001", b: "C144N-002" },
    { id: "G-099-02", a: "C144N-001", b: "C144N-003" },
    { id: "G-099-03", a: "C144N-002", b: "C144N-003" },
    { id: "G-099-04", a: "C144N-002", b: "C144N-004" },
    { id: "G-099-05", a: "C144N-003", b: "C144N-005" },
    { id: "G-099-06", a: "C144N-004", b: "C144N-005" },
    { id: "G-099-07", a: "C144N-004", b: "C144N-006" },
    { id: "G-099-08", a: "C144N-005", b: "C144N-006" },
    { id: "G-099-09", a: "C144N-004", b: "C144N-007" },
    { id: "G-099-10", a: "C144N-005", b: "C144N-008" },
    { id: "G-099-11", a: "C144N-006", b: "C144N-007" },
    { id: "G-099-12", a: "C144N-006", b: "C144N-008" },
    { id: "G-099-13", a: "C144N-007", b: "C144N-008" },
    { id: "G-099-14", a: "C144N-007", b: "C144N-009" },
    { id: "G-099-15", a: "C144N-008", b: "C144N-009" },
    { id: "G-099-16", a: "C144N-007", b: "C144N-010" },
    { id: "G-099-17", a: "C144N-008", b: "C144N-010" },
    { id: "G-099-18", a: "C144N-009", b: "C144N-010" },
    { id: "G-099-19", a: "C144N-002", b: "C144N-006" },
    { id: "G-099-20", a: "C144N-003", b: "C144N-006" },
    { id: "G-099-21", a: "C144N-001", b: "C144N-006" },
    { id: "G-099-22", a: "C144N-006", b: "C144N-010" }
  ];
  // honour NUM.TWENTYTWO: ensure path count stays aligned with 22
  if (paths.length !== NUM.TWENTYTWO) {
    console.warn("Tree-of-Life path count expected", NUM.TWENTYTWO, "got", paths.length);
  }

  // 22 paths honoring NUM.TWENTYTWO (checked above)

  for (const { a, b } of paths) {
    const { x: ax, y: ay } = nodeMap[a];
    const { x: bx, y: by } = nodeMap[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  const r = NUM.NINE; // gentle node radius
  for (const { x, y } of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3: Fibonacci curve using 33 segments
function drawFibonacciCurve(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = { x: w * 0.75, y: h * 0.3 };
  const scale = Math.min(w, h) / NUM.NINETYNINE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
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
function drawHelixLattice(ctx, w, h, color, NUM) {
  const steps = NUM.ONEFORTYFOUR; // 144 vertical steps
  const amp = h / NUM.NINE;
  const mid = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1; // ND-safe: fine lines keep lattice subtle

  // strand A
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = mid + amp * Math.sin(i / NUM.ELEVEN);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // strand B (phase-shifted by π)
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = mid + amp * Math.sin(i / NUM.ELEVEN + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // crossbars every 16 steps (approx 144/9)
  const barStep = Math.floor(steps / NUM.NINE); // ND-safe: static crossbars provide calm symmetry
  for (let i = 0; i <= steps; i += barStep) {
    const x = (i / steps) * w;
    const y1 = mid + amp * Math.sin(i / NUM.ELEVEN);
    const y2 = mid + amp * Math.sin(i / NUM.ELEVEN + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

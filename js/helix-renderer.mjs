/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  Rationale:
    - No motion or autoplay: keeps focus gentle for neurodivergent readers.
    - Soft contrast palette applied per layer for depth without overstimulation.
    - Small pure functions make local reasoning easy and avoid hidden state.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

// Layer 1: Vesica field laid out on a 3-based grid.
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const step = r / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, w / NUM.ONEFORTYFOUR);
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold with ten nodes and twenty-two paths.
function drawTree(ctx, w, h, color, NUM) {
  const nodes = [
    [0.5, 0.05], [0.3, 0.18], [0.7, 0.18], [0.3, 0.35], [0.7, 0.35],
    [0.5, 0.5], [0.3, 0.65], [0.7, 0.65], [0.5, 0.8], [0.5, 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],[6,8],[7,8],[6,9],
    [7,9],[8,9],[1,5],[2,5],[0,5],[5,9]
  ]; // 22 paths == NUM.TWENTYTWO
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, w / NUM.ONEFORTYFOUR);
  paths.forEach(([a, b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax * w, ay * h);
    ctx.lineTo(bx * w, by * h);
    ctx.stroke();
  });
  const r = Math.min(w, h) / NUM.NINETYNINE * NUM.THREE;
  ctx.fillStyle = color;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * w, y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve grown from sacred ratios.
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w * 0.75;
  const cy = h * 0.3;
  const a = NUM.THREE; // base radius
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const theta = i * (Math.PI / NUM.SEVEN);
    const r = a * Math.pow(phi, theta / Math.PI);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice; static strands with calm crossbars.
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.ONEFORTYFOUR; // density tied to NUM.ONEFORTYFOUR
  const amp = h / NUM.NINE;
  const mid = h / 2;
  const stepX = w / steps;

  ctx.lineWidth = 1;

  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = i * stepX;
    const phase = i * Math.PI / NUM.TWENTYTWO;
    const y = mid + amp * Math.sin(phase);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = i * stepX;
    const phase = i * Math.PI / NUM.TWENTYTWO;
    const y = mid + amp * Math.sin(phase + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  const gap = Math.floor(steps / NUM.NINE);
  for (let i = 0; i <= steps; i += gap) {
    const phase = i * Math.PI / NUM.TWENTYTWO;
    const x = i * stepX;
    const y1 = mid + amp * Math.sin(phase);
    const y2 = mid + amp * Math.sin(phase + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

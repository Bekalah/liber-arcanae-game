/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  Rationale:
    - No motion or autoplay: keeps focus gentle for neurodivergent readers.
    - Soft contrast palette applied per layer for depth without overstimulation.
    - Small pure functions make local reasoning easy and avoid hidden state.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const step = r / (NUM.THREE / 2); // overlap for vesica grid
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, w / NUM.ONEFORTYFOUR);
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // ND-safe: repeating circles with steady spacing; nothing flashes.
}

function drawTree(ctx, w, h, color, NUM) {
  const nodes = [
    {x:0.5, y:0.05},
    {x:0.75, y:0.2},
    {x:0.25, y:0.2},
    {x:0.75, y:0.4},
    {x:0.25, y:0.4},
    {x:0.5, y:0.55},
    {x:0.75, y:0.7},
    {x:0.25, y:0.7},
    {x:0.5, y:0.85},
    {x:0.5, y:0.95}
  ];
  const edges = [
    [1,2],[1,3],[1,6],[2,3],[2,4],[3,5],[4,5],[2,6],[3,6],[4,6],[5,6],
    [4,7],[5,8],[6,7],[6,8],[6,9],[7,8],[7,9],[8,9],[7,10],[8,10],[9,10]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    const na = nodes[a-1];
    const nb = nodes[b-1];
    ctx.beginPath();
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();
  });
  const r = Math.min(w, h) / NUM.NINETYNINE * NUM.THREE;
  ctx.fillStyle = color;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
  // ND-safe: clean scaffold, balanced symmetry, stable points.
}

function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w / NUM.THREE;
  const cy = h * NUM.NINE / NUM.ELEVEN;
  const scale = w / NUM.ONEFORTYFOUR;
  const max = NUM.THREE * Math.PI; // three half-turns
  const step = Math.PI / NUM.TWENTYTWO;
  const pts = [];
  for (let t = 0; t <= max; t += step) {
    const r = Math.pow(phi, t / (Math.PI / 2)) * scale;
    const x = cx + r * Math.cos(t);
    const y = cy - r * Math.sin(t);
    pts.push([x, y]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  });
  ctx.stroke();
  // ND-safe: static spiral hints at growth without any rotation.
}

function drawHelix(ctx, w, h, color, NUM) {
  const amp = w * NUM.THREE / NUM.THIRTYTHREE; // width/11 for gentle spread
  const step = h / NUM.ONEFORTYFOUR;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  let p1 = null;
  let p2 = null;
  for (let y = 0; y <= h; y += step) {
    const t = (y / h) * Math.PI * NUM.TWENTYTWO * NUM.THREE / NUM.ELEVEN; // six pi over height
    const x1 = w / 2 + amp * Math.sin(t);
    const x2 = w / 2 + amp * Math.sin(t + Math.PI);
    if (p1) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
    if ((y / step) % NUM.NINE === 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
    p1 = { x:x1, y };
    p2 = { x:x2, y };
  }
  // ND-safe: fixed twin strands with quiet crossbars.
}

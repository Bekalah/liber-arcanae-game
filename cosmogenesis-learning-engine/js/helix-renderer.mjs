/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sin curves)

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
    ctx.stroke();
  }
}

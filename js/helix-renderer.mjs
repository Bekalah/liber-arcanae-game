/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted braids)

  Design notes:
    - All functions are small and pure where possible to ease auditing.
    - Colors are drawn from palette layers; calm hues avoid sensory overload.
    - No animation or motion is introduced; everything is rendered once.
*/

export function renderHelix(ctx, options) {
  if (!ctx) {
    return;
  }

  const { width, height, palette, NUM, paletteLoaded, statusEl } = options;
  const safePalette = palette || { bg: "#0b0b12", ink: "#e8e8f0", layers: ["#6d82d1", "#7bcbdc", "#8fd99f", "#f7d88a"] };

  clearCanvas(ctx, width, height, safePalette.bg);

  const center = { x: width / 2, y: height / 2 };
  const layerColors = safePalette.layers;

  drawVesicaField(ctx, center, width, height, layerColors, NUM);
  drawTreeOfLife(ctx, center, width, height, layerColors, NUM, safePalette.ink);
  drawFibonacciCurve(ctx, center, width, height, layerColors, NUM);
  drawHelixLattice(ctx, center, width, height, layerColors, NUM);

  // ND-safe inline notice when palette fallback is active.
  if (!paletteLoaded) {
    drawNotice(ctx, width, height, safePalette.ink, "Palette fallback active.");
  }

  if (statusEl) {
    statusEl.dataset.rendered = "true";
  }
}

function clearCanvas(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function pickColor(layerColors, index) {
  const fallback = "#a6a6c1";
  if (!Array.isArray(layerColors) || layerColors.length === 0) {
    return fallback;
  }
  return layerColors[index % layerColors.length];
}

function drawVesicaField(ctx, center, width, height, layerColors, NUM) {
  const baseRadius = Math.min(width, height) / (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO);
  const offsets = [0, 1, 2];
  ctx.save();
  ctx.globalAlpha = 0.35;
  offsets.forEach((offset) => {
    const radius = baseRadius * (1 + offset / NUM.ELEVEN);
    const dx = radius / NUM.THREE;
    const color = pickColor(layerColors, offset);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    // Vesica petals
    drawCircle(ctx, center.x - dx, center.y, radius);
    drawCircle(ctx, center.x + dx, center.y, radius);
    // Vertical harmonic circles add layered depth without motion.
    drawCircle(ctx, center.x, center.y - dx, radius * 0.88);
    drawCircle(ctx, center.x, center.y + dx, radius * 0.88);
  });
  ctx.restore();
}

function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, center, width, height, layerColors, NUM, inkColor) {
  const radius = Math.min(width, height) / (NUM.ELEVEN + NUM.THREE / NUM.NINE);
  const columnSpacing = radius * 0.9;
  const rowSpacing = radius * 0.8;
  const top = center.y - rowSpacing * 3;
  const left = center.x - columnSpacing * 1.5;

  const nodes = createTreeNodes(left, top, columnSpacing, rowSpacing);
  const paths = createTreePaths();

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = pickColor(layerColors, 3);
  ctx.globalAlpha = 0.7;
  paths.forEach(([from, to]) => {
    const a = nodes[from];
    const b = nodes[to];
    if (!a || !b) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = inkColor;
  nodes.forEach((node, index) => {
    const nodeRadius = radius / NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pickColor(layerColors, index + 4);
    ctx.stroke();
  });
  ctx.restore();
}

function createTreeNodes(left, top, columnSpacing, rowSpacing) {
  // Simplified 10 Sephirot layout across four columns and seven rows.
  return [
    { x: left + columnSpacing * 1.5, y: top },
    { x: left + columnSpacing * 0.5, y: top + rowSpacing },
    { x: left + columnSpacing * 2.5, y: top + rowSpacing },
    { x: left + columnSpacing * 0.5, y: top + rowSpacing * 2 },
    { x: left + columnSpacing * 2.5, y: top + rowSpacing * 2 },
    { x: left + columnSpacing * 1.5, y: top + rowSpacing * 3 },
    { x: left + columnSpacing * 0.5, y: top + rowSpacing * 4 },
    { x: left + columnSpacing * 2.5, y: top + rowSpacing * 4 },
    { x: left + columnSpacing * 1.5, y: top + rowSpacing * 5 },
    { x: left + columnSpacing * 1.5, y: top + rowSpacing * 6 }
  ];
}

function createTreePaths() {
  // 22 connections referencing classical Tree of Life pathways.
  return [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [2, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [6, 5], [7, 5],
    [6, 8], [7, 8], [8, 9],
    [3, 4], [1, 6], [2, 7],
    [0, 5], [5, 8], [6, 9], [7, 9], [2, 3]
  ];
}

function drawFibonacciCurve(ctx, center, width, height, layerColors, NUM) {
  const color = pickColor(layerColors, 5);
  const segments = createFibonacciSegments(NUM);
  const scale = Math.min(width, height) / (NUM.NINETYNINE / NUM.ELEVEN);
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  segments.forEach((point, index) => {
    const px = center.x + point.x * scale;
    const py = center.y + point.y * scale;
    if (index === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  });
  ctx.stroke();
  ctx.restore();
}

function createFibonacciSegments(NUM) {
  // Polyline approximating a logarithmic Fibonacci spiral using constant growth.
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE + NUM.NINE / NUM.TWENTYTWO;
  const points = [];
  const step = (Math.PI * 2 * turns) / NUM.THIRTYTHREE;
  for (let angle = 0; angle <= Math.PI * 2 * turns; angle += step) {
    const radius = Math.pow(phi, angle / (Math.PI * 2)) / NUM.ELEVEN;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }
  return points;
}

function drawHelixLattice(ctx, center, width, height, layerColors, NUM) {
  const colorA = pickColor(layerColors, 1);
  const colorB = pickColor(layerColors, 2);
  const segments = NUM.NINETYNINE;
  const amplitude = Math.min(width, height) / NUM.TWENTYTWO;
  const length = width * 0.7;
  const startX = center.x - length / 2;
  const deltaX = length / segments;
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.8;

  drawHelixStrand(ctx, startX, center.y - amplitude / NUM.THREE, deltaX, segments, amplitude, colorA, NUM.THREE);
  drawHelixStrand(ctx, startX, center.y + amplitude / NUM.THREE, deltaX, segments, amplitude, colorB, NUM.NINE / NUM.THREE);

  // Rungs to suggest lattice binding the two strands.
  ctx.strokeStyle = pickColor(layerColors, 0);
  for (let i = 0; i <= segments; i += NUM.THREE) {
    const t = i / segments * Math.PI * 2;
    const x = startX + deltaX * i;
    const y1 = center.y - amplitude * Math.sin(t + Math.PI / NUM.ELEVEN);
    const y2 = center.y + amplitude * Math.sin(t + Math.PI / NUM.SEVEN);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHelixStrand(ctx, startX, baselineY, deltaX, segments, amplitude, color, phaseShift) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const x = startX + deltaX * i;
    const t = (i / segments) * Math.PI * 4 + phaseShift;
    const y = baselineY + amplitude * Math.sin(t);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawNotice(ctx, width, height, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "12px/1.4 system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.globalAlpha = 0.6;
  ctx.fillText(message, 16, height - 24);
  ctx.restore();
}

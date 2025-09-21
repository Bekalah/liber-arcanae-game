// Per Texturas Numerorum, Spira Loquitur.  //
/**
 * Render the full static helix composition onto a 2D canvas.
 *
 * Draws four layered components in a fixed order (vesica field, Tree of Life scaffold,
 * Fibonacci curve, double-helix lattice) and fills the ND-safe background first.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context; function returns immediately if falsy.
 * @param {Object} opts - Rendering options.
 * @param {number} opts.width - Canvas width in pixels.
 * @param {number} opts.height - Canvas height in pixels.
 * @param {Object} opts.palette - Color palette with optional `bg`, `ink`, and `layers` array.
 * @param {Object} opts.NUM - Numerology constants used by the layers (expects keys like THREE, NINE, SEVEN, TWENTYTWO, THIRTYTHREE, NINETYNINE, ONEFORTYFOUR, etc.).
 * @param {boolean} opts.paletteLoaded - If false, a small fallback notice is rendered.
 */

export function renderHelix(ctx, opts) {
  if (!ctx) return;
  const { width, height, palette, NUM, paletteLoaded } = opts;
  const background = palette && palette.bg ? palette.bg : "#0b0b12";
  const ink = palette && palette.ink ? palette.ink : "#e8e8f0";
  const colors = Array.isArray(palette && palette.layers) ? palette.layers.slice() : [];
  while (colors.length < 4) {
    colors.push(ink);
  }

  ctx.clearRect(0, 0, width, height);
  // ND-safe: fill background first to avoid flashes before lines appear
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves depth: base geometry first, lattice last
  drawVesica(ctx, width, height, colors[0], NUM);
  drawTreeOfLife(ctx, width, height, colors[1], NUM);
  drawFibonacciCurve(ctx, width, height, colors[2], NUM);
  drawHelixLattice(ctx, width, height, colors[3], NUM);

  if (!paletteLoaded) {
    drawPaletteFallbackNotice(ctx, width, height, ink);
  }
}

/**
 * Draws a 3×3 vesica field: pairs of overlapping circles placed in each grid cell.
 *
 * Two circles are drawn per cell (one shifted left, one right) using a radius computed as min(w, h) / NUM.NINE and a horizontal pair offset of radius / 2. The function sets ctx.strokeStyle to the provided color and uses a fixed line width of 2.
 *
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 * @param {string|CanvasGradient|CanvasPattern} color - Stroke style used for the circle outlines.
 * @param {Object} NUM - Numeric constants object; must include NUM.THREE (grid size) and NUM.NINE (radius divisor).
 */
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.THREE;
  const rows = NUM.THREE;
  const radius = Math.min(w, h) / NUM.NINE; // 9 keeps the intersections gentle
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = ((i + 0.5) * w) / cols;
      const cy = ((j + 0.5) * h) / rows;
      ctx.beginPath();
      ctx.arc(cx - radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

/**
 * Render a Tree-of-Life scaffold: 10 nodes connected by 22 straight paths.
 *
 * Draws a fixed layout of 10 nodes and their interconnecting paths onto the provided canvas context.
 * Line thickness and node radius scale with the canvas size using values from the `NUM` constants.
 * If the declared path count doesn't match `NUM.TWENTYTWO`, a console warning is emitted.
 * Any path that references a missing node id is skipped silently.
 *
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 * @param {string} color - Stroke/fill color used for paths and nodes.
 * @param {Object} NUM - Numerology constants object (expects at least ONEFORTYFOUR, TWENTYTWO, THREE, NINE).
 */
function drawTreeOfLife(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const baseLine = Math.max(1, Math.round(Math.min(w, h) / NUM.ONEFORTYFOUR));
  ctx.lineWidth = baseLine; // ND-safe: thin lines keep focus soft

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
  if (paths.length !== NUM.TWENTYTWO) {
    console.warn("Tree-of-Life path count expected", NUM.TWENTYTWO, "got", paths.length);
  }

  for (const { a, b } of paths) {
    const start = nodeMap[a];
    const end = nodeMap[b];
    if (!start || !end) continue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  const nodeRadius = Math.max(baseLine * NUM.THREE, NUM.NINE / NUM.THREE); // ensures gentle nodes
  for (const { x, y } of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draws a Fibonacci-inspired spiral polyline (33 segments) onto the given canvas context.
 *
 * The curve is centered near the upper-right quadrant (x ≈ 75% of width, y ≈ 30% of height), scales with canvas size via NUM.NINETYNINE, and advances radially using powers of the golden ratio. Stroke color is taken from `color` and line width is fixed at 2. This function draws directly to the provided 2D rendering context and returns nothing.
 */
function drawFibonacciCurve(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = { x: w * 0.75, y: h * 0.3 };
  const scale = Math.min(w, h) / NUM.NINETYNINE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const theta = i * (Math.PI / NUM.SEVEN);
    const radius = scale * Math.pow(phi, i / NUM.NINE);
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

/**
 * Draws a static double-helix lattice with crossbars across the canvas.
 *
 * Renders two sine-based helix strands (phase-shifted by π) and a series of vertical
 * crossbars connecting the strands. Uses NUM constants to determine step/count,
 * amplitude, midline, line width and rhythmic factors (e.g., NUM.ONEFORTYFOUR for
 * vertical resolution and NUM.TWENTYTWO for crossbar count). The function strokes
 * directly to the provided 2D rendering context and does not return a value.
 *
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 * @param {string} color - Stroke color used for strands and crossbars.
 * @param {object} NUM - Numerology constants object (expects properties like ONEFORTYFOUR, NINE, TWENTYTWO, SEVEN, ELEVEN).
 */
function drawHelixLattice(ctx, w, h, color, NUM) {
  const steps = NUM.ONEFORTYFOUR; // 144 vertical steps honour completion cycles
  const amplitude = h / NUM.NINE;
  const midline = h / 2;
  const baseLine = Math.max(1, Math.round(Math.min(w, h) / NUM.ONEFORTYFOUR));
  ctx.strokeStyle = color;
  ctx.lineWidth = baseLine; // ND-safe: fine lines keep lattice subtle

  const waveFactor = NUM.TWENTYTWO / NUM.SEVEN; // 22/7 approximates pi for gentle rhythm
  const phaseDivider = NUM.ELEVEN / NUM.SEVEN; // balances helix pitch with 11:7 proportion

  drawHelixStrand(ctx, w, steps, midline, amplitude, waveFactor, phaseDivider, 0);
  drawHelixStrand(ctx, w, steps, midline, amplitude, waveFactor, phaseDivider, Math.PI);

  const crossbars = NUM.TWENTYTWO;
  for (let j = 0; j < crossbars; j++) {
    const t = crossbars > 1 ? j / (crossbars - 1) : 0;
    const x = t * w;
    const angle = t * Math.PI * waveFactor;
    const y1 = midline + amplitude * Math.sin(angle / phaseDivider);
    const y2 = midline + amplitude * Math.sin(angle / phaseDivider + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

/**
 * Draws a single sine-wave helix strand across the canvas width and strokes it.
 *
 * Renders a smooth polyline computed from a sinusoid and immediately strokes the path
 * on the provided 2D canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context (not documented as a service).
 * @param {number} w - Horizontal span (canvas width) over which the strand is drawn.
 * @param {number} steps - Number of discrete segments/samples along the strand (higher => smoother).
 * @param {number} midline - Vertical centerline (y coordinate) around which the strand oscillates.
 * @param {number} amplitude - Peak vertical displacement from the midline.
 * @param {number} waveFactor - Multiplier controlling total angular span (affects how many wave cycles appear across the width).
 * @param {number} phaseDivider - Divisor applied to the angle before the phase shift (tunes the wavelength).
 * @param {number} phase - Phase offset in radians applied to the sine function.
 */
function drawHelixStrand(ctx, w, steps, midline, amplitude, waveFactor, phaseDivider, phase) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const angle = (i / steps) * Math.PI * waveFactor;
    const y = midline + amplitude * Math.sin(angle / phaseDivider + phase);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

/**
 * Draws a low-contrast fallback notice when a palette data file isn't available.
 *
 * Renders a short, semi-transparent single-line message in the canvas top-left
 * corner so the notice is visible but unobtrusive.
 *
 * @param {number} w - Canvas width (used to position the text at 5% from left).
 * @param {number} h - Canvas height (used to position the text at 5% from top).
 * @param {string} [inkColor="#e8e8f0"] - CSS color used for the text; defaults to a light ink.
 */
function drawPaletteFallbackNotice(ctx, w, h, inkColor) {
  ctx.save();
  ctx.fillStyle = inkColor || "#e8e8f0";
  ctx.globalAlpha = 0.66; // ND-safe: soft reminder, no harsh contrast
  ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Palette defaults active (data file not found).", w * 0.05, h * 0.05);
  ctx.restore();
}

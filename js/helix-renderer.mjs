/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)

  Rationale:
    - No motion or autoplay; draws once in calm order.
    - Gentle contrast palette avoids overstimulation.
    - Small pure functions with explicit numerology.
*/

export function renderHelix(ctx, opts){
  const {width, height, palette, NUM} = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], NUM);
}

// Layer 1: Vesica field using 3x3 grid
function drawVesica(ctx, w, h, color, NUM){
  const cols = NUM.THREE;
  const rows = NUM.THREE;
  const r = Math.min(w, h) / NUM.NINE;
  ctx.strokeStyle = color;
  for(let j=0;j<rows;j++){
    for(let i=0;i<cols;i++){
      const cx = ((i+0.5)*w)/cols;
      const cy = ((j+0.5)*h)/rows;
      ctx.beginPath();
      ctx.arc(cx - r/2, cy, r, 0, Math.PI*2);
      ctx.arc(cx + r/2, cy, r, 0, Math.PI*2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold
function drawTreeOfLife(ctx, w, h, color, NUM){
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const nodes = [
    [0.5,0.05], [0.3,0.18], [0.7,0.18],
    [0.3,0.35], [0.7,0.35], [0.5,0.5],
    [0.3,0.65], [0.7,0.65], [0.5,0.8], [0.5,0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[3,6],[4,7],
    [5,6],[5,7],[6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[1,5],[2,5],
    [0,5],[5,9]
  ]; // 22 paths honoring NUM.TWENTYTWO
  paths.forEach(([a,b])=>{
    const A = nodes[a];
    const B = nodes[b];
    ctx.beginPath();
    ctx.moveTo(A[0]*w, A[1]*h);
    ctx.lineTo(B[0]*w, B[1]*h);
    ctx.stroke();
  });
  const r = NUM.NINE; // calm node radius
  nodes.forEach(([x,y])=>{
    ctx.beginPath();
    ctx.arc(x*w, y*h, r, 0, Math.PI*2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
function drawFibonacciCurve(ctx, w, h, color, NUM){
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = {x:w*0.75, y:h*0.3};
  ctx.strokeStyle = color;
  ctx.beginPath();
  for(let i=0;i<=NUM.THIRTYTHREE;i++){
    const theta = i*(Math.PI/NUM.SEVEN);
    const r = Math.pow(phi, theta);
    const x = center.x + r*Math.cos(theta);
    const y = center.y + r*Math.sin(theta);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelixLattice(ctx, w, h, color, NUM){
  const steps = NUM.ONEFORTYFOUR;
  const amp = h/NUM.NINE;
  const mid = h/2;
  ctx.strokeStyle = color;
  for(let i=0;i<=steps;i++){
    const x = (i/steps)*w;
    const y1 = mid + amp*Math.sin(i/NUM.ELEVEN);
    const y2 = mid + amp*Math.sin(i/NUM.ELEVEN + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

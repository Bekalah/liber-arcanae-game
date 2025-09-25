// Tests for helix renderer:
// Framework: Node's built-in test runner (node:test) with assert.
// If your repo uses Vitest or Jest, replace the imports below with:
//   Vitest: import { describe, it, expect, beforeEach, afterEach } from 'vitest';
//           and replace assert.* with expect equivalents.
//   Jest:   import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
//           and replace assert.* with expect equivalents.

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

// Resolve source under test:
// Update the import path below to your actual module path if it differs.

let renderHelix;
try {
  // Try common paths; adjust as needed.
  ({ renderHelix } = await import('../src/helix-renderer.mjs').catch(() => ({ renderHelix: undefined })));
  if (!renderHelix) {
    ({ renderHelix } = await import('../src/helix-renderer.js').catch(() => ({ renderHelix: undefined })));
  }
  if (!renderHelix) {
    ({ renderHelix } = await import('../helix-renderer.mjs').catch(() => ({ renderHelix: undefined })));
  }
  if (!renderHelix) {
    ({ renderHelix } = await import('../helix-renderer.js').catch(() => ({ renderHelix: undefined })));
  }
  if (!renderHelix) {
    ({ renderHelix } = await import('../lib/helix-renderer.mjs').catch(() => ({ renderHelix: undefined })));
  }
  if (!renderHelix) {
    ({ renderHelix } = await import('../lib/helix-renderer.js').catch(() => ({ renderHelix: undefined })));
  }
} catch (e) {
  // Will fail below with an explicit error if not found
}

function createMockCtx() {
  const events = [];
  const state = {
    strokeStyle: undefined,
    fillStyle: undefined,
    lineWidth: undefined,
    globalAlpha: undefined,
    font: undefined,
    textAlign: undefined,
    textBaseline: undefined,
  };

  const ctx = {
    // methods
    clearRect: (x, y, w, h) => events.push({ type: 'clearRect', x, y, w, h, snapshot: { ...state } }),
    fillRect: (x, y, w, h) => events.push({ type: 'fillRect', x, y, w, h, snapshot: { ...state } }),
    beginPath: () => events.push({ type: 'beginPath', snapshot: { ...state } }),
    arc: (cx, cy, r, a0, a1) => events.push({ type: 'arc', cx, cy, r, a0, a1, snapshot: { ...state } }),
    moveTo: (x, y) => events.push({ type: 'moveTo', x, y, snapshot: { ...state } }),
    lineTo: (x, y) => events.push({ type: 'lineTo', x, y, snapshot: { ...state } }),
    stroke: () => events.push({ type: 'stroke', snapshot: { ...state } }),
    fill: () => events.push({ type: 'fill', snapshot: { ...state } }),
    save: () => events.push({ type: 'save', snapshot: { ...state } }),
    restore: () => events.push({ type: 'restore', snapshot: { ...state } }),
    fillText: (text, x, y) => events.push({ type: 'fillText', text, x, y, snapshot: { ...state } }),
    // property setters (tracked)
  };

  for (const prop of ['strokeStyle','fillStyle','lineWidth','globalAlpha','font','textAlign','textBaseline']) {
    Object.defineProperty(ctx, prop, {
      get() { return state[prop]; },
      set(v) {
        state[prop] = v;
        events.push({ type: `set:${prop}`, value: v, snapshot: { ...state } });
      },
      enumerable: true,
      configurable: true,
    });
  }

  return { ctx, events, state };
}

const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
};

describe('renderHelix - module and basic behavior', () => {
  it('should export renderHelix', () => {
    assert.ok(renderHelix, 'renderHelix export not found. Update import path near top of test file.');
    assert.equal(typeof renderHelix, 'function');
  });

  it('returns early without crashing when ctx is falsy', () => {
    assert.doesNotThrow(() => renderHelix(null, { width: 10, height: 10, palette: {}, NUM: DEFAULT_NUM, paletteLoaded: true }));
    assert.doesNotThrow(() => renderHelix(undefined, { width: 10, height: 10, palette: {}, NUM: DEFAULT_NUM, paletteLoaded: false }));
  });
});

describe('renderHelix - background and ND-safe sequence', () => {
  let warnSpy;
  let origWarn;

  beforeEach(() => {
    origWarn = console.warn;
    warnSpy = [];
    console.warn = (...args) => { warnSpy.push(args); };
  });

  afterEach(() => {
    console.warn = origWarn;
  });

  it('clears then fills background with default colors when palette is missing', () => {
    const { ctx, events } = createMockCtx();
    renderHelix(ctx, { width: 200, height: 100, NUM: DEFAULT_NUM, paletteLoaded: true });
    // Expect clearRect then set fillStyle then fillRect
    const clearIdx = events.findIndex(e => e.type === 'clearRect');
    const setFillStyleIdx = events.findIndex(e => e.type === 'set:fillStyle' && e.value === '#0b0b12');
    const fillRectIdx = events.findIndex(e => e.type === 'fillRect' && e.w === 200 && e.h === 100);
    assert.ok(clearIdx !== -1, 'clearRect not called');
    assert.ok(setFillStyleIdx !== -1, 'fillStyle for background not set to default #0b0b12');
    assert.ok(fillRectIdx !== -1, 'fillRect for background not called');
    assert.ok(clearIdx < setFillStyleIdx && setFillStyleIdx < fillRectIdx, 'background fill order incorrect');
  });

  it('uses provided palette.bg and palette.ink when present', () => {
    const { ctx, events } = createMockCtx();
    const palette = { bg: '#111122', ink: '#eeeeff', layers: [] };
    renderHelix(ctx, { width: 120, height: 80, palette, NUM: DEFAULT_NUM, paletteLoaded: true });
    const bgSet = events.find(e => e.type === 'set:fillStyle' && e.value === '#111122');
    assert.ok(bgSet, 'did not use provided palette.bg for background');
    // Colors padded with ink for 4 layers => first four strokeStyle sets should be ink
    const strokeSets = events.filter(e => e.type === 'set:strokeStyle').slice(0, 4).map(e => e.value);
    assert.equal(strokeSets.length, 4, 'expected 4 strokeStyle assignments for 4 layers');
    for (const v of strokeSets) {
      assert.equal(v, '#eeeeff', 'expected padded layer color to use palette.ink');
    }
  });

  it('pads colors[] to length 4 with ink when layers has fewer than 4 entries', () => {
    const { ctx, events } = createMockCtx();
    const palette = { bg: '#101010', ink: '#222222', layers: ['L0','L1'] };
    renderHelix(ctx, { width: 160, height: 90, palette, NUM: DEFAULT_NUM, paletteLoaded: true });
    const strokeSets = events.filter(e => e.type === 'set:strokeStyle').slice(0, 4).map(e => e.value);
    assert.deepEqual(strokeSets, ['L0','L1','#222222','#222222']);
  });

  it('emits a console.warn when NUM.TWENTYTWO mismatches internal path count', () => {
    const { ctx } = createMockCtx();
    const NUM = { ...DEFAULT_NUM, TWENTYTWO: 23 }; // mismatch expected
    renderHelix(ctx, { width: 200, height: 150, palette: { layers: [] }, NUM, paletteLoaded: true });
    const warned = warnSpy.some(args => String(args[0]).includes('Tree-of-Life path count expected'));
    assert.ok(warned, 'Expected a console.warn about path count mismatch');
  });
});

describe('renderHelix - layer ordering and line width behavior', () => {
  it('applies strokeStyle per layer in order: vesica, tree, fibonacci, helix', () => {
    const { ctx, events } = createMockCtx();
    const palette = { layers: ['A','B','C','D'], bg: '#000000', ink: '#ffffff' };
    renderHelix(ctx, { width: 144, height: 144, palette, NUM: DEFAULT_NUM, paletteLoaded: true });
    const strokeSets = events.filter(e => e.type === 'set:strokeStyle').slice(0, 4).map(e => e.value);
    assert.deepEqual(strokeSets, ['A','B','C','D'], 'Layer strokeStyle order mismatch');
  });

  it('sets lineWidth to 2 for vesica and fibonacci, and baseLine for tree and helix', () => {
    const { ctx, events } = createMockCtx();
    renderHelix(ctx, { width: 144, height: 144, palette: { layers: [] }, NUM: DEFAULT_NUM, paletteLoaded: true });
    const lwSets = events.filter(e => e.type === 'set:lineWidth').map(e => e.value);
    // Expect at least the sequence [2, 1, 2, 1] in order (others may not exist)
    // First 4 assignments should correspond to [vesica=2, tree=1, fibonacci=2, helix=1]
    assert.ok(lwSets.length >= 4, 'Expected at least 4 lineWidth assignments');
    assert.equal(lwSets[0], 2, 'Vesica lineWidth should be 2');
    assert.equal(lwSets[1], 1, 'Tree-of-Life baseLine should be 1 for 144x144 canvas');
    assert.equal(lwSets[2], 2, 'Fibonacci lineWidth should be 2');
    assert.equal(lwSets[3], 1, 'Helix lattice baseLine should be 1 for 144x144 canvas');
  });
});

describe('renderHelix - fallback notice when palette not loaded', () => {
  it('draws a soft fallback notice with correct styling and message when paletteLoaded=false', () => {
    const { ctx, events } = createMockCtx();
    const opts = { width: 200, height: 100, palette: { bg: '#111', ink: '#abcabc', layers: [] }, NUM: DEFAULT_NUM, paletteLoaded: false };
    renderHelix(ctx, opts);
    const saveIdx = events.findIndex(e => e.type === 'save');
    const textIdx = events.findIndex(e => e.type === 'fillText' && e.text.includes('Palette defaults active'));
    const restoreIdx = events.findIndex(e => e.type === 'restore');
    assert.ok(saveIdx !== -1 && textIdx !== -1 && restoreIdx !== -1, 'Expected save -> fillText -> restore sequence');

    const textEvt = events[textIdx];
    assert.equal(textEvt.x, 200 * 0.05);
    assert.equal(textEvt.y, 100 * 0.05);
    // Check that at time of fillText, styling was applied
    assert.equal(textEvt.snapshot.fillStyle, '#abcabc', 'Fallback text should use provided ink color');
    assert.equal(textEvt.snapshot.globalAlpha, 0.66);
    assert.equal(textEvt.snapshot.textAlign, 'left');
    assert.equal(textEvt.snapshot.textBaseline, 'top');

    assert.ok(saveIdx < textIdx && textIdx < restoreIdx, 'Fallback drawing sequence should be save -> fillText -> restore');
  });

  it('uses default ink when palette.ink is not provided', () => {
    const { ctx, events } = createMockCtx();
    renderHelix(ctx, { width: 100, height: 80, palette: { layers: [] }, NUM: DEFAULT_NUM, paletteLoaded: false });
    const textEvt = events.find(e => e.type === 'fillText');
    assert.ok(textEvt, 'Fallback text not drawn');
    assert.equal(textEvt.snapshot.fillStyle, '#e8e8f0', 'Expected default ink color when palette.ink missing');
  });
});

describe('renderHelix - robustness with zero dimensions', () => {
  it('does not throw when width or height is zero', () => {
    const { ctx } = createMockCtx();
    assert.doesNotThrow(() => renderHelix(ctx, { width: 0, height: 0, palette: { layers: [] }, NUM: DEFAULT_NUM, paletteLoaded: true }));
  });
});
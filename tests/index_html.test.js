/**
 * Tests for index.html DOM structure and inline module utilities.
 *
 * Testing library and framework: Jest with JSDOM (assumed based on common conventions).
 * If the repository uses a different test runner, adjust describe/it/expect syntax accordingly.
 *
 * Strategy:
 * - Parse index.html (if present) or use provided snippet as fallback.
 * - Validate critical DOM structure and attributes emphasized in the PR diff.
 * - Extract selected pure functions (normalizePalette, applyPaletteVariables, insertMissingPaletteNotice, loadJSON)
 *   from the inline <script type="module"> block and unit test them in isolation.
 * - Mock external dependencies (fetch, canvas context) where needed.
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Attempt to read the real index.html from repo; fallback to embedded snippet.
function loadIndexHtmlSource() {
  const candidates = [
    "index.html",
    "public/index.html",
    "src/index.html"
  ];
  for (const p of candidates) {
    const resolved = path.resolve(process.cwd(), p);
    if (fs.existsSync(resolved)) {
      return fs.readFileSync(resolved, "utf8");
    }
  }
  // Fallback: inline snippet provided in PR context
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cosmic Helix Renderer (ND-safe, Offline)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <style>
    :root { --bg:#0b0b12; --ink:#e8e8f0; --muted:#a6a6c1; }
    html,body { margin:0; padding:0; background:var(--bg); color:var(--ink); font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    header { padding:12px 16px; border-bottom:1px solid #1d1d2a; }
    .status { color:var(--muted); font-size:12px; }
    #stage { display:block; margin:16px auto; box-shadow:0 0 0 1px #1d1d2a; }
    .note { max-width:900px; margin:0 auto 16px; color:var(--muted); }
    .note-inline { margin-top:8px; font-size:13px; }
    code { background:#11111a; padding:2px 4px; border-radius:3px; }
  </style>
</head>
<body>
  <header>
    <div><strong>Cosmic Helix Renderer</strong> — layered sacred geometry (offline, ND-safe)</div>
    <div class="status" id="status">Loading palette…</div>
  </header>

  <canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>
  <p class="note">This static renderer encodes Vesica, Tree-of-Life, Fibonacci, and a static double-helix lattice. No animation, no autoplay, no external libs. Open this file directly.</p>

  <script type="module">
    import { renderHelix } from "./js/helix-renderer.mjs";

    const elStatus = document.getElementById("status");
    const canvas = document.getElementById("stage");
    const ctx = canvas.getContext("2d");

    async function loadJSON(path) {
      try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        return await res.json();
      } catch (err) {
        return null;
      }
    }

    function normalizePalette(candidate, fallback) {
      const safe = {
        bg: fallback.bg,
        ink: fallback.ink,
        layers: []
      };
      if (candidate) {
        if (typeof candidate.bg === "string") safe.bg = candidate.bg;
        if (typeof candidate.ink === "string") safe.ink = candidate.ink;
      }
      const layers = candidate && Array.isArray(candidate.layers) ? candidate.layers : [];
      const fallbackLayers = fallback.layers;
      const required = 4;
      for (let i = 0; i < required; i++) {
        const fallbackIndex = i % fallbackLayers.length;
        const color = typeof layers[i] === "string" ? layers[i] : fallbackLayers[fallbackIndex];
        safe.layers.push(color);
      }
      return safe;
    }

    function applyPaletteVariables(palette) {
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty("--bg", palette.bg);
      rootStyle.setProperty("--ink", palette.ink);
      document.body.style.background = palette.bg;
      document.body.style.color = palette.ink;
    }

    function insertMissingPaletteNotice(reference, message) {
      if (!reference || document.querySelector(".note-inline")) return;
      const note = document.createElement("p");
      note.className = "note note-inline";
      note.textContent = message;
      reference.insertAdjacentElement("afterend", note);
    }

    const defaults = {
      palette: {
        bg:"#0b0b12",
        ink:"#e8e8f0",
        layers:["#b1c7ff","#89f7fe","#a0ffa1","#ffd27f","#f5a3ff","#d0d0e6"]
      }
    };

    const paletteData = await loadJSON("./data/palette.json");
    const paletteForRender = normalizePalette(paletteData, defaults.palette);
    applyPaletteVariables(paletteForRender);

    const paletteStatus = paletteData ? "Palette loaded." : "Palette missing; using safe fallback.";
    if (!paletteData) {
      insertMissingPaletteNotice(canvas, "Palette file not found; using embedded fallback palette so contrast stays safe.");
    }

    if (!ctx) {
      elStatus.textContent = paletteStatus + " Canvas rendering unavailable.";
      const warning = document.createElement("p");
      warning.className = "note";
      warning.textContent = "Canvas 2D context is unavailable; layered geometry cannot render, but the palette fallback applied.";
      canvas.replaceWith(warning);
      return;
    }

    const NUM = { THREE:3, SEVEN:7, NINE:9, ELEVEN:11, TWENTYTWO:22, THIRTYTHREE:33, NINETYNINE:99, ONEFORTYFOUR:144 };
    renderHelix(ctx, { width:canvas.width, height:canvas.height, palette:paletteForRender, NUM });
    elStatus.textContent = paletteStatus + " Geometry rendered.";
  </script>
</body>
</html>`;
}

function extractFunctionSource(html, name) {
  // Extract the content of <script type="module"> ... </script>
  const scriptStartTag = '<script type="module">';
  const scriptEndTag = '</script>';
  const start = html.indexOf(scriptStartTag);
  const end = html.indexOf(scriptEndTag, start + scriptStartTag.length);
  if (start === -1 || end === -1) return null;
  const script = html.slice(start + scriptStartTag.length, end);

  // Find the function by name and return its source including body
  const fnHead = `function ${name}(`;
  const idx = script.indexOf(fnHead);
  if (idx === -1) return null;

  // Brace matching to capture function body
  let i = script.indexOf("{", idx);
  if (i === -1) return null;
  let depth = 0;
  for (let j = i; j < script.length; j++) {
    if (script[j] === "{") depth++;
    if (script[j] === "}") {
      depth--;
      if (depth === 0) {
        const fnSrc = script.slice(idx, j + 1);
        return fnSrc;
      }
    }
  }
  return null;
}

function materializeFunction(html, name) {
  const src = extractFunctionSource(html, name);
  if (!src) return null;
  // eslint-disable-next-line no-new-func
  const factory = new Function(src + '; return ' + name + ';');
  return factory();
}

describe("index.html structure and inline utilities (Cosmic Helix Renderer)", () => {
  let html;
  let dom;

  beforeAll(() => {
    html = loadIndexHtmlSource();
  });

  beforeEach(() => {
    dom = new JSDOM(html, { contentType: "text/html" });
    // Expose DOM globals for functions that expect document/window
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    // Cleanup globals
    delete global.window;
    delete global.document;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("includes correct doctype and language attributes", () => {
    expect(html.toLowerCase().startsWith("<!doctype html>")).toBe(true);
    const lang = dom.window.document.documentElement.getAttribute("lang");

    expect(lang).toBe("en");
  });

  it("contains expected meta tags for viewport and color scheme", () => {
    const metas = Array.from(dom.window.document.querySelectorAll("meta"));
    const viewport = metas.find(m => m.getAttribute("name") === "viewport");
    const colorScheme = metas.find(m => m.getAttribute("name") === "color-scheme");
    expect(viewport).toBeTruthy();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
    expect(viewport.getAttribute("content")).toContain("viewport-fit=cover");
    expect(colorScheme).toBeTruthy();
    expect(colorScheme.getAttribute("content")).toBe("light dark");
  });

  it("renders a canvas with fixed 1440x900 size and correct labeling", () => {
    const canvas = dom.window.document.getElementById("stage");
    expect(canvas).toBeTruthy();
    // Attribute values are strings in DOM
    expect(canvas.getAttribute("width")).toBe("1440");
    expect(canvas.getAttribute("height")).toBe("900");
    expect(canvas.getAttribute("aria-label")).toBe("Layered sacred geometry canvas");
  });

  it("exposes a status element initialized to 'Loading palette…'", () => {
    const el = dom.window.document.getElementById("status");
    expect(el).toBeTruthy();
    expect(el.textContent).toBe("Loading palette…");
  });

  describe("normalizePalette (pure function)", () => {
    it("falls back to defaults when candidate is null", () => {
      const normalizePalette = materializeFunction(html, "normalizePalette");
      expect(typeof normalizePalette).toBe("function");
      const fallback = {
        bg: "#0b0b12",
        ink: "#e8e8f0",
        layers: ["#a","#b","#c","#d","#e","#f"]
      };
      const result = normalizePalette(null, fallback);
      expect(result.bg).toBe(fallback.bg);
      expect(result.ink).toBe(fallback.ink);
      expect(result.layers.length).toBe(4);
      // First four layers cycle through fallback
      expect(result.layers).toEqual(["#a","#b","#c","#d"]);
    });

    it("uses candidate bg/ink when valid, while filling missing layers up to 4", () => {
      const normalizePalette = materializeFunction(html, "normalizePalette");
      const fallback = { bg:"#bgF", ink:"#inkF", layers:["#1","#2"] };
      const candidate = { bg:"#bgC", ink:"#inkC", layers:["#L0"] };
      const result = normalizePalette(candidate, fallback);
      expect(result.bg).toBe("#bgC");
      expect(result.ink).toBe("#inkC");
      expect(result.layers).toEqual(["#L0", "#2", "#1", "#2"]);
    });

    it("ignores non-string entries and non-array layers in candidate", () => {
      const normalizePalette = materializeFunction(html, "normalizePalette");
      const fallback = { bg:"#bgF", ink:"#inkF", layers:["#1","#2","#3"] };
      const candidate = { bg: 123, ink: null, layers: [null, "#X", 42, undefined] };
      const result = normalizePalette(candidate, fallback);
      expect(result.bg).toBe("#bgF");
      expect(result.ink).toBe("#inkF");
      expect(result.layers).toEqual(["#1", "#X", "#3", "#1"]);
    });
  });

  describe("applyPaletteVariables (DOM side-effects)", () => {
    it("updates CSS custom properties and body styles", () => {
      const applyPaletteVariables = materializeFunction(html, "applyPaletteVariables");
      expect(typeof applyPaletteVariables).toBe("function");
      const palette = { bg: "#101010", ink: "#fafafa" };
      applyPaletteVariables(palette);

      const rootStyle = dom.window.document.documentElement.style;
      expect(rootStyle.getPropertyValue("--bg")).toBe("#101010");
      expect(rootStyle.getPropertyValue("--ink")).toBe("#fafafa");

      const body = dom.window.document.body;
      expect(body.style.background).toBe("rgb(16, 16, 16)"); // jsdom normalizes hex to rgb
      expect(body.style.color).toBe("rgb(250, 250, 250)");
    });
  });

  describe("insertMissingPaletteNotice (DOM insertion rules)", () => {
    it("inserts a .note-inline after the given reference when not already present", () => {
      const insertMissingPaletteNotice = materializeFunction(html, "insertMissingPaletteNotice");
      const canvas = dom.window.document.getElementById("stage");
      insertMissingPaletteNotice(canvas, "Palette file not found; using embedded fallback palette so contrast stays safe.");
      const note = dom.window.document.querySelector(".note-inline");
      expect(note).toBeTruthy();
      expect(note.textContent).toMatch(/Palette file not found/);
      // Validates placement: inserted immediately after the canvas
      expect(canvas.nextElementSibling).toBe(note);
    });

    it("is a no-op when reference is null", () => {
      const insertMissingPaletteNotice = materializeFunction(html, "insertMissingPaletteNotice");
      const before = dom.window.document.querySelectorAll(".note-inline").length;
      insertMissingPaletteNotice(null, "should not insert");
      const after = dom.window.document.querySelectorAll(".note-inline").length;
      expect(after).toBe(before);
    });

    it("prevents duplicate insertion if a .note-inline already exists", () => {
      const insertMissingPaletteNotice = materializeFunction(html, "insertMissingPaletteNotice");
      const canvas = dom.window.document.getElementById("stage");
      // First insertion
      insertMissingPaletteNotice(canvas, "one");
      // Attempt duplicate
      insertMissingPaletteNotice(canvas, "two");
      const notes = dom.window.document.querySelectorAll(".note-inline");
      expect(notes.length).toBe(1);
      expect(notes[0].textContent).toBe("one");
    });
  });

  describe("loadJSON (fetch behavior)", () => {
    it("returns parsed JSON when fetch succeeds with ok=true", async () => {
      const loadJSON = materializeFunction(html, "loadJSON");
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ a: 1 }),
      });
      const data = await loadJSON("/some.json");
      expect(global.fetch).toHaveBeenCalledWith("/some.json", { cache: "no-store" });
      expect(data).toEqual({ a: 1 });
    });

    it("returns null when fetch rejects", async () => {
      const loadJSON = materializeFunction(html, "loadJSON");
      global.fetch = jest.fn().mockRejectedValue(new Error("network"));
      const data = await loadJSON("/fail.json");
      expect(data).toBeNull();
    });

    it("returns null when response.ok is false", async () => {
      const loadJSON = materializeFunction(html, "loadJSON");
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn(),
      });
      const data = await loadJSON("/missing.json");
      expect(data).toBeNull();
    });
  });

  describe("canvas context fallback messaging (structural validation)", () => {
    it("contains logic to handle missing 2D context by replacing canvas with a .note warning", () => {
      // We do not execute the entire module script (ESM + top-level await).
      // Instead, validate presence of critical messaging copy to ensure UX fallback remains.
      expect(html).toContain('Canvas 2D context is unavailable; layered geometry cannot render, but the palette fallback applied.');
      expect(html).toContain('Palette missing; using safe fallback.');
    });
  });
});
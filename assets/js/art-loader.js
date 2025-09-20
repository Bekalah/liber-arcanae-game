// art-loader.js
// ND-safe art mount: fetch manifest without caching, attach WEBP hero only.
export async function mountArt(targetId = "hero-art") {
  const mount = document.getElementById(targetId);
  if (!mount) return;
  try {
    const res = await fetch("/assets/art/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("manifest fetch failed");
    const manifest = await res.json();
    const hero = manifest.hero;
    if (!hero || !hero.src) {
      mount.textContent = "Art manifest missing hero entry.";
      return;
    }
    const img = new Image();
    img.loading = "eager";
    img.decoding = "async";
    img.src = hero.src;
    img.alt = hero.alt || "";
    mount.innerHTML = "";
    mount.append(img);
  } catch (err) {
    mount.textContent = "Art manifest unavailable. Canvas fallback active.";
  }
}

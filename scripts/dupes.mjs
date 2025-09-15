// Perceptual duplicate finder: flags near-identical originals
// ND-safe: console hints only, no deletion
import fs from 'fs/promises';
import path from 'path';
import imghash from 'imghash';

const originals = path.join(process.cwd(), 'assets', 'originals');
const files = (await fs.readdir(originals)).filter(f => /\.(png|jpe?g|tif|webp|avif)$/i.test(f));

const hashes = [];
for (const f of files) {
  const h = await imghash.hash(path.join(originals, f));
  hashes.push({ f, h });
}

// sort by hash for easy neighborhood checks
hashes.sort((a, b) => a.h.localeCompare(b.h));

const distance = (a, b) => {
  let d = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) d++;
  return d + Math.abs(a.length - b.length);
};

for (let i = 1; i < hashes.length; i++) {
  const A = hashes[i-1], B = hashes[i];
  const d = distance(A.h, B.h);
  if (d <= 4) console.log('possible-dupe:', A.f, '<→>', B.f, 'hamming≈', d);
}

// Local image optimizer: AVIF/WEBP/JPEG + catalog writer
// ND-safe: no flashing, run manually offline
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import imghash from 'imghash';

const root = process.cwd();
const originalsDir = path.join(root, 'assets', 'originals');
const outDir = path.join(root, 'assets', 'img');
await fs.mkdir(outDir, { recursive: true });

const entries = [];
const files = (await fs.readdir(originalsDir)).filter(f => /\.(png|jpe?g|tif|webp|avif)$/i.test(f));

for (const file of files) {
  const inPath = path.join(originalsDir, file);
  const base = file.replace(/\.[^.]+$/, '');

  const img = sharp(inPath).rotate();         // auto-orient
  const meta = await img.metadata();          // probe (width/height)
  const targets = [1280, 1920];

  for (const w of targets) {
    await img.resize({ width: w }).avif({ quality: 55 }).toFile(path.join(outDir, `${base}-${w}.avif`));
    await img.resize({ width: w }).webp({ quality: 72 }).toFile(path.join(outDir, `${base}-${w}.webp`));
  }
  await img.resize({ width: 1280 }).jpeg({ quality: 72, mozjpeg: true }).toFile(path.join(outDir, `${base}-1280.jpg`));

  const phash = await imghash.hash(inPath);   // perceptual hash (similarity)
  entries.push({
    id: base,
    original: `assets/originals/${file}`,
    variants: {
      avif: targets.map(w => `assets/img/${base}-${w}.avif`),
      webp: targets.map(w => `assets/img/${base}-${w}.webp`),
      jpg:  `assets/img/${base}-1280.jpg`
    },
    width: meta.width, height: meta.height, phash
  });
}

await fs.writeFile(path.join(root, 'assets', 'ASSET_CATALOG.json'), JSON.stringify(entries, null, 2));
console.log(`Optimized ${files.length} image(s). Catalog written.`);

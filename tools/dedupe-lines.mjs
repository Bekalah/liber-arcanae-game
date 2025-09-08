import { promises as fs } from 'fs';
import path from 'path';

/*
  dedupe-lines.mjs
  Removes consecutive duplicate lines in text files.
  Supports offline, small-memory workflows.

  Usage: node tools/dedupe-lines.mjs [directory]
  Defaults to repository root when no directory given.
*/

const TEXT_EXTS = new Set(['.js', '.mjs', '.json', '.md', '.html', '.css', '.txt']);

async function walk(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of dirents) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '.git') continue; // skip VCS data
      await walk(full);
    } else if (TEXT_EXTS.has(path.extname(ent.name))) {
      await dedupeFile(full);
    }
  }
}

async function dedupeFile(file) {
  const data = await fs.readFile(file, 'utf8');
  const lines = data.split('\n');
  const cleaned = lines.filter((line, i) => i === 0 || line !== lines[i - 1]);
  const output = cleaned.join('\n');
  if (output !== data) {
    await fs.writeFile(file, output, 'utf8');
    console.log('deduped', file);
  }
}

const target = process.argv[2] || '.';
walk(target).catch(err => {
  console.error(err);
  process.exit(1);
});

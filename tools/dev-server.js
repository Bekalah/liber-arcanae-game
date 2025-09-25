// Simple static server exposing parent directory so sibling repos resolve via ../repo paths.
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..'); // parent directory

const server = http.createServer(async (req, res) => {
  const reqPath = path.normalize(decodeURI(req.url.split('?')[0]));
  let filePath = path.join(root, reqPath);
  // Validate that the file path is inside the root directory
  const absPath = path.resolve(filePath);
  if (!absPath.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const info = await stat(absPath);
    if (info.isDirectory()) absPath = path.join(absPath, 'index.html');
    const data = await readFile(absPath);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8080, () => {
  console.log('Dev server at http://localhost:8080');
});

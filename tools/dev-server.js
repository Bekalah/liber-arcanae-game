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
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
    const data = await readFile(filePath);
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

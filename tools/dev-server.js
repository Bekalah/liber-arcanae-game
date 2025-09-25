// Simple static server exposing parent directory so sibling repos resolve via ../repo paths.
import http from 'node:http';
import {readFile, stat, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..'); // parent directory
let rootRealPathPromise = realpath(root);

const server = http.createServer(async (req, res) => {
  const reqPath = path.normalize(decodeURI(req.url.split('?')[0]));
  let filePath = path.join(root, reqPath);
  try {
    const rootRealPath = await rootRealPathPromise;
    // Resolve the real path of the requested file
    let absPath = await realpath(path.resolve(filePath));
    // Check if the path is within the rootRealPath
    if (!(absPath === rootRealPath || absPath.startsWith(rootRealPath + path.sep))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
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

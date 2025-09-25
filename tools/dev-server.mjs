/*
  dev-server.js
  Minimal static server to expose sibling repos for local testing.
  Usage: node tools/dev-server.js [rootDir]
  Serves directories so fetch("../repo/file") works on iPad Safari.
*/

import http from "http";
import {promises as fs} from "fs";
import {resolve, join} from "path";

const root = resolve(process.argv[2] || "..");
const types = {
  ".html":"text/html",
  ".js":"text/javascript",
  ".mjs":"text/javascript",
  ".json":"application/json",
  ".css":"text/css",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".svg":"image/svg+xml"
};

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = resolve(root, "." + urlPath); // prepend '.' to prevent absolute paths
  if (!filePath.startsWith(root)) { // path traversal detected
    res.writeHead(403, {"Content-Type": "text/plain"});
    res.end("Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    const ext = filePath.substring(filePath.lastIndexOf("."));
    res.writeHead(200, {"Content-Type": types[ext] || "application/octet-stream"});
    res.end(data);
  } catch (err) {
    res.writeHead(404, {"Content-Type":"text/plain"});
    res.end("Not found");
  }
});

const port = 8000;
server.listen(port, () => console.log(`Serving ${root} at http://localhost:${port}/`));

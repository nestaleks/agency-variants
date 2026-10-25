// Zero-dependency static server for the repo root (design concepts gallery).
// Usage: node tools/serve.js [port]   →   http://localhost:8080/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) {
      if (!rel.endsWith('/')) { res.writeHead(301, { Location: rel + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    fs.readFile(file, (e, buf) => {
      if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found: ' + rel); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}/`));

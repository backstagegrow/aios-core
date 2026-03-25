const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const PORT = 3000;

const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.pdf':  'application/pdf',
};

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? '/index.html' : req.url);
  // default index listing
  if (req.url === '/') {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
    const links = files.map(f => `<li><a href="/${f}">${f}</a></li>`).join('');
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:32px;background:#0a0a0a;color:#fff">
      <h2 style="color:#84CC16">BKS Grow — Presentations</h2><ul style="line-height:2.2">${links}</ul></body></html>`);
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, {'Content-Type': mime[ext] || 'text/plain'});
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

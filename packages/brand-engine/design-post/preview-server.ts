/**
 * preview-server.ts — Servidor de preview para posts gerados
 *
 * Serve arquivos gerados em .aios/design-post-output/ via HTTP simples.
 * Permite revisar copy e design spec antes de deploy.
 *
 * Usage:
 *   node --loader ts-node/esm preview-server.ts
 *   node --loader ts-node/esm preview-server.ts --port 4001
 *   node --loader ts-node/esm preview-server.ts --watch  # recarrega ao gerar novo post
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../../../.aios/design-post-output');

// ─── HTML renderer ────────────────────────────────────────────────────────────

function renderPostCard(filename: string, data: Record<string, unknown>): string {
    const spec = data.spec as Record<string, unknown> | undefined;
    const copy = data.copy as string | undefined;
    const image = data.image_url as string | undefined;

    return `
<div class="card">
  <div class="card-header">
    <strong>${filename.replace('.json', '')}</strong>
    <span class="format">${(spec?.format as string) || (data as Record<string, unknown>)?.briefing && ((data as Record<string, unknown>).briefing as Record<string, unknown>)?.format || '\u2014'}</span>
  </div>
  ${image ? `<img src="${image}" alt="Generated post" style="max-width:100%;border-radius:8px;margin:8px 0">` : ''}
  ${copy ? `<div class="copy-section"><h4>Copy</h4><div class="copy">${copy.replace(/\n/g, '<br>')}</div></div>` : ''}
  ${spec ? `<div class="spec-section"><h4>Design Spec</h4><pre>${JSON.stringify(spec, null, 2)}</pre></div>` : ''}
</div>`;
}

function renderIndex(files: string[]): string {
    const cards = files.map(f => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf-8'));
            return renderPostCard(f, data);
        } catch {
            return `<div class="card error">${f} \u2014 parse error</div>`;
        }
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Design Post Preview</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, sans-serif; background: #0a0a0a; color: #e4e4e7; padding: 24px; }
    h1 { margin-bottom: 24px; font-size: 1.5rem; color: #84CC16; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .format { background: #84CC16; color: #000; font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
    .copy-section, .spec-section { margin-top: 12px; }
    .copy-section h4, .spec-section h4 { font-size: 0.75rem; color: #84CC16; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
    .copy { background: #111; border-left: 3px solid #84CC16; padding: 12px; font-size: 0.9rem; line-height: 1.6; border-radius: 0 6px 6px 0; }
    pre { background: #111; padding: 12px; border-radius: 8px; font-size: 0.75rem; overflow-x: auto; color: #a1a1aa; }
    .error { border-color: #ef4444; color: #ef4444; }
    .empty { text-align: center; padding: 60px; color: #52525b; }
    .refresh { position: fixed; bottom: 20px; right: 20px; background: #84CC16; color: #000; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>Design Post Preview \u2014 ${files.length} post(s)</h1>
  ${files.length === 0
        ? '<div class="empty">No posts generated yet.<br>Run: node design-post-commands.js generate --brand "Brand" --headline "Txt"</div>'
        : `<div class="grid">${cards}</div>`}
  <button class="refresh" onclick="location.reload()">Refresh</button>
</body>
</html>`;
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

export function startPreviewServer(port = 4000): http.Server {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const server = http.createServer((req, res) => {
        const url = req.url || '/';

        // Serve individual JSON
        if (url.startsWith('/posts/') && url.endsWith('.json')) {
            const filename = path.basename(url);
            const filePath = path.join(OUTPUT_DIR, filename);
            if (fs.existsSync(filePath)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(fs.readFileSync(filePath));
                return;
            }
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        // API: list posts
        if (url === '/api/posts') {
            const files = fs.existsSync(OUTPUT_DIR)
                ? fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json')).sort().reverse()
                : [];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(files));
            return;
        }

        // Index page
        const files = fs.existsSync(OUTPUT_DIR)
            ? fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json')).sort().reverse()
            : [];
        const html = renderIndex(files);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    });

    server.listen(port, () => {
        console.log(`[preview-server] Running at http://localhost:${port}`);
        console.log(`[preview-server] Watching: ${OUTPUT_DIR}`);
    });

    return server;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const portArg = args[args.indexOf('--port') + 1];
    const port = portArg ? parseInt(portArg, 10) : 4000;
    startPreviewServer(port);
}

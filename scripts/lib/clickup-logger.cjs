/**
 * clickup-logger.cjs — Audit log de operações do AIOS no ClickUp
 *
 * Grava em .aios/logs/clickup.log cada operação executada via scripts.
 * Formato: JSON Lines (uma entrada por linha) — fácil de parsear e greppear.
 *
 * Uso:
 *   const { log, logError } = require('./lib/clickup-logger.cjs');
 *
 *   log('task.created', { listId: '901324517019', taskId: 'abc123', name: '[Agent] Reels GT House' });
 *   logError('task.created', { listId: '901324517019', error: 'List not found' });
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(__dirname, '..', '..', '.aios', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'clickup.log');

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

/**
 * Grava uma entrada de sucesso no log.
 * @param {string} operation - ex: 'task.created', 'doc.page.edited', 'checklist.added'
 * @param {object} details - dados relevantes da operação
 */
function log(operation, details = {}) {
    ensureLogDir();
    const entry = {
        ts: new Date().toISOString(),
        level: 'INFO',
        op: operation,
        ...details,
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8');
}

/**
 * Grava uma entrada de erro no log.
 * @param {string} operation
 * @param {object} details
 */
function logError(operation, details = {}) {
    ensureLogDir();
    const entry = {
        ts: new Date().toISOString(),
        level: 'ERROR',
        op: operation,
        ...details,
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8');
    // Também imprime no stderr para visibilidade imediata
    console.error(`[AIOS Log ERROR] ${operation}:`, details.error || details);
}

/**
 * Lê as últimas N entradas do log.
 * @param {number} n
 */
function tail(n = 20) {
    ensureLogDir();
    if (!fs.existsSync(LOG_FILE)) { console.log('Log vazio.'); return; }
    const lines = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n');
    const last = lines.slice(-n);
    console.log(`\n📋 Últimas ${last.length} operações AIOS (clickup.log)\n`);
    for (const line of last) {
        try {
            const e = JSON.parse(line);
            const icon = e.level === 'ERROR' ? '❌' : '✅';
            const details = Object.entries(e)
                .filter(([k]) => !['ts', 'level', 'op'].includes(k))
                .map(([k, v]) => `${k}=${v}`)
                .join(' | ');
            console.log(`  ${icon} [${e.ts.slice(0, 19)}] ${e.op} — ${details}`);
        } catch {
            console.log(`  ${line}`);
        }
    }
}

module.exports = { log, logError, tail };

/**
 * throttle.cjs — Rate limiting utilities para scripts AIOS
 *
 * Uso:
 *   const { sleep, withRetry } = require('./lib/throttle.cjs');
 *
 *   await sleep(200);  // delay de 200ms
 *   const result = await withRetry(() => clickupRequest(...), 3, 500);
 */

/**
 * Aguarda N milissegundos.
 * @param {number} ms
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Executa uma função com retry automático em caso de erro.
 * Útil para lidar com 429 (rate limit) e falhas transitórias.
 *
 * @param {() => Promise<any>} fn - Função async a executar
 * @param {number} maxAttempts - Número máximo de tentativas (default: 3)
 * @param {number} delayMs - Delay entre tentativas em ms (default: 1000)
 * @returns {Promise<any>}
 */
async function withRetry(fn, maxAttempts = 3, delayMs = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            const isRateLimit = err?.status === 429;
            const waitMs = isRateLimit ? delayMs * attempt * 2 : delayMs * attempt;
            if (attempt < maxAttempts) {
                console.warn(`  ⚠️  Tentativa ${attempt}/${maxAttempts} falhou${isRateLimit ? ' (rate limit)' : ''} — aguardando ${waitMs}ms...`);
                await sleep(waitMs);
            }
        }
    }
    throw lastError;
}

module.exports = { sleep, withRetry };

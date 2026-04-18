/**
 * cli-args.cjs — Parser centralizado de argumentos CLI para scripts AIOS
 *
 * Uso:
 *   const { parseArgs, requireArgs } = require('./lib/cli-args.cjs');
 *
 *   const args = parseArgs();
 *   requireArgs(args, ['list', 'name']); // exit(1) se faltar algum
 */

/**
 * Parseia process.argv no formato --key value ou --flag.
 * @param {string[]} [argv] - Array de args (default: process.argv.slice(2))
 * @returns {Record<string, string | boolean>}
 */
function parseArgs(argv = process.argv.slice(2)) {
    const result = {};
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('--')) {
            const key = argv[i].slice(2);
            const next = argv[i + 1];
            if (next && !next.startsWith('--')) {
                result[key] = next;
                i++;
            } else {
                result[key] = true;
            }
        }
    }
    return result;
}

/**
 * Valida que os args obrigatórios estão presentes.
 * Se algum estiver faltando, imprime uso e encerra o processo.
 *
 * @param {Record<string, any>} args
 * @param {string[]} required
 * @param {string} [usageHint] - Mensagem de uso a exibir em caso de erro
 */
function requireArgs(args, required, usageHint = '') {
    const missing = required.filter(k => !args[k]);
    if (missing.length > 0) {
        console.error(`❌ Args obrigatórios faltando: ${missing.map(k => `--${k}`).join(', ')}`);
        if (usageHint) console.error(`Uso: ${usageHint}`);
        process.exit(1);
    }
}

module.exports = { parseArgs, requireArgs };

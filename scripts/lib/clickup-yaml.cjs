/**
 * clickup-yaml.cjs — Loader e validador do clickup_ops.yaml
 *
 * Carrega a configuração central e expõe helpers tipados.
 * Nenhuma dependência externa — usa parser line-by-line próprio.
 *
 * Uso:
 *   const { getListId, isListSafe, getRoutingId, getInactiveClients } = require('./lib/clickup-yaml.cjs');
 */

const fs = require('fs');
const path = require('path');

const YAML_PATH = path.resolve(__dirname, '..', '..', 'clients', 'clickup_ops.yaml');

// ─── Parser minimalista para o nosso YAML controlado ─────────────────────────

function parseYaml(content) {
    const lines = content.split('\n');
    const result = {
        activeLists: {},    // listKey → list_id
        inactiveLists: {},  // list_id → clientName
        routing: {},        // role → memberId
        members: {},        // memberKey → { id, role }
        workspaceId: null,
    };

    let section = null;       // 'lists' | 'inactive' | 'routing' | 'members'
    let currentListKey = null;
    let currentInactiveClient = null;
    let currentInactiveSection = null; // 'lists' dentro de clients_inactive

    for (const rawLine of lines) {
        const trimmed = rawLine.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const indent = rawLine.search(/\S/);

        // workspace id
        if (indent === 4 && trimmed.startsWith('id:') && section === 'workspace') {
            result.workspaceId = trimmed.replace('id:', '').trim().replace(/"/g, '');
        }
        if (indent === 2 && trimmed === 'workspace:') { section = 'workspace'; continue; }

        // seções principais (indent 2)
        if (indent === 2) {
            if (trimmed === 'lists:') { section = 'lists'; currentListKey = null; continue; }
            if (trimmed === 'clients_inactive:') { section = 'inactive'; currentInactiveClient = null; continue; }
            if (trimmed === 'routing:') { section = 'routing'; continue; }
            if (trimmed === 'members:') { section = 'members'; continue; }
            if (!trimmed.startsWith('-')) section = null;
        }

        // ── LISTS ────────────────────────────────────────────────────────────
        if (section === 'lists') {
            if (indent === 4 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
                currentListKey = trimmed.slice(0, -1);
            }
            if (indent === 6 && trimmed.startsWith('list_id:') && currentListKey) {
                const id = trimmed.replace('list_id:', '').trim().replace(/"/g, '');
                result.activeLists[currentListKey] = id;
            }
        }

        // ── CLIENTS_INACTIVE ─────────────────────────────────────────────────
        if (section === 'inactive') {
            if (indent === 4 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
                currentInactiveClient = trimmed.slice(0, -1);
                currentInactiveSection = null;
            }
            if (indent === 6 && trimmed === 'lists:') {
                currentInactiveSection = 'lists';
            }
            if (indent === 8 && currentInactiveSection === 'lists' && trimmed.includes(':')) {
                const id = trimmed.split(':')[1].trim().replace(/"/g, '');
                if (id && id.match(/^\d+$/)) {
                    result.inactiveLists[id] = currentInactiveClient;
                }
            }
        }

        // ── ROUTING ──────────────────────────────────────────────────────────
        if (section === 'routing' && indent === 4 && trimmed.includes(':')) {
            const colonIdx = trimmed.indexOf(':');
            const k = trimmed.slice(0, colonIdx).trim();
            const v = trimmed.slice(colonIdx + 1).trim().replace(/"/g, '');
            if (k && v && !v.startsWith('#')) result.routing[k] = v;
        }

        // ── MEMBERS ──────────────────────────────────────────────────────────
        if (section === 'members') {
            if (indent === 4 && trimmed.endsWith(':')) {
                currentListKey = trimmed.slice(0, -1);
                if (!result.members[currentListKey]) result.members[currentListKey] = {};
            }
            if (indent === 6 && trimmed.startsWith('id:') && currentListKey) {
                result.members[currentListKey].id = trimmed.replace('id:', '').trim().replace(/"/g, '');
            }
            if (indent === 6 && trimmed.startsWith('role:') && currentListKey) {
                result.members[currentListKey].role = trimmed.replace('role:', '').trim().replace(/"/g, '');
            }
        }
    }

    return result;
}

// ─── Cache em memória ─────────────────────────────────────────────────────────

let _config = null;

function loadConfig() {
    if (_config) return _config;
    if (!fs.existsSync(YAML_PATH)) {
        throw new Error(`clickup_ops.yaml não encontrado em: ${YAML_PATH}`);
    }
    const content = fs.readFileSync(YAML_PATH, 'utf-8');
    _config = parseYaml(content);
    return _config;
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Retorna o list_id de um cliente/departamento.
 * @param {string} key - ex: 'gt_house_social_media'
 * @returns {string|null}
 */
function getListId(key) {
    return loadConfig().activeLists[key] || null;
}

/**
 * Retorna todos os list_ids ativos como objeto {key: id}.
 */
function getActiveLists() {
    return loadConfig().activeLists;
}

/**
 * Verifica se um list_id é seguro para uso (não está em cliente inativo).
 * @param {string} listId
 * @returns {boolean}
 */
function isListSafe(listId) {
    const cfg = loadConfig();
    if (cfg.inactiveLists[listId]) {
        console.warn(`⚠️  [clickup-yaml] List ${listId} pertence ao cliente inativo "${cfg.inactiveLists[listId]}". Operação bloqueada.`);
        return false;
    }
    return true;
}

/**
 * Retorna o member ID para uma role de routing.
 * @param {string} role - ex: 'social_media', 'paid_media', 'automacao'
 * @returns {string|null}
 */
function getRoutingId(role) {
    return loadConfig().routing[role] || loadConfig().routing['fallback_assignee'] || null;
}

/**
 * Retorna os clientes inativos mapeados { list_id: clientName }.
 */
function getInactiveClients() {
    return loadConfig().inactiveLists;
}

/**
 * Valida o yaml e retorna um relatório de integridade.
 */
function validateConfig() {
    const cfg = loadConfig();
    const issues = [];

    if (!cfg.workspaceId) issues.push('⚠️  workspace.id não encontrado');
    if (Object.keys(cfg.activeLists).length === 0) issues.push('❌ Nenhuma lista ativa mapeada');
    if (Object.keys(cfg.routing).length === 0) issues.push('⚠️  Routing vazio');
    if (!cfg.routing.fallback_assignee) issues.push('⚠️  fallback_assignee não definido');

    return {
        valid: issues.filter(i => i.startsWith('❌')).length === 0,
        issues,
        summary: {
            activeLists: Object.keys(cfg.activeLists).length,
            inactiveClients: Object.keys(cfg.inactiveLists).length,
            routingRoles: Object.keys(cfg.routing).length,
            workspaceId: cfg.workspaceId,
        },
    };
}

module.exports = {
    loadConfig,
    getListId,
    getActiveLists,
    isListSafe,
    getRoutingId,
    getInactiveClients,
    validateConfig,
};

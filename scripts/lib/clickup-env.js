/**
 * Centralized ClickUp API Key Loader
 *
 * ALL scripts that need ClickUp API access MUST use this module.
 * The API key is loaded from environment variable CLICKUP_API_KEY
 * defined in the project root .env file.
 *
 * Usage:
 *   const { API_KEY, clickupRequest } = require('./lib/clickup-env');
 *
 * @since 2026-03-01
 * @author Aria (architect) — Security Hardening Sprint
 */

const path = require('path');
const https = require('https');

// Load .env from project root
function loadEnv() {
    const envPath = path.resolve(__dirname, '..', '..', '.env');
    try {
        const fs = require('fs');
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.slice(0, eqIndex).trim();
            const value = trimmed.slice(eqIndex + 1).trim();
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    } catch {
        // .env file not found — rely on env vars already set
    }
}

loadEnv();

const API_KEY = process.env.CLICKUP_API_KEY;

if (!API_KEY) {
    console.error(
        '❌ CLICKUP_API_KEY not found.\n' +
        '   Set it in your .env file or as an environment variable.\n' +
        '   See .env.example for reference.'
    );
    process.exit(1);
}

/**
 * Reusable ClickUp HTTP request helper.
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} apiPath - e.g. '/task/abc123'
 * @param {object} [body]
 * @returns {Promise<{status: number, data: any}>}
 */
function clickupRequest(method, apiPath, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2${apiPath}`,
            method,
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                let parsed;
                try {
                    parsed = JSON.parse(data);
                } catch {
                    parsed = data;
                }
                resolve({ status: res.statusCode, data: parsed });
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

module.exports = { API_KEY, clickupRequest };

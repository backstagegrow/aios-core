/**
 * Centralized ClickUp API Key Loader
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
    console.error('❌ CLICKUP_API_KEY not found.');
    process.exit(1);
}

/**
 * Reusable ClickUp HTTP request helper.
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

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(parsed);
                } else {
                    const err = new Error(`ClickUp API Error: ${res.statusCode}`);
                    err.status = res.statusCode;
                    err.data = parsed;
                    reject(err);
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

module.exports = { API_KEY, clickupRequest };

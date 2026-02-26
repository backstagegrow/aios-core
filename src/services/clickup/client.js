/**
 * @file client.js
 * @description Core ClickUp API Client (Singleton).
 */

const https = require('https');
const config = require('./config');

class ClickUpClient {
    constructor() {
        this.apiKey = config.API_KEY;
        this.baseUrl = 'api.clickup.com';
    }

    request(path, method = 'GET', body = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.baseUrl,
                port: 443,
                path: `/api/v2${path}`,
                method: method,
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json'
                }
            };

            if (body) {
                options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
            }

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(data ? JSON.parse(data) : {});
                        } catch (e) {
                            resolve(data);
                        }
                    } else {
                        reject(new Error(`ClickUp API Error: ${res.statusCode} - ${data}`));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            if (body) req.write(JSON.stringify(body));
            req.end();
        });
    }

    async get(path) { return this.request(path, 'GET'); }
    async post(path, body) { return this.request(path, 'POST', body); }
    async put(path, body) { return this.request(path, 'PUT', body); }
    async delete(path) { return this.request(path, 'DELETE'); }

    // Helpers
    async getTasks(listId, includeClosed = true) {
        return this.get(`/list/${listId}/task?include_closed=${includeClosed}`);
    }

    async createTask(listId, taskData) {
        return this.post(`/list/${listId}/task`, taskData);
    }
}

module.exports = new ClickUpClient();

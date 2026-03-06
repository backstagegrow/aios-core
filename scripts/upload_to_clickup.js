/**
 * Generic ClickUp Campaign Uploader
 * 
 * Usage: node scripts/upload_to_clickup.js <client_name> <campaign_markdown_file> <list_id>
 * Example: node scripts/upload_to_clickup.js "spHaus" "clients/spHaus/campaigns/2026-03-06_social_media_pack_v3.md" "901324514510"
 */

const fs = require('fs');
const path = require('path');
const { clickupRequest } = require('./lib/clickup-env');

const [, , clientName, filePath, listId] = process.argv;

if (!clientName || !filePath || !listId) {
    console.error('Usage: node scripts/upload_to_clickup.js <client_name> <file_path> <list_id>');
    process.exit(1);
}

const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
}

const content = fs.readFileSync(absolutePath, 'utf-8');
const postBlocks = content.split(/---/).filter(block => block.trim().startsWith('##'));

async function uploadPosts() {
    console.log(`\n[Nexus] Starting Upload for ${clientName}...\n`);

    for (let i = 0; i < postBlocks.length; i++) {
        const block = postBlocks[i].trim();
        const titleMatch = block.match(/## (?:.*?: )?(.*)/);
        const title = titleMatch ? titleMatch[1].trim() : `Post ${i + 1}`;

        const taskName = `[${clientName}] ${title}`;

        console.log(`Creating task: ${taskName}`);

        const payload = {
            name: taskName,
            markdown_description: block,
            priority: 2
        };

        try {
            const response = await clickupRequest('POST', `/list/${listId}/task`, payload);
            if (response.status === 200 || response.status === 201) {
                console.log(`✅ Success: ${taskName}`);
            } else {
                console.error(`❌ Failed: ${taskName} (Status: ${response.status})`);
                console.error(response.data);
            }
        } catch (error) {
            console.error(`❌ Error uploading ${taskName}:`, error.message);
        }

        // Rate limiting avoidance
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n[Nexus] Upload process finished.');
}

uploadPosts();

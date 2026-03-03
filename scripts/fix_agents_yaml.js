const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const squadsDir = path.join('d:', '001Gravity', 'aios-core', 'squads');

let modifiedCount = 0;

walkDir(squadsDir, (filePath) => {
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Apenas modificar se parecer ser um arquivo de agente (tem prop 'name' e 'role' ou similar, ou apenas aplicar globals)
        if (content.includes('name:') && (content.includes('model:') || content.includes('role:'))) {
            if (!content.includes('prompt_version:')) {
                content += '\nprompt_version: 1.0.0\n';
                modified = true;
            }
            if (!content.includes('fallback_model:')) {
                content += 'fallback_model: claude-3-5-haiku-20241022\n';
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedCount++;
                console.log(`Updated: ${filePath}`);
            }
        }
    }
});

console.log(`Done. Modified ${modifiedCount} agent YAML files.`);

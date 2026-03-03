const fs = require('fs');
const path = require('path');

function fixAgents() {
    const squadsDir = path.join(__dirname, '../squads');
    const squads = fs.readdirSync(squadsDir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_'));

    let totalFixedPrompts = 0;
    let totalFixedContracts = 0;
    let totalFixedModels = 0;
    const orphans = [];

    for (const squad of squads) {
        const squadPath = path.join(squadsDir, squad.name);
        const squadYamlPath = path.join(squadPath, 'squad.yaml');

        let squadConfigStr = fs.existsSync(squadYamlPath) ? fs.readFileSync(squadYamlPath, 'utf8') : '';
        let squadAgentsMatch = squadConfigStr.match(/agents:\s*\n((?:\s+-\s+[^\n]+\n)*)/);
        let squadAgentsStr = squadAgentsMatch ? squadAgentsMatch[1] : '';
        let squadAgents = squadAgentsStr.split('\n').filter(l => l.includes('- ')).map(l => l.replace(/.*-\s+/, '').trim());

        let orchMatch = squadConfigStr.match(/orchestrator:\s*([^\s\n]+)/);
        if (orchMatch && orchMatch[1]) squadAgents.push(orchMatch[1].trim());

        const getAllYamls = function (dir, fileList = []) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    fileList = getAllYamls(path.join(dir, file), fileList);
                } else if (file.endsWith('.yaml') && file !== 'squad.yaml' && !file.includes('sales-page-delivery') && !file.includes('maturity-profiles')) {
                    fileList.push(path.join(dir, file));
                }
            }
            return fileList;
        };

        const agentFiles = getAllYamls(squadPath);

        for (const yamlPath of agentFiles) {
            let content = fs.readFileSync(yamlPath, 'utf8');
            if (!content.includes('role: ')) continue; // Skip non-agent files

            let changed = false;

            // 1. Orphan check
            const relPath = path.relative(squadPath, yamlPath).replace(/\\/g, '/').replace('.yaml', '');
            if (!squadAgents.includes(relPath)) {
                orphans.push(`${squad.name}/${relPath}.yaml`);
                // Add to squad.yaml
                if (squadAgentsMatch) {
                    squadConfigStr = squadConfigStr.replace(squadAgentsMatch[0], squadAgentsMatch[0] + `  - ${relPath}\n`);
                    fs.writeFileSync(squadYamlPath, squadConfigStr, 'utf8');
                    squadAgentsMatch = squadConfigStr.match(/agents:\s*\n((?:\s+-\s+[^\n]+\n)*)/); // update match
                } else {
                    squadConfigStr += `\nagents:\n  - ${relPath}\n`;
                    fs.writeFileSync(squadYamlPath, squadConfigStr, 'utf8');
                }
                squadAgents.push(relPath);
            }

            // 2. Prompt Version
            if (!content.includes('prompt_version:')) {
                content = content.replace(/\s*$/, '\nprompt_version: 1.0.0\n');
                changed = true;
                totalFixedPrompts++;
            }

            // 3. Output Contract
            if (!content.includes('output_contract:')) {
                content = content.replace(/\s*$/, '\noutput_contract: |\n  format: markdown\n  structure: defined by prompt\n  validation: MUST adhere to BKS guidelines\n');
                changed = true;
                totalFixedContracts++;
            }

            // 4. Inconsistent Model (Hardcoded instead of ENV)
            if (content.match(/^model:\s*(?!.*\$\{).*/m)) {
                content = content.replace(/^model:\s*.*/m, 'model: ${DEFAULT_MODEL:-claude-3-5-sonnet-20241022}');
                changed = true;
                totalFixedModels++;
            }

            // 5. B2B Matrix Fix
            if (content.includes('B2B Sales Complexity Matrix') && !content.includes('squads/_shared/policies/b2b-matrix-exent.md')) {
                content = content.replace(/B2B Sales Complexity Matrix/g, 'B2B Sales Complexity Matrix (REF: squads/_shared/policies/b2b-matrix-exent.md)');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(yamlPath, content, 'utf8');
            }
        }
    }

    console.log(`✅ Fixed Models (ENV): ${totalFixedModels}`);
    console.log(`✅ Fixed Prompt Versions: ${totalFixedPrompts}`);
    console.log(`✅ Fixed Output Contracts: ${totalFixedContracts}`);
    console.log(`✅ Reparented Orphans: ${orphans.length}`);
    orphans.forEach(o => console.log('   - ' + o));
}

fixAgents();

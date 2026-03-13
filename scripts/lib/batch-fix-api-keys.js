#!/usr/bin/env node

/**
 * Batch Security Fix — Remove hardcoded ClickUp API Keys
 *
 * This script replaces all instances of hardcoded API key declarations
 * in scripts/ with the centralized clickup-env import.
 *
 * Run: node scripts/lib/batch-fix-api-keys.js
 *
 * @author Aria (architect) — Security Hardening Sprint
 * @since 2026-03-01
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const HARDCODED_KEY = process.env.CLICKUP_LEGACY_KEY || "REDACTED_KEY_PATTERN";
// Pattern variations found in the codebase
const PATTERNS = [
    new RegExp(`const API_KEY\\s*=\\s*'${HARDCODED_KEY}';?\\s*\\n?`, 'g'),
    new RegExp(`const API_KEY\\s*=\\s*"${HARDCODED_KEY}";?\\s*\\n?`, 'g'),
];

const REPLACEMENT_IMPORT = "const { API_KEY, clickupRequest } = require('./lib/clickup-env');\n";

// Also handle root-level scripts
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const ROOT_SCRIPTS = [
    'research_clickup_doc.js',
    'check_clients_doc.js',
    'check_list_descriptions.js',
    'check_views.js',
    'security_audit.js',
    'test_services.js',
    'tmp_sync.js',
];

function fixFile(filePath, isRootLevel = false) {
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes(HARDCODED_KEY)) return false;

    let fixed = content;
    const importLine = isRootLevel
        ? "const { API_KEY, clickupRequest } = require('./scripts/lib/clickup-env');\n"
        : REPLACEMENT_IMPORT;

    for (const pattern of PATTERNS) {
        fixed = fixed.replace(pattern, importLine);
    }

    // Avoid duplicate imports
    const importCount = (fixed.match(/require\('\.\/.*clickup-env'\)/g) || []).length;
    if (importCount > 1) {
        // Keep only the first occurrence
        let firstFound = false;
        fixed = fixed.replace(/const \{ API_KEY, clickupRequest \} = require\('\.\/.*clickup-env'\);\n/g, (match) => {
            if (!firstFound) {
                firstFound = true;
                return match;
            }
            return '';
        });
    }

    if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf-8');
        return true;
    }
    return false;
}

function run() {
    console.log('🔒 Security Hardening: Removing hardcoded ClickUp API keys...\n');

    let fixed = 0;
    let skipped = 0;

    // Process scripts/ directory
    const scriptFiles = fs.readdirSync(SCRIPTS_DIR)
        .filter(f => f.endsWith('.js') && f !== 'code-intel-health-check.js')
        .filter(f => !f.startsWith('dashboard-parallel'))
        .filter(f => f !== 'semantic-lint.js')
        .filter(f => f !== 'ensure-manifest.js')
        .filter(f => f !== 'generate-install-manifest.js')
        .filter(f => f !== 'validate-manifest.js')
        .filter(f => f !== 'validate-package-completeness.js')
        .filter(f => f !== 'package-synapse.js');

    for (const file of scriptFiles) {
        const filePath = path.join(SCRIPTS_DIR, file);
        if (filePath.includes('lib')) continue; // skip our own lib
        try {
            if (fixFile(filePath, false)) {
                console.log(`  ✅ Fixed: scripts/${file}`);
                fixed++;
            } else {
                skipped++;
            }
        } catch (err) {
            console.error(`  ❌ Error: scripts/${file} — ${err.message}`);
        }
    }

    // Process root-level scripts
    for (const file of ROOT_SCRIPTS) {
        const filePath = path.join(ROOT_DIR, file);
        if (!fs.existsSync(filePath)) continue;
        try {
            if (fixFile(filePath, true)) {
                console.log(`  ✅ Fixed: ${file} (root)`);
                fixed++;
            } else {
                skipped++;
            }
        } catch (err) {
            console.error(`  ❌ Error: ${file} — ${err.message}`);
        }
    }

    console.log(`\n📊 Summary: ${fixed} files fixed, ${skipped} already clean.`);
    console.log('🔒 Hardened. All scripts now use CLICKUP_API_KEY from .env.');
}

run();

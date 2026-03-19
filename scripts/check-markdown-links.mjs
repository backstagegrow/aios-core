#!/usr/bin/env node
/**
 * Markdown Link Checker for AIOS Documentation (Node.js Port)
 * 
 * Validates internal markdown links and tracks documentation status.
 * Inspired by Obsidian's broken link checker.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCS_DIR = "docs";
const LINK_PATTERN = /\[([^\]]*)\]\(([^)]+)\)/g;
const COMING_SOON_MARKER = " *(coming soon)*";

/**
 * Resolve a relative link to an absolute path.
 */
function normalizePath(sourceFile, link) {
    // Skip external links, mailto, and anchors
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('#')) {
        return null;
    }

    // Remove anchor from link
    const cleanLink = link.split('#')[0];
    if (!cleanLink) return null;

    // Handle URL encoding
    const decodedLink = decodeURIComponent(cleanLink.replace(/\+/g, ' '));

    // Resolve relative path
    const sourceDir = path.dirname(sourceFile);
    return path.resolve(sourceDir, decodedLink);
}

/**
 * Check if a link is marked as coming soon.
 */
function isComingSoon(line, link) {
    const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Ensure "coming soon" follows this specific link without another link in between
    const pattern = new RegExp(`\\]\\(${escapedLink}\\)[^\\]\\)]*?coming soon`, 'i');
    return pattern.test(line);
}

/**
 * Scan a markdown file for link issues.
 */
function scanFile(filepath) {
    const results = {
        broken: [],
        coming_soon: [],
        incorrect_marking: [],
        valid: []
    };

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const lines = content.split(/\r?\n/);

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            let match;
            // Reset regex state for global search
            LINK_PATTERN.lastIndex = 0;

            while ((match = LINK_PATTERN.exec(line)) !== null) {
                const text = match[1];
                const link = match[2];
                const resolved = normalizePath(filepath, link);

                if (!resolved) continue;

                const exists = fs.existsSync(resolved);
                const comingSoon = isComingSoon(line, link);

                const info = {
                    line: lineNum,
                    text: text,
                    link: link,
                    resolved: resolved,
                    line_content: line
                };

                if (exists && comingSoon) {
                    results.incorrect_marking.push(info);
                } else if (!exists && comingSoon) {
                    results.coming_soon.push(info);
                } else if (!exists) {
                    results.broken.push(info);
                } else {
                    results.valid.push(info);
                }
            }
        });
    } catch (e) {
        console.error(`Error scanning ${filepath}: ${e.message}`);
    }

    return results;
}

/**
 * Recursive directory walker
 */
function walk(dir) {
    let files = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            files = files.concat(walk(filePath));
        } else {
            files.push(filePath);
        }
    });
    return files;
}

/**
 * Fix a broken link by adding marker
 */
function fixBrokenLink(filepath, lineNum, link) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const lines = content.split(/\r?\n/);
        const lineIdx = lineNum - 1;
        let line = lines[lineIdx];

        const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\]\\(${escapedLink}\\)`, 'g');

        // Only if it doesn't already have the marker
        if (new RegExp(`\\]\\(${escapedLink}\\)\\s*\\*\\(coming soon\\)\\*`, 'i').test(line)) {
            return false;
        }

        const newLine = line.replace(pattern, `](${link})${COMING_SOON_MARKER}`);
        if (newLine !== line) {
            lines[lineIdx] = newLine;
            fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
            return true;
        }
    } catch (e) {
        console.error(`Error fixing ${filepath}:${lineNum}: ${e.message}`);
    }
    return false;
}

/**
 * Fix incorrect marking by removing marker
 */
function fixIncorrectMarking(filepath, lineNum, link) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const lines = content.split(/\r?\n/);
        const lineIdx = lineNum - 1;
        let line = lines[lineIdx];

        const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\]\\(${escapedLink}\\)\\s*\\*\\(coming soon\\)\\*`, 'gi');

        const newLine = line.replace(pattern, `](${link})`);
        if (newLine !== line) {
            lines[lineIdx] = newLine;
            fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
            return true;
        }
    } catch (e) {
        console.error(`Error fixing ${filepath}:${lineNum}: ${e.message}`);
    }
    return false;
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    const options = {
        json: args.includes('--json'),
        fix: args.includes('--fix'),
        summary: args.includes('--summary'),
        dir: args.find(a => !a.startsWith('--')) || DOCS_DIR
    };

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Markdown Link Checker for AIOS Documentation (Node.js)

Usage:
    node scripts/check-markdown-links.mjs              # Default report
    node scripts/check-markdown-links.mjs --json       # JSON output for CI
    node scripts/check-markdown-links.mjs --fix        # Auto-fix broken links
    node scripts/check-markdown-links.mjs --summary    # Quick summary only
    node scripts/check-markdown-links.mjs docs/other   # Scan custom directory
        `);
        return;
    }

    if (!fs.existsSync(options.dir)) {
        console.error(`Directory not found: ${options.dir}`);
        process.exit(1);
    }

    const allFiles = walk(options.dir).filter(f => f.endsWith('.md'));
    const allResults = {
        broken: [],
        coming_soon: [],
        incorrect_marking: [],
        valid: [],
        files_scanned: 0
    };

    allFiles.forEach(filepath => {
        const results = scanFile(filepath);
        allResults.files_scanned++;
        results.broken.forEach(info => allResults.broken.push({ file: filepath, ...info }));
        results.coming_soon.forEach(info => allResults.coming_soon.push({ file: filepath, ...info }));
        results.incorrect_marking.forEach(info => allResults.incorrect_marking.push({ file: filepath, ...info }));
        results.valid.forEach(info => allResults.valid.push({ file: filepath, ...info }));
    });

    // Auto-fix if requested
    if (options.fix) {
        let fixedBroken = 0;
        let fixedIncorrect = 0;

        for (const info of allResults.broken) {
            if (fixBrokenLink(info.file, info.line, info.link)) fixedBroken++;
        }

        for (const info of allResults.incorrect_marking) {
            if (fixIncorrectMarking(info.file, info.line, info.link)) fixedIncorrect++;
        }

        if (fixedBroken > 0 || fixedIncorrect > 0) {
            console.log(`Fixed ${fixedBroken} broken links (added 'coming soon')`);
            console.log(`Fixed ${fixedIncorrect} incorrect markings (removed 'coming soon')\n`);

            // Re-scan
            return main(); // Recurse once after fix
        }
    }

    // Output results
    if (options.json) {
        const output = {
            summary: {
                files_scanned: allResults.files_scanned,
                valid_links: allResults.valid.length,
                broken_links: allResults.broken.length,
                incorrect_markings: allResults.incorrect_marking.length,
                coming_soon_links: allResults.coming_soon.length,
            },
            broken: allResults.broken,
            incorrect_marking: allResults.incorrect_marking,
            coming_soon_destinations: Array.from(new Set(allResults.coming_soon.map(i => i.link)))
        };
        console.log(JSON.stringify(output, null, 2));
    } else if (options.summary) {
        const broken = allResults.broken.length;
        const incorrect = allResults.incorrect_marking.length;
        const status = (broken === 0 && incorrect === 0) ? "PASS" : "FAIL";
        console.log(`Link Check: ${status}`);
        console.log(`  Broken: ${broken} | Incorrect: {incorrect} | Coming Soon: ${allResults.coming_soon.length}`);
    } else {
        console.log("=".repeat(70));
        console.log("MARKDOWN LINK VERIFICATION REPORT (Node.js)");
        console.log("=".repeat(70));
        console.log();

        console.log(`## 1. BROKEN LINKS (no 'coming soon' marker): ${allResults.broken.length}`);
        console.log("-".repeat(60));
        allResults.broken.sort((a, b) => a.file.localeCompare(b.file)).forEach(info => {
            console.log(`  ${info.file}:${info.line} -> ${info.link}`);
        });
        console.log();

        console.log(`## 2. INCORRECT: File EXISTS but marked 'coming soon': ${allResults.incorrect_marking.length}`);
        console.log("-".repeat(60));
        allResults.incorrect_marking.sort((a, b) => a.file.localeCompare(b.file)).forEach(info => {
            console.log(`  ${info.file}:${info.line} -> ${info.link}`);
        });
        console.log();

        console.log(`## 3. PLANNED CONTENT: Links marked 'coming soon': ${allResults.coming_soon.length}`);
        console.log("-".repeat(60));
        const byDest = {};
        allResults.coming_soon.forEach(info => {
            byDest[info.link] = (byDest[info.link] || 0) + 1;
        });
        Object.keys(byDest).sort().forEach(link => {
            console.log(`  ${link} (${byDest[link]} refs)`);
        });
        console.log();

        console.log("=".repeat(70));
        console.log("SUMMARY");
        console.log("=".repeat(70));
        console.log(`  Files scanned: ${allResults.files_scanned}`);
        console.log(`  Valid links: ${allResults.valid.length}`);
        console.log(`  Broken links (ACTION: mark coming soon): ${allResults.broken.length}`);
        console.log(`  Incorrect markings (ACTION: remove coming soon): ${allResults.incorrect_marking.length}`);
        console.log(`  Planned content (coming soon): ${allResults.coming_soon.length}`);
    }

    // Exit code
    if (allResults.broken.length > 0) process.exit(1);
    if (allResults.incorrect_marking.length > 0) process.exit(2);
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

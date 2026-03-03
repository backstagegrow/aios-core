const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SENSITIVE_PATTERNS = [
  /pk_[a-zA-Z0-9]{30,}/g,           // ClickUp API Keys
  /EAAB[a-zA-Z0-9]{50,}/g,          // Meta Access Tokens
  /ghp_[a-zA-Z0-9]{36}/g,           // GitHub Personal Access Tokens
  /[a-zA-Z0-9]{32,45}/g,            // Generic long hashes (can be secrets)
  /xox[baprs]-[0-9]{12}-[a-zA-Z0-9]{24}/g, // Slack tokens
  /AIza[0-9A-Za-z\\-_]{35}/g,        // Google API Keys
];

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build'];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  // Skip checking this script itself
  if (fileName === 'security_audit.js') return;

  SENSITIVE_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`[ALERT] Secret pattern found in: ${filePath}`);
      matches.forEach(m => console.log(`  > Match: ${m.substring(0, 5)}...${m.substring(m.length - 3)}`));
    }
  });
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (EXCLUDED_DIRS.includes(file)) return;

    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      // Only scan text-based files
      if (/\.(js|ts|json|md|yaml|yml|env|txt|sh|ps1)$/.test(file)) {
        scanFile(fullPath);
      }
    }
  });
}

console.log('🛡️ Starting Security Audit: Local Files...');
traverse(process.cwd());

console.log('\n🛡️ Starting Security Audit: Git History (Deep Scan)...');
try {
  // Check for secrets in commit history (last 50 commits)
  const gitLog = execSync('git log -p -n 50', { encoding: 'utf8' });
  SENSITIVE_PATTERNS.forEach(pattern => {
    const matches = gitLog.match(pattern);
    if (matches) {
      console.log('[CRITICAL] Secrets detected in GIT HISTORY!');
      matches.forEach(m => console.log(`  > Historical Match: ${m.substring(0, 5)}...`));
    }
  });
} catch (e) {
  console.log('No git history found or error running git log.');
}

console.log('\n✅ Audit Complete.');

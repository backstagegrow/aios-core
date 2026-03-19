#!/usr/bin/env node
/**
 * cleanup-runtime.js — AIOS Runtime Cleanup
 *
 * Removes stale runtime artifacts:
 * - .aios/notifications/ older than NOTIF_RETENTION_DAYS (default: 7)
 * - .synapse/sessions/ older than SESSION_RETENTION_DAYS (default: 7)
 * - .aios/cache/ older than CACHE_RETENTION_DAYS (default: 3)
 *
 * Usage:
 *   node scripts/cleanup-runtime.js
 *   node scripts/cleanup-runtime.js --dry-run
 *
 * Env vars:
 *   NOTIF_RETENTION_DAYS  (default: 7)
 *   SESSION_RETENTION_DAYS (default: 7)
 *   CACHE_RETENTION_DAYS  (default: 3)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const CWD = process.cwd();

const RETENTION = {
  notifications: parseInt(process.env.NOTIF_RETENTION_DAYS || '7', 10),
  sessions: parseInt(process.env.SESSION_RETENTION_DAYS || '7', 10),
  cache: parseInt(process.env.CACHE_RETENTION_DAYS || '3', 10),
};

const TARGETS = [
  { dir: path.join(CWD, '.aios', 'notifications'), retentionDays: RETENTION.notifications, name: 'notifications' },
  { dir: path.join(CWD, '.synapse', 'sessions'), retentionDays: RETENTION.sessions, name: 'synapse/sessions' },
  { dir: path.join(CWD, '.aios', 'cache'), retentionDays: RETENTION.cache, name: 'aios/cache' },
];

/**
 * Delete files older than retentionDays in a directory.
 * @param {string} dir - Directory path
 * @param {number} retentionDays - Max age in days
 * @param {string} name - Display name for logging
 * @returns {{ deleted: number, skipped: number }}
 */
function cleanDirectory(dir, retentionDays, name) {
  if (!fs.existsSync(dir)) {
    return { deleted: 0, skipped: 0 };
  }

  const cutoffMs = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  let deleted = 0;
  let skipped = 0;

  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return { deleted: 0, skipped: 0 };
  }

  for (const entry of entries) {
    const filePath = path.join(dir, entry);
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;
      if (stat.mtimeMs < cutoffMs) {
        if (!DRY_RUN) fs.unlinkSync(filePath);
        deleted++;
      } else {
        skipped++;
      }
    } catch {
      skipped++;
    }
  }

  const prefix = DRY_RUN ? '[dry-run] ' : '';
  if (deleted > 0 || skipped > 0) {
    console.log(`${prefix}${name}: removed ${deleted}, kept ${skipped} (retention: ${retentionDays}d)`);
  }
  return { deleted, skipped };
}

// Run cleanup
let totalDeleted = 0;
for (const target of TARGETS) {
  const { deleted } = cleanDirectory(target.dir, target.retentionDays, target.name);
  totalDeleted += deleted;
}

if (totalDeleted === 0) {
  console.log('cleanup: nothing to remove');
} else if (DRY_RUN) {
  console.log(`cleanup: would remove ${totalDeleted} files (--dry-run)`);
} else {
  console.log(`cleanup: removed ${totalDeleted} files total`);
}

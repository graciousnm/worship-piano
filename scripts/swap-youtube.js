#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  scripts/swap-youtube.js — One-shot YouTube ID swap CLI
//  Lightweight operator tool for occasional single-lesson edits
//  without restoring the full admin console.
// ═══════════════════════════════════════════════════════════════
//
//  Usage:
//    node scripts/swap-youtube.js <lesson_id> <new_youtube_id> [options]
//
//  Options:
//    --dry-run, -n    Print the planned change without writing.
//    --json           Emit machine-readable JSON instead of human output.
//    --db <path>      Override DB_PATH (defaults to $DB_PATH or ./gospel_piano.db).
//    --help, -h       Show this help.
//
//  Requires:
//    SYNC_API_KEY env var must be non-empty. The script never transmits it;
//    it's an "are you running with the project's secrets loaded?" sanity guard.
//
//  Exit codes:
//    0  success or already-equal no-op
//    1  argument / validation error (incl. missing SYNC_API_KEY)
//    2  lesson_id not found
//    3  database error
// ═══════════════════════════════════════════════════════════════

'use strict';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// YouTube video IDs are exactly 11 chars: letters, digits, '-' and '_'
const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/;

// ── Arg parsing ───────────────────────────────────────────
function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = { dryRun: false, json: false, help: false, dbPath: null };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dry-run' || a === '-n') flags.dryRun = true;
    else if (a === '--json') flags.json = true;
    else if (a === '--help' || a === '-h') flags.help = true;
    else if (a === '--db') { flags.dbPath = args[++i]; if (!flags.dbPath) throw new Error('--db requires a path'); }
    else if (a.startsWith('--')) throw new Error(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  return { flags, positional };
}

function printHelp() {
  console.log(
`Usage: node scripts/swap-youtube.js <lesson_id> <new_youtube_id> [options]

Swap a single lesson's YouTube video ID. Operates locally on the SQLite
database — requires operator-level shell access. SYNC_API_KEY (env or
--sync-key) must be set as a confirmation guard.

Options:
  --dry-run, -n    Print the planned change without writing.
  --json           Emit machine-readable JSON only (no human text).
  --db <path>      Override DB_PATH (default: $DB_PATH or ./gospel_piano.db).
  --help, -h       Show this help.

Examples:
  SYNC_API_KEY=your-secret \\
    node scripts/swap-youtube.js 42 dQw4w9WgXcQ
  SYNC_API_KEY=your-secret \\
    node scripts/swap-youtube.js 42 dQw4w9WgXcQ --dry-run
  SYNC_API_KEY=your-secret \\
    node scripts/swap-youtube.js 42 dQw4w9WgXcQ --json
`
  );
}

// ── Helpers ────────────────────────────────────────────────
function promisify(db, fn) {
  return (...args) => new Promise((resolve, reject) => {
    db[fn](...args, function (err, result) {
      if (err) return reject(err);
      // sqlite3 `this` inside .run() has lastID/changes; capture via resolve(this)
      resolve(result !== undefined ? result : this);
    });
  });
}

function logResult({ flags, lesson, beforeId, newYtId, dryRun, noChange, ok, error }) {
  if (flags.json) {
    const payload = {
      ok: ok !== false,
      dry_run: !!dryRun,
      lesson_id: lesson ? lesson.id : null,
      title: lesson ? lesson.title : null,
      module: lesson ? lesson.module_title : null,
      sort_order: lesson ? lesson.sort_order : null,
      before: beforeId || null,
      after: newYtId || null,
      changed: !!(lesson && beforeId && newYtId && beforeId !== newYtId && !dryRun),
    };
    if (error) payload.error = error;
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  if (error) {
    console.error(`❌ ${error}`);
    return;
  }
  const tag = noChange
    ? 'ℹ️  no-change'
    : (dryRun ? '🔍 dry-run' : '✅ swapped');
  console.log(
    `${tag}  lesson #${lesson.id}  "${lesson.title}"\n` +
    `            in module "${lesson.module_title}"  (sort_order ${lesson.sort_order})\n` +
    `            before: ${beforeId}\n` +
    `            after : ${newYtId}`
  );
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv);
  } catch (e) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }
  const { flags } = parsed;
  let { positional } = parsed;

  if (flags.help) { printHelp(); process.exit(0); }

  if (positional.length !== 2) {
    console.error(`❌ Expected 2 positional args (lesson_id, youtube_id), got ${positional.length}. Run with --help.`);
    process.exit(1);
  }
  const [lessonIdStr, newYtId] = positional;

  const lessonId = parseInt(lessonIdStr, 10);
  if (!Number.isInteger(lessonId) || lessonId <= 0 || String(lessonId) !== lessonIdStr.trim()) {
    console.error(`❌ Invalid lesson_id: ${JSON.stringify(lessonIdStr)} (must be a positive integer)`);
    process.exit(1);
  }
  if (!YT_ID_RE.test(newYtId)) {
    console.error(`❌ Invalid youtube_id: ${JSON.stringify(newYtId)} (must be 11 chars [A-Za-z0-9_-])`);
    process.exit(1);
  }

  // Operator-authorization guard. We never transmit this key over the network,
  // it's purely a "have you loaded the project's secrets" sanity check.
  // Env-only by design — a CLI override would just be a back door.
  if (!process.env.SYNC_API_KEY) {
    console.error('❌ Refusing to run without SYNC_API_KEY in env. (e.g. SYNC_API_KEY=... node scripts/swap-youtube.js ...)');
    process.exit(1);
  }

  const dbPath = flags.dbPath || process.env.DB_PATH || path.join(__dirname, '..', 'gospel_piano.db');

  // --db would otherwise silently create an empty DB on a typo and then
  // report "lesson not found" without any indication we just made the file.
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ DB file not found: ${dbPath}`);
    process.exit(1);
  }

  const db = new sqlite3.Database(dbPath);
  const get = promisify(db, 'get');
  const run = promisify(db, 'run');

  let lesson;
  try {
    lesson = await get(
      `SELECT l.id, l.title, l.youtube_id, l.sort_order, m.title AS module_title
         FROM lessons l
         JOIN modules  m ON m.id = l.module_id
        WHERE l.id = ?`,
      [lessonId]
    );
  } catch (err) {
    logResult({ flags, lesson: null, error: `DB error: ${err.message}` });
    db.close();
    process.exit(3);
  }

  if (!lesson) {
    logResult({ flags, lesson: null, beforeId: null, newYtId, error: `Lesson with id=${lessonId} not found.` });
    db.close();
    process.exit(2);
  }

  const beforeId = lesson.youtube_id;
  const noChange = beforeId === newYtId;

  if (noChange || flags.dryRun) {
    logResult({ flags, lesson, beforeId, newYtId, dryRun: flags.dryRun, noChange });
    db.close();
    process.exit(0);
  }

  // Write inside a transaction so an interrupted swap can never leave a half-applied state.
  // Assert changes === 1 to catch the "row deleted between SELECT and UPDATE" race.
  try {
    await run('BEGIN');
    const stmt = await run(
      'UPDATE lessons SET youtube_id = ? WHERE id = ?',
      [newYtId, lessonId]
    );
    if (!stmt || stmt.changes !== 1) {
      try { await run('ROLLBACK'); } catch (_) { /* ignore */ }
      logResult({ flags, lesson, beforeId, newYtId, noChange: false, error: `Unexpected row count (${stmt && stmt.changes}); lesson may have been deleted concurrently. Re-run and check.` });
      db.close();
      process.exit(3);
    }
    await run('COMMIT');
  } catch (err) {
    try { await run('ROLLBACK'); } catch (_) { /* ignore */ }
    logResult({ flags, lesson, beforeId, newYtId, noChange: false, error: `DB error during swap: ${err.message}` });
    db.close();
    process.exit(3);
  }

  logResult({ flags, lesson, beforeId, newYtId, dryRun: false, noChange: false, ok: true });
  db.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err && err.stack ? err.stack : err);
  process.exit(3);
});

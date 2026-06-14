// ═══════════════════════════════════════════════════════════════
//  sync-rss.js — Auto-fetch YouTube playlist RSS feeds
//  Upserts new lessons into the database without duplicating
// ═══════════════════════════════════════════════════════════════

const https = require('https');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, 'playlist-modules.json');

/**
 * Fetch a URL over HTTPS and return the response body as a string.
 */
function fetchUrl(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error(`Too many redirects for ${url}`));
    https.get(url, { timeout: 15000 }, (res) => {
      // Follow redirects (YouTube RSS sometimes redirects)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, redirects + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function () {
      this.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Parse YouTube playlist Atom XML feed.
 * Returns an array of { videoId, title, description } objects
 * in the order they appear in the playlist.
 */
function parsePlaylistRSS(xml) {
  const entries = [];
  // Split on <entry> blocks — simple and reliable for this feed format
  const blocks = xml.split(/<entry>/);
  // First block is the feed header (before first <entry>)
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    // Extract video ID
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (!idMatch) continue;
    const videoId = idMatch[1];

    // Skip YouTube Shorts (they appear as /shorts/ in the link)
    if (block.includes('/shorts/')) continue;

    // Extract title
    const titleMatch = block.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    // Extract description
    const descMatch = block.match(/<media:description>([^<]*)<\/media:description>/);
    let description = descMatch ? descMatch[1].trim() : '';
    // Truncate very long descriptions (usually sales pitches)
    if (description.length > 200) {
      description = description.slice(0, 197) + '...';
    }

    entries.push({ videoId, title, description });
  }
  return entries;
}

/**
 * Sync all playlist modules with their YouTube RSS feeds.
 * @param {import('sqlite3').Database} db - SQLite database instance
 * @returns {Promise<{ added: number, errors: string[] }>}
 */
function syncPlaylists(db) {
  return new Promise((resolve, reject) => {
    let config;
    try {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (err) {
      return reject(new Error(`Failed to read playlist config: ${err.message}`));
    }

    const results = { added: 0, errors: [], playlistResults: [] };

    // Process playlists sequentially to avoid overwhelming the DB
    const processNext = (index) => {
      if (index >= config.length) {
        // All done — log summary
        if (results.added > 0) {
          console.log(`📡 RSS sync complete: ${results.added} new lessons added across ${results.playlistResults.length} playlists`);
        } else {
          console.log('📡 RSS sync: all playlists up to date');
        }
        return resolve(results);
      }

      const playlistConfig = config[index];
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistConfig.playlistId}`;

      console.log(`📡 Syncing ${playlistConfig.label}...`);

      fetchUrl(feedUrl)
        .then((xml) => {
          const entries = parsePlaylistRSS(xml);
          if (entries.length === 0) {
            console.log(`  ⚠ No videos found in ${playlistConfig.label}`);
            results.playlistResults.push({ label: playlistConfig.label, added: 0 });
            processNext(index + 1);
            return;
          }

          // Find the target module(s) — new videos go to the last module in the group
          const targetSortOrders = playlistConfig.moduleSortOrders;
          if (!targetSortOrders || targetSortOrders.length === 0) {
            console.log(`  ⚠ No module sort_orders defined for ${playlistConfig.label}`);
            processNext(index + 1);
            return;
          }
          const primarySortOrder = targetSortOrders[targetSortOrders.length - 1];

          upsertLessons(db, primarySortOrder, entries, playlistConfig.label)
            .then((count) => {
              results.added += count;
              results.playlistResults.push({ label: playlistConfig.label, added: count });
              console.log(`  ✅ ${playlistConfig.label}: ${entries.length} videos in feed, ${count} new`);
              processNext(index + 1);
            })
            .catch((err) => {
              results.errors.push(`${playlistConfig.label}: ${err.message}`);
              console.error(`  ❌ ${playlistConfig.label}: ${err.message}`);
              processNext(index + 1);
            });
        })
        .catch((err) => {
          results.errors.push(`${playlistConfig.label}: ${err.message}`);
          console.error(`  ❌ ${playlistConfig.label}: ${err.message}`);
          processNext(index + 1);
        });
    };

    processNext(0);
  });
}

/**
 * Upsert lessons from a playlist into a specific module.
 * Only inserts lessons whose youtube_id does not already exist in ANY module.
 */
function upsertLessons(db, moduleSortOrder, entries, label) {
  return new Promise((resolve, reject) => {
    // First, find the module ID
    db.get(
      'SELECT id FROM modules WHERE sort_order = ?',
      [moduleSortOrder],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error(`Module with sort_order ${moduleSortOrder} not found`));

        const moduleId = row.id;
        let added = 0;
        let processed = 0;

        // Get all existing youtube_ids in one query (for dedup check)
        db.all('SELECT youtube_id FROM lessons', [], (err2, existingRows) => {
          if (err2) return reject(err2);
          const existingIds = new Set(existingRows.map(r => r.youtube_id));

      // Get current max sort_order for this module
      db.get(
        'SELECT COALESCE(MAX(sort_order), -1) AS maxSort FROM lessons WHERE module_id = ?',
        [moduleId],
        (err3, maxRow) => {
          if (err3) return reject(err3);
          let nextSortOrder = maxRow.maxSort + 1;

          // Collect only genuinely new entries
          const newEntries = entries.filter(e => !existingIds.has(e.videoId));
          if (newEntries.length === 0) return resolve(0);

          const stmt = db.prepare(
            'INSERT INTO lessons (module_id, title, youtube_id, description, sort_order) VALUES (?, ?, ?, ?, ?)'
          );

          let inserted = 0;
          newEntries.forEach((entry) => {
            stmt.run(
              [moduleId, entry.title, entry.videoId, entry.description, nextSortOrder++],
              function (err4) {
                if (err4) {
                  console.error(`    ⚠ Failed to insert ${entry.videoId}: ${err4.message}`);
                } else {
                  inserted++;
                }
              }
            );
          });

          // finalize waits for all queued runs to complete
          stmt.finalize(() => resolve(inserted));
        }
      );
        });
      }
    );
  });
}

module.exports = { syncPlaylists };

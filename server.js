const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { syncPlaylists } = require('./sync-rss');

// ── Environment Config ──────────────────────────────────────
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'gospel_piano.db');
const SYNC_INTERVAL_MS = parseInt(process.env.SYNC_INTERVAL_MS, 10) || 6 * 60 * 60 * 1000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const SYNC_API_KEY = process.env.SYNC_API_KEY || '';
const isDev = process.env.NODE_ENV === 'development';

// ── Middleware ──────────────────────────────────────────────

// Security headers (helmet with relaxed settings for embedded YouTube)
app.use(
  helmet({
    // YouTube requires a valid Referer header to verify the embedding page,
    // especially on iOS Safari which enforces cross-origin referrer policies strictly.
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.youtube.com', 'https://cdn.tailwindcss.com', 'https://s.ytimg.com'],
        // Allow inline event handlers (onmousemove, onclick, etc.) used on phase/lesson cards
        "script-src-attr": null,
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.tailwindcss.com'],
        imgSrc: ["'self'", 'data:', 'https://img.youtube.com', 'https://i.ytimg.com', 'https://yt3.ggpht.com'],
        frameSrc: ["'self'", 'https://www.youtube.com'],
        // YouTube iframe API on Safari/iPad needs connect-src for YouTube
        // YouTube iframe API on Safari/iPad needs connect-src for YouTube
        // Safari enforces connect-src strictly for subdomains the API connects to
        connectSrc: ["'self'", 'https://www.youtube.com', 'https://youtube.com', 'https://i.ytimg.com', 'https://s.ytimg.com', 'https://www.youtube-nocookie.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        mediaSrc: ["'self'", 'https://www.youtube.com', 'https://i.ytimg.com'],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Compression — gzip all responses (after helmet, before routes)
app.use(compression({ level: 6, threshold: 512 }));

// CORS
app.use(cors({ origin: CORS_ORIGIN }));

// Static files with differentiated cache headers
app.use(
  express.static(path.join(__dirname, 'public'), {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (!isDev) {
        if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
          // HTML files: NEVER cache — SW needs fresh HTML on every refresh
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          // Static assets (JS, CSS, images, icons, etc.): 7-day immutable cache
          res.setHeader('Cache-Control', 'public, max-age=' + (7 * 24 * 60 * 60) + ', immutable');
        }
      }
    },
  })
);

// Ensure logs directory exists (for PM2 logs)
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
}

// ── Database Setup ─────────────────────────────────────────
const db = new sqlite3.Database(DB_PATH);

// Log startup config
if (!isDev) {
  console.log(`🔧 Production config: PORT=${PORT} DB=${path.basename(DB_PATH)} SYNC=${Math.round(SYNC_INTERVAL_MS / 60000)}min`);
}

// ── Table Creation ─────────────────────────────────────────
db.serialize(() => {
  // Enable WAL mode and foreign keys (inside serialize for ordering)
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');
  db.run(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT NOT NULL DEFAULT 'Beginner',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      youtube_id TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `);

  // ── Seed Data ────────────────────────────────────────────
  db.get('SELECT COUNT(*) AS count FROM modules', (err, row) => {
    if (err) {
      console.error('Database check error:', err.message);
      return;
    }

    function runInitialSync(retries = 3, delay = 5000) {
      syncPlaylists(db).catch(err => {
        console.error(`📡 Initial sync error: ${err.message} (${retries} retries left)`);
        if (retries > 0) {
          console.log(`  Retrying in ${delay / 1000}s…`);
          setTimeout(() => runInitialSync(retries - 1, delay * 2), delay);
        }
      });
    }

    if (row.count === 0) {
      console.log('🌱 Seeding database with gospel piano curriculum…');
      seedDatabase(() => {
        console.log('📡 Running initial RSS sync…');
        runInitialSync();
      });
    } else {
      // DB already exists — run sync to pick up any new playlist videos
      console.log('📡 Running initial RSS sync…');
      runInitialSync();
    }
  });
});

// ── Seed Function ──────────────────────────────────────────
function seedDatabase(callback) {
  const modules = [
    // ╔══════════════════════════════════════════════════════════╗
    // ║  PHASE 1: FOUNDATION — Absolute Beginner → Beginner  ║
    // ║  Source: Worship Piano Academy Beginner Piano Course  ║
    // ╚══════════════════════════════════════════════════════════╝
    {
      title: 'Worship Piano Fundamentals',
      description: 'Build your foundation: notes, steps, scales, finger placement, and the number system — from Worship Piano Academy.',
      difficulty: 'Absolute Beginner',
      sort_order: 0,
      lessons: [
        { title: 'Lesson 1 — Notes', youtube_id: '1BQHNhbqHbI', description: 'Learn the notes on the piano keyboard — the absolute starting point for every worship pianist.', sort_order: 0 },
        { title: 'Lesson 2 — Steps', youtube_id: 'boI_rOCM9oE', description: 'Understand whole steps and half steps — the building blocks of all scales and chords.', sort_order: 1 },
        { title: 'Lesson 3 — Scales', youtube_id: 'SuGHjnR8M7s', description: 'Master major scales and understand how they form the foundation of worship piano playing.', sort_order: 2 },
        { title: 'Lesson 4 — Finger Placement', youtube_id: '0NWEaFmix5s', description: 'Learn proper finger placement and technique to play smoothly across the keyboard.', sort_order: 3 },
        { title: 'Lesson 5 — Number System', youtube_id: 'blSwr8xp7Q8', description: 'Unlock the Nashville Number System — the universal language for playing worship songs in any key.', sort_order: 4 },
      ],
    },
    {
      title: 'Chords, Inversions & Songs',
      description: 'Build chords, play your first worship song, and master inversions, sus chords, and slash chords.',
      difficulty: 'Beginner',
      sort_order: 1,
      lessons: [
        { title: 'Lesson 6 — Chords', youtube_id: '3CUp8xpKQmM', description: 'Learn how to build chords from scales — the essential skill for playing worship piano.', sort_order: 0 },
        { title: 'Lesson 7 — Playing a Song', youtube_id: 'ceS3OInhrPE', description: 'Put it all together — play your first complete worship song using the chords you have learned.', sort_order: 1 },
        { title: 'Lesson 8 — Inversions', youtube_id: 'Az1H64SuFoo', description: 'Master chord inversions for smooth transitions between chords — essential for flowing worship playing.', sort_order: 2 },
        { title: 'Lesson 9 — Sus Chords', youtube_id: '-0uRHUOZ2zo', description: 'Learn suspended chords and how they create the distinctive sound of modern worship piano.', sort_order: 3 },
        { title: 'Lesson 10 — Slash Chords', youtube_id: 'lmo5TfWuccc', description: 'Master slash chords — playing different bass notes under chords for richer, more professional sound.', sort_order: 4 },
      ],
    },
    {
      title: 'Chord Progressions',
      description: 'Learn essential worship chord progressions and how they connect songs together beautifully.',
      difficulty: 'Beginner',
      sort_order: 2,
      lessons: [
        { title: 'Lesson 11 — Chord Progression 1', youtube_id: 'iGeIbdNX48E', description: 'Learn your first essential worship chord progression — the foundation of countless worship songs.', sort_order: 0 },
        { title: 'Lesson 12 — Chord Progression 2', youtube_id: 'DeHX13kIkkI', description: 'Add a second essential progression to your toolkit — expand your worship playing vocabulary.', sort_order: 1 },
        { title: 'Lesson 13 — Chord Progression 3', youtube_id: 'XDBQhzqqdPY', description: 'Master a third core progression that opens up even more worship songs.', sort_order: 2 },
        { title: 'Lesson 14 — Chord Progression 4', youtube_id: 'TMFHS9WTI1c', description: 'Complete your progression toolkit with this final essential worship chord pattern.', sort_order: 3 },
      ],
    },

    // ╔══════════════════════════════════════════════════════════╗
    // ║  PHASE 2: INTERMEDIATE — Begin → Early Intermediate  ║
    // ║  Source: Worship Piano Academy playlists              ║
    // ╚══════════════════════════════════════════════════════════╝
    {
      title: 'Worship Rhythm Patterns — 3 Note',
      description: 'Master essential 3-note rhythm patterns that make worship piano come alive — from Worship Piano Academy.',
      difficulty: 'Beginner',
      sort_order: 3,
      lessons: [
        { title: '3 Notes — Progression 1', youtube_id: 'ScpUG0dGhao', description: '5 must-know rhythm patterns over a 3-note chord progression — your first patterns for worship piano.', sort_order: 0 },
        { title: '3 Notes — Progression 2', youtube_id: 'SoqzhcMxeTg', description: '5 more rhythm patterns to expand your 3-note chord vocabulary for worship playing.', sort_order: 1 },
        { title: '3 Notes — Progression 3', youtube_id: 'IOaNKP58K2A', description: 'Add these 5 rhythm patterns to your toolkit — essential for creating movement in worship songs.', sort_order: 2 },
        { title: '3 Notes — Progression 4', youtube_id: 'H7sMXK8i1tk', description: '5 more patterns — build your rhythmic confidence over 3-note chord progressions.', sort_order: 3 },
        { title: '3 Notes — Progression 5', youtube_id: 'i83gr9aaxN8', description: 'Complete your 3-note rhythm pattern set — 5 final patterns for worship piano.', sort_order: 4 },
      ],
    },
    {
      title: 'Worship Rhythm Patterns — 4 & 5 Note',
      description: 'Level up with 4 and 5-note rhythm patterns for richer, fuller worship piano playing.',
      difficulty: 'Beginner',
      sort_order: 4,
      lessons: [
        { title: '4 Notes — Progression 1', youtube_id: 'hAgUup0tKzg', description: 'Start expanding to 4-note chords — 5 essential rhythm patterns for fuller worship sound.', sort_order: 0 },
        { title: '4 Notes — Progression 2', youtube_id: 'M_dwR0URAZA', description: '5 more 4-note patterns to diversify your worship piano rhythm vocabulary.', sort_order: 1 },
        { title: '4 Notes — Progression 3', youtube_id: 'Kd8WlPvGqNc', description: 'Continue building your 4-note rhythm arsenal — 5 patterns that sound great in any worship set.', sort_order: 2 },
        { title: '4 Notes — Progression 4', youtube_id: 'FsH5bypqW_A', description: 'Add 5 more 4-note rhythm patterns — keep building your worship piano versatility.', sort_order: 3 },
        { title: '4 Notes — Progression 5', youtube_id: '6W7qFGzCorA', description: 'Complete your 4-note rhythm pattern collection with these 5 final patterns.', sort_order: 4 },
        { title: '5 Notes — Progression 1', youtube_id: 'nnLpNnJRkzY', description: 'Step up to 5-note chord patterns — the rich, full sound of professional worship piano.', sort_order: 5 },
        { title: '5 Notes — Progression 2', youtube_id: '95t6mtpqAb8', description: '5 more 5-note rhythm patterns to make your worship playing sound polished and dynamic.', sort_order: 6 },
        { title: '5 Notes — Progression 3', youtube_id: 'WHkfXYEsMKM', description: 'Master 5 more 5-note patterns — essential for creating movement in worship sets.', sort_order: 7 },
        { title: '5 Notes — Progression 4', youtube_id: '_t7A5nNtoVw', description: 'Continue expanding your 5-note vocabulary — 5 patterns every worship pianist should know.', sort_order: 8 },
        { title: '5 Notes — Progression 5', youtube_id: 'adDHerJ0vdU', description: 'Complete your 5-note rhythm pattern toolkit — all 15 patterns learned across 3 levels.', sort_order: 9 },
      ],
    },
    {
      title: 'Worship Song Tutorials',
      description: 'Learn to play popular worship songs step by step — apply your rhythm patterns to real music.',
      difficulty: 'Beginner',
      sort_order: 5,
      lessons: [
        { title: 'Way Maker — Leeland / Sinach', youtube_id: 'cq4tIHMN6zE', description: 'Learn Way Maker with full piano tutorial + sheet music — one of the most beloved worship songs.', sort_order: 0 },
        { title: 'Goodness of God — Bethel Music', youtube_id: 'k_63w-nyFlw', description: 'Play Goodness of God — complete piano tutorial with sheet music for this worship anthem.', sort_order: 1 },
        { title: 'Great Are You Lord — All Sons & Daughters', youtube_id: 'oLB-T_qkN_w', description: 'Master Great Are You Lord — piano tutorial for a song used in churches worldwide.', sort_order: 2 },
        { title: 'Here I Am to Worship — Tim Hughes / Hillsong', youtube_id: '41yg5krvwxA', description: 'Learn Here I Am to Worship — a timeless worship classic, arranged for piano.', sort_order: 3 },
        { title: 'Reckless Love — Cory Asbury', youtube_id: 'zvNasjmwM2o', description: 'Play Reckless Love with full piano tutorial + sheet music — a modern worship staple.', sort_order: 4 },
        { title: 'See A Victory — Elevation Worship', youtube_id: 'gacDOtFvHFM', description: 'Learn See A Victory with piano tutorial + sheet music — an uplifting worship anthem.', sort_order: 5 },
        { title: 'It Is Well — Kristene DiMarco / Bethel', youtube_id: 'VcGb2sFCIqw', description: 'Play It Is Well — a powerful worship ballad, with full piano tutorial and sheet music.', sort_order: 6 },
        { title: 'Do It Again — Elevation Worship', youtube_id: 'Yk5HFqkUDmY', description: 'Learn Do It Again — complete piano tutorial for this faith-building worship anthem.', sort_order: 7 },
        { title: 'Graves into Gardens — Elevation Worship', youtube_id: '3ZBHEQwvHxI', description: 'Master Graves into Gardens — piano tutorial with sheet music for this popular worship song.', sort_order: 8 },
        { title: 'Won\'t Stop Now — Elevation Worship', youtube_id: 'fHGwjgxJxC8', description: 'Play Won\'t Stop Now — upbeat worship piano tutorial with full sheet music.', sort_order: 9 },
        { title: 'You Deserve It All — Worship Piano Tutorial', youtube_id: 'nv7hs0JugUk', description: 'Learn You Deserve It All — a beautiful worship song arranged for piano.', sort_order: 10 },
        { title: 'Lord I Need You — Gospel Chords & Ending', youtube_id: 'mTCZHjaEjMU', description: 'Add gospel-style chords and a beautiful ending to Lord I Need You — pro tips inside.', sort_order: 11 },
        { title: 'Reckless Love — Israel Houghton Style', youtube_id: 'cOBAWJjDD_g', description: 'Play Reckless Love in the style of Israel Houghton — gospel-influenced arrangement.', sort_order: 12 },
        { title: 'Sound of Freedom — Piano Tutorial', youtube_id: 'cKICKVJCGA0', description: 'Learn Sound of Freedom — a powerful worship piano cover and tutorial.', sort_order: 13 },
      ],
    },
    {
      title: 'Piano Techniques & Riffs',
      description: 'Pro-level techniques: smooth transitions, dynamics, and signature worship piano riffs.',
      difficulty: 'Early Intermediate',
      sort_order: 6,
      lessons: [
        { title: 'Smooth Chord Transitions with Shared Notes', youtube_id: 'f0YSwVds2LY', description: 'Learn the secret to seamless chord changes — use shared notes for professional-sounding transitions.', sort_order: 0 },
        { title: 'Easy Way to Learn Worship Songs', youtube_id: 'r-a4klpY28k', description: 'Break down any worship song quickly — a proven method for beginner pianists.', sort_order: 1 },
        { title: 'The Perfect Piano Riff for Smooth Transitions', youtube_id: 'UcxsaGOYPRk', description: 'One riff that works in 4 different worship songs — add instant polish to your playing.', sort_order: 2 },
        { title: 'Build Dynamics on a 1 Chord', youtube_id: 'G6lHqnSsiNY', description: 'Use this simple rhythm pattern to create dynamics and energy on a single chord.', sort_order: 3 },
        { title: 'How to Play the Melody in Worship Songs', youtube_id: 'gg0X8jzynyg', description: 'Learn to find and play the melody line of any worship song — a game-changer for beginners.', sort_order: 4 },
        { title: 'Add2 & Sus Chords for Worship Piano', youtube_id: '-VFU_hlqrVc', description: 'Master the essential add2 and suspended chord voicings that define modern worship piano.', sort_order: 5 },
        { title: 'Learn 4 Chords — Play 100s of Worship Songs', youtube_id: 'BMn7tDmAa0o', description: 'Unlock hundreds of worship songs with just 4 chords — the ultimate beginner hack.', sort_order: 6 },
        { title: 'Beautiful Piano Riff for \"Holy Forever\"', youtube_id: '5d8T0mwtkxE', description: 'Learn a gorgeous piano riff you can drop into Holy Forever and many other worship songs.', sort_order: 7 },
        { title: 'Suspended (Sus) & Add 4 Chords', youtube_id: 'hgVQ68JtecU', description: 'Master suspended and add4 chord voicings — the secret to that modern worship piano sound.', sort_order: 8 },
      ],
    },

    {
      title: '7th Chords & Extensions',
      description: 'Add dominant 7ths, major 7ths, and 7th chord voicings to your worship piano toolbox — the signature lush sound.',
      difficulty: 'Early Intermediate',
      sort_order: 7,
      lessons: [
        { title: 'Dominant 7th Chords for Worship Piano', youtube_id: 'TOP_w_5nx_4', description: 'Build and apply dominant 7th chords in any key — add tension and release to your worship playing.', sort_order: 0 },
        { title: 'Major 7th Chords — The Lush Sound', youtube_id: 'ZeWO9G6jBbA', description: 'Incorporate major 7th chords into worship progressions for that warm, dreamy modern worship sound.', sort_order: 1 },
        { title: '7th Chord Gospel Piano Hack', youtube_id: 'v0JQL1qFEf4', description: 'The 1-5-7 voicing trick every beginner needs — instantly improve your worship piano flow with 7th chords.', sort_order: 2 },
      ],
    },
    {
      title: 'Sus2, Sus4 & Add9 Chords',
      description: 'Master the suspended and added-note chord voicings that define the signature sound of modern worship piano.',
      difficulty: 'Early Intermediate',
      sort_order: 8,
      lessons: [
        { title: 'Sus2 vs Sus4 — Modernize Your Sound', youtube_id: 'hy3Ku5AcHEA', description: 'Replace standard triads with sus2 and sus4 voicings to create the open, contemporary worship sound.', sort_order: 0 },
        { title: 'Add9 Chords for Worship Piano', youtube_id: 'MtI-sbD91AQ', description: 'Add the 9th to your triads for that warm, inspirational texture heard in modern worship arrangements.', sort_order: 1 },
      ],
    },

    // ╔══════════════════════════════════════════════════════════╗
    // ║  PHASE 3: CONTEMPORARY WORSHIP                        ║
    // ╚══════════════════════════════════════════════════════════╝
    {
      title: 'Passing Chords & Diminished Harmony',
      description: 'Add rich passing chords, diminished harmony, and secondary dominants — the gospel language.',
      difficulty: 'Intermediate',
      sort_order: 9,
      lessons: [
        { title: 'What Are Passing Chords?', youtube_id: 'yxLf7nLGBcM', description: 'Understand the role of passing chords in gospel piano — how they bridge primary chords with tension and release.', sort_order: 0 },
        { title: 'Diminished Passing Chords', youtube_id: 'H0zGr3Srbms', description: 'Use diminished chords to walk between primary chords — the most characteristic gospel passing technique.', sort_order: 1 },
        { title: 'Dominant & Secondary Dominants', youtube_id: 'rAVuZy5Ned0', description: 'Add tension and forward motion with dominant and secondary dominant passing chords.', sort_order: 2 },
        { title: 'Chromatic Walk-Ups & Bass Movement', youtube_id: 'WHYHjrhSlyU', description: 'Smooth chromatic bass movement between chord changes — essential for traditional gospel sound.', sort_order: 3 },
      ],
    },
    {
      title: 'Reharmonization & Tritone Substitutions',
      description: 'Reharmonize songs, master tritone substitutions, and explore modal interchange and altered dominants.',
      difficulty: 'Intermediate',
      sort_order: 10,
      lessons: [
        { title: 'Reharmonization Techniques', youtube_id: '-zBrdXHQQF8', description: 'Learn to reharmonize hymns and gospel songs — replace basic chords with rich, sophisticated harmony.', sort_order: 0 },
        { title: 'Tritone Substitutions in Gospel', youtube_id: 'jrpkBwLkgWw', description: 'Master the game-changing tritone substitution and add chromatic tension to your progressions.', sort_order: 1 },
        { title: 'Modal Interchange & Borrowed Chords', youtube_id: 'Zj01ClJVqWk', description: 'Borrow chords from parallel modes to create unexpected, emotional harmonic shifts in your playing.', sort_order: 2 },
        { title: 'Altered Dominants & Upper Structure Triads', youtube_id: 'ySXJVu-TrtI', description: 'Use altered extensions and upper structure triads for the most sophisticated gospel/jazz voicings.', sort_order: 3 },
      ],
    },
    {
      title: 'Shout Music & Praise Breaks',
      description: 'Master the rhythmic and harmonic blueprint of shout music, praise breaks, and driving gospel energy.',
      difficulty: 'Intermediate',
      sort_order: 11,
      lessons: [
        { title: 'Shout Music Fundamentals', youtube_id: 'Ma_90BRPSww', description: 'The rhythmic and harmonic blueprint of shout music — the driving force of uptempo gospel.', sort_order: 0 },
        { title: 'Classic Shout Runs', youtube_id: 'CgtlowA6WVE', description: 'Essential shout runs every gospel pianist should know — the signature licks of uptempo gospel music.', sort_order: 1 },
        { title: 'Praise Break Transitions', youtube_id: 'GMwr0KvOscc', description: 'Smoothly move between worship ballad and uptempo praise — master the build-up and release.', sort_order: 2 },
        { title: 'Left-Hand Bass Patterns for Gospel', youtube_id: 'YSn6RTGxfao', description: 'Driving left-hand bass riffs and patterns that anchor shout music and give it relentless energy.', sort_order: 3 },
      ],
    },
    {
      title: 'Contemporary Worship & Modern Gospel',
      description: 'Modern worship textures, contemporary progressions, vamps, and neo-soul gospel harmony.',
      difficulty: 'Intermediate',
      sort_order: 12,
      lessons: [
        { title: 'Modern Worship Piano: Pads & Textures', youtube_id: '_IAiDLrl3v4', description: 'Create ambient pads, synth textures, and modern worship soundscapes on piano and keys.', sort_order: 0 },
        { title: 'Contemporary Gospel Chord Progressions', youtube_id: '6xhWaCFaYY4', description: 'Learn the chord progressions and voicings used in contemporary gospel and worship music.', sort_order: 1 },
        { title: 'Building Gospel Piano Vamps', youtube_id: 'XUQqIfuZFWo', description: 'Master the art of the vamp — cycling progressions that build energy and create spontaneous moments.', sort_order: 2 },
        { title: 'Neo-Soul Chords for Gospel Piano', youtube_id: 'f2t0l-r0rIA', description: 'Learn the lush neo-soul chord voicings that define modern gospel — used by Cory Henry and contemporaries.', sort_order: 3 },
      ],
    },

    // ╔══════════════════════════════════════════════════════════╗
    // ║  PHASE 4: WORSHIP LEADING — Intermediate → Advanced   ║
    // ╚══════════════════════════════════════════════════════════╝
    {
      title: 'Rootless Voicings & Advanced Harmony',
      description: 'Rootless voicings, neo-soul harmony, and the call-and-response tradition of gospel piano.',
      difficulty: 'Advanced',
      sort_order: 13,
      lessons: [
        { title: 'Rootless Chord Voicings for Gospel & Jazz', youtube_id: 'XKcWXv1Ui28', description: 'Master rootless voicings — essential for playing with a bass player and achieving a clean modern sound.', sort_order: 0 },
        { title: 'Neo-Soul Gospel Progressions', youtube_id: '7i7oSTXhndE', description: 'Explore the sophisticated neo-soul chord progressions that define the sound of modern gospel music.', sort_order: 1 },
        { title: 'Call & Response Phrasing', youtube_id: 'xd5tgQSbIZ4', description: 'Master the conversational call-and-response style of traditional gospel improvisation and quartet playing.', sort_order: 2 },
      ],
    },
    {
      title: 'Advanced Improvisation & Performance',
      description: 'Solo confidently, lock in with a band, and perform in the style of gospel greats like Fred Hammond.',
      difficulty: 'Advanced',
      sort_order: 14,
      lessons: [
        { title: 'Soloing Over Full Gospel Progressions', youtube_id: 'kn9dfj2RAU8', description: 'Put it all together — improvise over full gospel chord progressions with confidence and musicality.', sort_order: 0 },
        { title: 'Playing with a Band: Locking In', youtube_id: 'thAOQQI_nTk', description: 'Learn how to lock in with drums and bass — essential for any gospel keyboardist playing with a band.', sort_order: 1 },
        { title: 'Fred Hammond Style Gospel Piano', youtube_id: 'qVOZoSsjPI0', description: 'Learn to play in the style of Fred Hammond — one of contemporary gospel music greatest innovators.', sort_order: 2 },
      ],
    },

    // ╔══════════════════════════════════════════════════════════╗
    // ║  PHASE 5: MASTERY & MINISTRY — Advanced               ║
    // ╚══════════════════════════════════════════════════════════╝
    {
      title: 'Artist Styles: Cory Henry, Kirk Franklin, Israel Houghton & More',
      description: 'Study the harmonic language and techniques of the most influential modern gospel keyboardists and bandleaders.',
      difficulty: 'Advanced',
      sort_order: 15,
      lessons: [
        { title: 'Cory Henry Style: Jazz-Gospel Fusion', youtube_id: 'mZmhnMZUag0', description: 'Deconstruct the harmonic language and improvisational genius of Cory Henry — the modern gospel/jazz master.', sort_order: 0 },
        { title: 'Kirk Franklin Style: Gospel Jazz Chords & Passing Progressions', youtube_id: '6WizC1IEZZQ', description: 'Master the jazz-influenced gospel chord substitutions, syncopated rhythms and passing chords that define Kirk Franklin arrangements.', sort_order: 1 },
        { title: 'Israel Houghton Style: Modern Worship & Anthem Piano', youtube_id: 'hLyY9cVdvU8', description: 'Learn the lush quartal voicings, anthem-driven energy, and contemporary worship piano style of Israel Houghton.', sort_order: 2 },
        { title: 'Jason White & Mike Bereal Style', youtube_id: 'DZh1IAySnMo', description: 'Learn the complex reharmonizations and church bebop style of gospel legends Jason White and Mike Bereal.', sort_order: 3 },
        { title: 'Leading Worship from the Piano', youtube_id: '5fgBy-O4bso', description: 'Develop the confidence and skills to lead a worship set from the piano with authority and musicality.', sort_order: 4 },
        { title: 'Musical Direction & Talk Music', youtube_id: 'W1Ivj4sDlO4', description: 'Learn the keyboardist role in guiding the band — setting tone, signaling changes, and holding down talk music.', sort_order: 5 },
      ],
    },
    {
      title: 'Worship Flow & Service Leadership',
      description: 'Master spontaneous modulation, following singers, and creating seamless worship service transitions.',
      difficulty: 'Advanced',
      sort_order: 16,
      lessons: [
        { title: 'Spontaneous Modulation: Smooth Key Changes', youtube_id: 'vVu3HAkJ5cw', description: 'Unlock the secrets of changing keys smoothly during worship — essential for spontaneous moments.', sort_order: 0 },
        { title: 'Following Singers & Accompanying Vocalists', youtube_id: 'QYlQ4r5mVmo', description: 'Master breath, flow, and feel — how to follow a singer sensitively and support them with the piano.', sort_order: 1 },
        { title: 'Worship Transitions & Service Flow', youtube_id: 'eX_PLnB0lMc', description: 'Learn to create seamless transitions between songs and moments — the mark of a professional church musician.', sort_order: 2 },
      ],
    },
  ];

  const insertModule = db.prepare(
    'INSERT INTO modules (title, description, difficulty, sort_order) VALUES (?, ?, ?, ?)'
  );
  const insertLesson = db.prepare(
    'INSERT INTO lessons (module_id, title, youtube_id, description, sort_order) VALUES (?, ?, ?, ?, ?)'
  );

  // Run inserts serially since sqlite3 is async
  let completed = 0;
  const totalModules = modules.length;

  modules.forEach((mod) => {
    insertModule.run([mod.title, mod.description, mod.difficulty, mod.sort_order], function (err) {
      if (err) {
        console.error('Seed error (module):', err.message);
        return;
      }
      const moduleId = this.lastID;

      mod.lessons.forEach((lesson) => {
        insertLesson.run(
          [moduleId, lesson.title, lesson.youtube_id, lesson.description, lesson.sort_order],
          (err2) => {
            if (err2) console.error('Seed error (lesson):', err2.message);
          }
        );
      });

      completed++;
      if (completed === totalModules) {
        insertModule.finalize();
        insertLesson.finalize();
        const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
        console.log(`✅ Database seeded with ${totalModules} modules and ${totalLessons} lessons.`);
        if (callback) callback();
      }
    });
  });
}

// ── API Routes ─────────────────────────────────────────────

// Health check endpoint for monitoring / uptime checks
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

app.get('/api/modules', (req, res) => {
  db.all('SELECT * FROM modules ORDER BY sort_order', (err, modules) => {
    if (err) {
      console.error('API error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    db.all('SELECT * FROM lessons ORDER BY module_id, sort_order', (err2, lessons) => {
      if (err2) {
        console.error('API error:', err2.message);
        return res.status(500).json({ error: 'Database error' });
      }

      const result = modules.map((mod) => ({
        ...mod,
        lessons: lessons.filter((l) => l.module_id === mod.id),
      }));

      res.json(result);
    });
  });
});

// ── Auth Middleware ───────────────────────────────────────
// Simple shared-secret check for mutation endpoints.
// Set SYNC_API_KEY env var on the server; pass it via x-api-key header.
function requireSyncAuth(req, res, next) {
  // If no API key is configured, allow the request (dev mode)
  if (!SYNC_API_KEY) {
    return next();
  }
  const key = req.headers['x-api-key'];
  if (!key || key !== SYNC_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── RSS Sync Endpoint ─────────────────────────────────────
app.post('/api/sync', requireSyncAuth, (req, res) => {
  console.log('🔄 Manual RSS sync triggered');
  syncPlaylists(db)
    .then((results) => {
      res.json({
        success: true,
        added: results.added,
        errors: results.errors,
        playlists: results.playlistResults,
      });
    })
    .catch((err) => {
      console.error('Sync error:', err.message);
      res.status(500).json({ success: false, error: 'Sync failed' });
    });
});

// ── 404 Catch-All ─────────────────────────────────────────
// Must be after all routes — serves custom 404 page
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ── Global Error Handler ────────────────────────────────────
// Express identifies this as an error handler because of the 4 params
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  if (isDev) {
    console.error(err.stack);
  }
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// ── Start Server ───────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🎹 Worship Piano server running at http://localhost:${PORT}`);
});

// ── Scheduled RSS Sync (every 6 hours, no overlap) ────────
let syncing = false;
function scheduleNextSync() {
  setTimeout(function runSync() {
    if (syncing) {
      console.log('⏰ Skipping scheduled sync — previous sync still running');
      scheduleNextSync();
      return;
    }
    syncing = true;
    console.log('⏰ Scheduled RSS sync triggered');
    syncPlaylists(db)
      .catch(err => console.error('Scheduled sync error:', err.message))
      .finally(() => {
        syncing = false;
        scheduleNextSync();
      });
  }, SYNC_INTERVAL_MS);
}
scheduleNextSync();

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port or stop the other process.`);
    process.exit(1);
  } else {
    console.error('Server error:', err.message);
    process.exit(1);
  }
});

// ── Graceful Shutdown ──────────────────────────────────────
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down…');
  db.close((err) => {
    if (err) console.error('DB close error:', err.message);
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  db.close(() => process.exit(0));
});

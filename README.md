# 🎹 Gospel Piano Learning Platform

A self-hosted, browser-based worship piano curriculum with interactive YouTube lessons, progress tracking, and achievement badges. Progress through five phases — from your first note to leading worship and mastering your ministry.

> Built in collaboration with Codebuff AI — all 17 modules, 88+ lessons, and features were developed through conversational coding.

---

## 📸 Screenshots

> *Add your own screenshots here by pasting images into this section.*

**Suggested screens to capture:**
- **Home page** — Phase card grid with progress bars (`http://localhost:3000`)
- **Lesson view** — Module cards with thumbnails, WPA badges, difficulty tags
- **Video player** — Side-by-side layout with playback controls, sections, and progress tabs
- **Curriculum page** — Full 5-phase breakdown (`http://localhost:3000/curriculum.html`)
- **Mobile view** — Hamburger menu, global search, responsive layout

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Server** | Express |
| **Database** | SQLite (via `sqlite3`) |
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Styling** | Tailwind CSS (CDN) |
| **Video** | YouTube IFrame API |
| **Content Sync** | YouTube RSS feeds → `sync-rss.js` |
| **Git Hooks** | Pre-commit syntax check (`node --check`) |

**No build step, no bundler, no framework** — just `node server.js` and you're running.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or later
- npm (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone <your-repo-url> gospel-piano
cd gospel-piano

# Install dependencies
npm install

# Start the server
node server.js
```

The app is now running at **[http://localhost:3000](http://localhost:3000)**.

On first launch, the database is seeded with 17 modules and 88+ lessons. The server then auto-syncs with Worship Piano Academy's YouTube playlists to pick up any new videos.

### Development

```bash
# The pre-commit hook checks JavaScript syntax before every commit
# It runs automatically — no setup needed

# Force a manual syntax check:
node --check server.js
node --check sync-rss.js
node --check public/app.js
```

---

## 📖 Curriculum

Five phases, 17 modules, 88+ video lessons:

| Phase | Modules | Focus |
|-------|---------|-------|
| 🌱 **Foundations** | 3 | Notes, chords, inversions, first worship songs |
| 🔧 **Worship Foundations** | 6 | Rhythm patterns, 7th chords, sus/add9, song tutorials, techniques |
| 🎹 **Contemporary Worship** | 4 | Passing chords, reharmonization, shout music, modern gospel |
| 🚀 **Worship Leading** | 2 | Rootless voicings, improvisation, performance |
| 👑 **Mastery & Ministry** | 2 | Artist styles, worship leadership, service flow |

**Source attribution:** Modules marked with 📺 WPA use videos from Worship Piano Academy's YouTube channel. Other modules use curated tutorials from various gospel/worship piano educators.

Full curriculum breakdown: **[http://localhost:3000/curriculum.html](http://localhost:3000/curriculum.html)**

---

## ✨ Features

### Video Player
- **YouTube embedding** — with graceful fallback when embedding is disabled
- **Picture-in-Picture mini player** — keeps playing while you browse lessons
- **A/B Loop** — set loop points to practice specific sections
- **Playback speed** — 0.5×, 0.75×, 1×
- **Section bookmarks** — save timestamps with labels
- **Keyboard shortcuts** — Space (play/pause), ← → (prev/next), ↑ ↓ (speed)

### Progress & Motivation
- **Manual or auto-complete** — click the checkbox or watch 90% of a video
- **Per-phase progress bars** — track your journey through each phase
- **Achievement badges** — earn badges for completing modules and phases
- **Floating progress ring** — always-visible overall progress
- **Jump back in** — hero button takes you to your next incomplete lesson

### Navigation & Discovery
- **Global search** — search all 88+ lessons by title from the header
- **Responsive design** — desktop (side-by-side), tablet, mobile layouts
- **Hamburger menu** — progress stats and reset on mobile
- **Breadcrumb trail** — always know where you are

### Content Management
- **RSS auto-sync** — fetches new videos from WPA playlists on startup + every 6 hours
- **Manual sync endpoint** — `POST /api/sync` to force a refresh
- **Playlist config** — `playlist-modules.json` maps YouTube playlists to modules

---

## 📁 Project Structure

```
gospel-piano/
├── server.js              # Express server, SQLite, API routes, seed data
├── sync-rss.js            # YouTube RSS feed fetcher & upsert logic
├── playlist-modules.json  # Maps YouTube playlists → module sort_orders
├── package.json           # Dependencies (express, sqlite3, cors)
├── .gitignore             # Ignores node_modules, DB files, logs
├── .git/
│   └── hooks/
│       └── pre-commit     # Checks JS syntax before commits
└── public/
    ├── index.html         # Main app UI (header, views, CSS, modals)
    ├── app.js             # All client-side logic (phases, player, search, PiP)
    └── curriculum.html    # Full curriculum overview page
```

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/modules` | Returns all modules with nested lessons |
| `POST` | `/api/sync` | Triggers RSS sync from WPA playlists |
| `GET` | `/curriculum.html` | Static curriculum overview page |

---

## 🔄 Keeping Content Fresh

The app auto-syncs with Worship Piano Academy's YouTube playlists:

1. **On server start** — syncs all 4 WPA playlists
2. **Every 6 hours** — `setInterval` triggers background sync
3. **Manual** — `curl -X POST http://localhost:3000/api/sync`

New videos are appended to the correct module with sequential sort order. Existing videos are detected by `youtube_id` and never duplicated.

To add a new playlist:
1. Add an entry to `playlist-modules.json` with the YouTube playlist ID and target module sort_orders
2. Restart the server — new videos appear automatically

---

## 📝 License

This project is for personal educational use. Video content is owned by their respective creators (Worship Piano Academy and others).

---

## 🙏 Credits

- **Worship Piano Academy** — Core video curriculum for Foundations and Worship Foundations phases
- **Various gospel/worship educators** — Additional tutorial videos in later phases
- **Codebuff AI** — All code was pair-programmed through conversational AI

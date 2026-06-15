# 🎹 Worship Piano Learning Platform

A self-hosted, browser-based worship piano curriculum with interactive YouTube lessons, progress tracking, metronome, and achievement badges. Progress through five phases — from your first note to leading worship and mastering your ministry.

> Built in collaboration with Codebuff AI — all 17 modules, 88+ lessons, and features were developed through conversational coding.

---

## 📸 Screenshots

> *Add your own screenshots here by pasting images into this section.*

**Suggested screens to capture:**
- **Home page** — Phase card grid with progress bars (`http://localhost:3000`)
- **Lesson view** — Module cards with thumbnails, difficulty tags
- **Video player** — Side-by-side layout with playback controls, sections, and progress tabs
- **Metronome page** — Standalone metronome (`http://localhost:3000/metronome.html`)
- **Curriculum page** — Full 5-phase breakdown (`http://localhost:3000/curriculum.html`)
- **Mobile view** — Hamburger menu, global search, responsive layout

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js ≥18 |
| **Server** | Express |
| **Database** | SQLite (via `sqlite3`) |
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | Custom inline SVGs (no icon library dependency) |
| **Video** | YouTube IFrame API |
| **Process Manager** | PM2 (optional, recommended for production) |
| **Git Hooks** | Pre-commit syntax check (`node --check`) |

**No build step, no bundler, no framework** — just `node server.js` and you're running.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/graciousnm/worship-piano.git
cd worship-piano

# Install dependencies
npm install

# Start the server
node server.js
```

The app is now running at **[http://localhost:3000](http://localhost:3000)**.

On first launch, the database is seeded with 17 modules and 88+ lessons.

### Development Mode

```bash
npm run dev
```

This sets `NODE_ENV=development` which disables caching for easier live-reloading.

### Production Mode

```bash
NODE_ENV=production node server.js
```

Or use PM2 for process management (recommended):

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Save the process list so it auto-starts on reboot
pm2 save
pm2 startup
```

---

## 🔧 Configuration

Copy `.env.example` to `.env` and customize:

```env
PORT=3000
NODE_ENV=production
DB_PATH=gospel_piano.db
CORS_ORIGIN=*               # Set to your domain in production
```

---

## 📖 Curriculum

Five phases, 17 modules, 88+ video lessons:

| Phase | Modules | Focus |
|-------|---------|-------|
| **Foundations** | 3 | Notes, chords, inversions, first worship songs |
| **Worship Foundations** | 6 | Rhythm patterns, 7th chords, sus/add9, song tutorials, techniques |
| **Contemporary Worship** | 4 | Passing chords, reharmonization, shout music, modern gospel |
| **Worship Leading** | 2 | Rootless voicings, improvisation, performance |
| **Mastery & Ministry** | 2 | Artist styles, worship leadership, service flow |

The lesson videos linked in this curriculum are publicly available on YouTube, created by various worship piano educators. This platform organizes and sequences these free resources into a structured learning path.

Full curriculum breakdown: **[http://localhost:3000/curriculum.html](http://localhost:3000/curriculum.html)**

---

## ✨ Features

### 🎥 Video Player
- **YouTube embedding** — with graceful fallback when embedding is disabled
- **Picture-in-Picture mini player** — keeps playing while you browse lessons
- **A/B Loop** — set loop points to practice specific sections
- **Playback speed** — 0.5×, 0.75×, 1×
- **Section bookmarks** — save timestamps with labels
- **Keyboard shortcuts** — Space (play/pause), ← → (prev/next), ↑ ↓ (speed)

### 🥁 Built-in Metronome
- **Standalone metronome page** — practice without a video at `/metronome.html`
- **Video metronome** — embedded in the playback tab alongside controls
- **BPM slider** (30-240) with number input and tempo presets (Largo → Vivace)
- **Tap tempo** — tap to set the beat naturally
- **Time signatures** — 4/4, 3/4, 6/8, 2/4 with accent on beat 1
- **Beat indicator** — visual flash + pulsing circle + bar visualizer
- **Keyboard shortcut** — Space to toggle start/stop

### 📊 Progress & Motivation
- **Manual or auto-complete** — click the checkbox or watch 90% of a video
- **Per-phase progress bars** — track your journey through each phase
- **Achievement badges** — earn badges for completing modules and phases
- **Floating progress ring** — always-visible overall progress
- **Jump back in** — hero button takes you to your next incomplete lesson

### 🔍 Navigation & Discovery
- **Global search** — search all 88+ lessons by title from the header
- **Responsive design** — desktop (side-by-side), tablet, mobile layouts
- **Hamburger menu** — progress stats and reset on mobile
- **Breadcrumb trail** — always know where you are

### 🛡️ Production Features
- **Compression** — gzip for all responses (saves ~75% bandwidth)
- **Security headers** — CSP, HSTS, X-Content-Type-Options via Helmet
- **Caching** — static files cached for 7 days in production
- **Custom error pages** — styled 404 and 500 pages
- **Health endpoint** — `GET /api/health` for uptime monitoring
- **PM2 ecosystem** — process management, auto-restart, log rotation
- **Graceful shutdown** — clean database close on SIGINT/SIGTERM
- **SVG favicon** — piano keyboard icon in browser tabs

### 🎨 Design
- **Dark theme** — ambient gold accents on a zinc background
- **Custom SVG icons** — clean, consistent icons throughout the UI
- **Smooth animations** — view transitions, hover effects, loading states
- **Mobile-optimized** — touch targets, compact headers, full-width toasts

---

## 📁 Project Structure

```
worship-piano/
├── server.js              # Express server, SQLite, API routes, seed data
├── ecosystem.config.js    # PM2 process manager configuration
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (PORT, DB_PATH, etc.)
├── .env.example           # Documented example env file
├── .gitignore             # Ignores node_modules, DB files, logs, .env
└── public/
    ├── index.html         # Main app UI (header, views, CSS, modals)
    ├── app.js             # All client-side logic (phases, player, search, PiP, metronome)
    ├── curriculum.html    # Full curriculum overview page
    ├── metronome.html     # Standalone metronome page
    ├── credits.html       # Credits & acknowledgements page
    ├── favicon.svg        # Piano keyboard SVG favicon
    ├── 404.html           # Custom 404 error page
    └── 500.html           # Custom 500 error page
```

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check with uptime, environment, version |
| `GET` | `/api/modules` | Returns all modules with nested lessons |
| `GET` | `/curriculum.html` | Static curriculum overview page |
| `GET` | `/credits.html` | Credits & acknowledgements |
| `GET` | `/metronome.html` | Standalone metronome tool |

---

## 🌐 Deployment (Oracle Free Tier & VPS)

This app is extremely lightweight and runs comfortably on **Oracle Cloud free tier** (1 GB RAM, 1/8 OCPU) or any small VPS.

### Quick Deploy

```bash
# SSH into your server
ssh ubuntu@your-server-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/graciousnm/worship-piano.git
cd worship-piano
npm install
cp .env.example .env
# Edit .env to set CORS_ORIGIN to your domain and PORT as needed

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup  # Auto-start on reboot
```

### Resource Usage

On the Oracle free tier:
- **RAM:** ~50-80 MB (leaves 920+ MB for other apps)
- **CPU:** Near idle when not serving requests
- **Disk:** ~100 MB for code + ~5 MB for SQLite database

### Reverse Proxy (to serve on port 80/443)

```bash
# Install Nginx
sudo apt install -y nginx

# Configure
sudo nano /etc/nginx/sites-available/worship-piano
```

Basic nginx config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/worship-piano /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

For HTTPS, use Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Additional Pages

After deployment, these pages are available:
- **https://your-domain.com/** — Main app with video player
- **https://your-domain.com/curriculum.html** — Full curriculum overview
- **https://your-domain.com/metronome.html** — Standalone metronome
- **https://your-domain.com/credits.html** — Credits & acknowledgements
- **https://your-domain.com/api/health** — Health check endpoint

---

## 📝 License

This project is for personal educational use. Video content is owned by their respective YouTube creators. This platform simply organizes and sequences free, publicly available resources into a structured learning path.

---

## 🙏 Credits

- **YouTube Educators** — All lesson videos are publicly available tutorials from various worship piano educators on YouTube
- **Open Source** — Built with Node.js, Express, SQLite, Tailwind CSS, and other free open-source tools
- **Oracle Cloud** — Generous free-tier hosting keeps this platform accessible at no cost
- **Codebuff AI** — All code was pair-programmed through conversational AI

---

*Made with ❤️ for worship musicians everywhere.*

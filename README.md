# 🎹 Worship Piano Learning Platform

A self-hosted, browser-based worship piano curriculum with interactive YouTube lessons, progress tracking, a built-in metronome, achievement badges, and PWA support. Progress through five phases — from your first note to leading worship and mastering your ministry.

> Built in collaboration with Codebuff AI — all 17 modules, 88+ lessons, and features were developed through conversational coding.

**Live site:** [https://worship-piano.mooo.com](https://worship-piano.mooo.com)

---

## 📸 Screenshots

> *Add your own screenshots here by pasting images into this section.*

**Suggested screens to capture:**
- **Home page** — Phase card grid with progress bars (`https://worship-piano.mooo.com`)
- **Lesson view** — Module cards with thumbnails, difficulty tags
- **Video player** — Side-by-side layout with playback controls, sections, and progress tabs
- **Metronome page** — Standalone metronome with tap tempo (`/metronome.html`)
- **Curriculum page** — Full 5-phase breakdown (`/curriculum.html`)
- **Mobile view** — Hamburger menu, global search, responsive layout

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
npm start
```

The app is now running at **[http://localhost:3000](http://localhost:3000)**.

On first launch, the database is seeded with 17 modules and 88+ lessons.

### Development Mode

```bash
npm run dev
```

Sets `NODE_ENV=development` which disables caching for easier live-reloading.

### Production Mode

```bash
NODE_ENV=production node server.js
```

For long-running production deployments, run the server under the process supervisor of your choice.

---

## 🔧 Configuration

Copy `.env.example` to `.env` and set the environment variables to match your deployment. See `.env.example` for the full list.

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

Full curriculum breakdown: **[https://worship-piano.mooo.com/curriculum.html](https://worship-piano.mooo.com/curriculum.html)**

---

## ✨ Features

### 🎥 Video Player
- **YouTube embedding** — with graceful fallback when embedding is disabled
- **Picture-in-Picture mini player** — keeps playing while you browse lessons
- **A/B Loop** — set loop points to practice specific sections
- **Playback speed** — 0.5×, 0.75×, 1×
- **Section bookmarks** — save timestamps with labels
- **Keyboard shortcuts** — Space (play/pause), ← → (prev/next lesson), ↑ ↓ (speed)

### 🥁 Built-in Metronome
- **Standalone metronome page** — practice without a video at `/metronome.html`
- **Video metronome** — embedded in the playback tab alongside controls
- **BPM slider** (30-240) with number input
- **Tap tempo** — tap to set the beat naturally
- **Time signatures** — 4/4, 3/4, 6/8, 2/4 with accent on beat 1
- **Beat indicator** — visual flash + pulsing circle
- **Keyboard shortcut** — Space to toggle start/stop

### 📊 Progress & Motivation
- **Manual or auto-complete** — click the checkbox or watch 90% of a video
- **Per-phase progress bars** — track your journey through each phase
- **Achievement badges** — earn badges for completing modules and phases
- **Floating progress ring** — always-visible overall progress
- **Jump back in** — hero button takes you to your next incomplete lesson
- **Practice notes** — per-lesson markdown notes saved to localStorage

### 🔍 Navigation & Discovery
- **Global search** — search all 88+ lessons by title from the header
- **Responsive design** — desktop (side-by-side), tablet, mobile layouts
- **Hamburger menu** — progress stats, navigation links, and reset on mobile/tablet

### 📱 Progressive Web App
- **Installable** — manifest, service worker, maskable icons
- **Offline support** — service worker caches core app shell for offline access
- **iOS PWA** — custom splash screens, standalone mode, install instructions modal
- **Update notifications** — toast prompts when a new version is available
- **Proactive install banner** — prompts users to install on Chrome and iOS

### 🎨 Design
- **Dark theme** — ambient gold accents on a zinc background
- **Custom SVG icons** — clean, consistent icons throughout the UI
- **Smooth animations** — view transitions, hover effects, loading states
- **Mobile-optimized** — touch targets, compact headers, full-width toasts

---

## 📝 License

This project is for personal educational use. Video content is owned by their respective YouTube creators. This platform simply organizes and sequences free, publicly available resources into a structured learning path.

---

## 🙏 Credits

- **YouTube Educators** — All lesson videos are publicly available tutorials from various worship piano educators on YouTube
- **Open Source** — Built with free, community-supported open-source tools
- **Codebuff AI** — All code was pair-programmed through conversational AI

---

*Made with ❤️ for worship musicians everywhere.*

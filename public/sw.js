// ═══════════════════════════════════════════════════════════════
//  Worship Piano — Service Worker
//  Caches static assets for offline access and faster loading.
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'worship-piano-v2';

// Files to cache on install — the core app shell
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/app.js?v=2',
  '/favicon.svg',
  '/tailwind.css',
  '/manifest.json',
  '/curriculum.html',
  '/metronome.html',
  '/credits.html',
  '/404.html',
  '/500.html',
];

// ── Install: pre-cache the app shell ────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Activate immediately — don't wait for page reload
  self.skipWaiting();
});

// ── Activate: clean up old caches ──────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all open pages immediately
  self.clients.claim();
});

// ── Fetch: network-first for HTML/JS, cache-first for assets ─
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests (CDN, YouTube, etc.) — let the browser handle them
  // The SW's fetch() for cross-origin URLs is blocked by CSP connect-src 'self'
  if (url.origin !== self.location.origin) return;

  // Don't cache API calls — they need fresh data
  if (url.pathname.startsWith('/api/')) return;

  // Determine if this is a navigation (HTML) or JS request
  const isNavigation = event.request.mode === 'navigate';
  const isJS = url.pathname.endsWith('.js');
  const isHTML = url.pathname.endsWith('.html') || url.pathname === '/';

  if (isNavigation || isJS || isHTML) {
    // ── Network-first for HTML & JS ───────
    // Always fetch the latest from server. Cache as fallback for offline.
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' }).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // ── Cache-first for static assets ────
    // Serve from cache immediately, update in background.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request, { cache: 'no-cache' }).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});

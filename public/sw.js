// ═══════════════════════════════════════════════════════════════
//  Worship Piano — Service Worker
//  Caches static assets for offline access and faster loading.
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'worship-piano-v1';

// Files to cache on install — the core app shell
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/favicon.svg',
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

// ── Fetch: serve from cache, fall back to network ──────────
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't cache API calls — they need fresh data
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached response immediately, then update cache in background
      const fetchPromise = fetch(event.request).then((response) => {
        // Only cache valid responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

/**
 * ExamSaathi Service Worker v1
 * Cache-first for static assets, network-first for navigation.
 */
// Bump these versions whenever any cached file changes, otherwise installed
// copies keep serving the old files (assets are served cache-first).
const CACHE_STATIC = 'examsaathi-static-v6';
const CACHE_DATA   = 'examsaathi-data-v6';

const PRECACHE = [
  './', './index.html', './manifest.json',
  './assets/css/fonts.css',
  './assets/fonts/NotoSansDevanagari/NotoSansDevanagari-Devanagari-Variable.woff2',
  './assets/fonts/NotoSansDevanagari/NotoSansDevanagari-Latin-Variable.woff2',
  './assets/fonts/Inter/Inter-Latin-Variable.woff2',
  './assets/icons/icon.svg', './assets/icons/icon-192.png',
  './assets/icons/icon-512.png', './assets/icons/icon-maskable.png',
  './assets/icons/apple-touch-icon.png',
  './assets/css/reset.css', './assets/css/variables.css',
  './assets/css/animations.css', './assets/css/layout.css',
  './assets/css/components.css', './assets/css/hindi.css',
  './assets/js/core/storage.js', './assets/js/core/state.js',
  './assets/js/core/i18n.js', './assets/js/core/question-bank.js',
  './assets/js/core/app.js',
  './assets/js/modules/auth.js', './assets/js/modules/quiz-engine.js',
  './assets/js/modules/timer.js', './assets/js/modules/streak.js',
  './assets/js/modules/bookmarks.js', './assets/js/modules/analytics.js',
  './assets/js/modules/leaderboard.js', './assets/js/modules/premium.js',
  './assets/js/admin/admin-auth.js', './assets/js/admin/question-manager.js',
  './assets/js/admin/category-manager.js', './assets/js/admin/test-manager.js',
  './assets/js/admin/csv-importer.js',
  './data/haryana-gk.json', './data/general-knowledge.json',
  './data/general-science.json', './data/mathematics.json',
  './data/reasoning.json', './data/english.json',
  './data/hindi-grammar.json', './data/computer-knowledge.json',
  './data/current-affairs.json', './data/mock-tests.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC)
      .then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache partial failure:', err))
  );
});

self.addEventListener('activate', e => {
  const KEEP = new Set([CACHE_STATIC, CACHE_DATA]);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !KEEP.has(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const p = url.pathname;
  const isStatic = /\.(js|css|json|png|svg|ico|woff2?)$/.test(p);

  if (isStatic) {
    e.respondWith(cacheFirst(request));
  } else {
    e.respondWith(networkFirst(request));
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res  = await fetch(req);
    if (res && res.status === 200) {
      const name = req.url.includes('/data/') ? CACHE_DATA : CACHE_STATIC;
      (await caches.open(name)).put(req, res.clone());
    }
    return res;
  } catch { return new Response('', { status: 503 }); }
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      (await caches.open(CACHE_STATIC)).put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const shell = await caches.match('./index.html');
      if (shell) return shell;
    }
    return new Response('', { status: 503 });
  }
}

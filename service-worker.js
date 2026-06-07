/**
 * Service Worker for 戀愛情感導航系統
 * 策略:
 *  - 靜態資源(HTML / icons / manifest / fonts):cache-first,背景更新
 *  - AI 代理請求(workers.dev 的 POST):一律走網路,絕不快取
 *  - 其他 GET:network-first,失敗才用快取
 */

const CACHE_NAME = 'love-navigator-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1) 絕不快取 AI 代理請求(POST 到 workers.dev)
  if (req.method !== 'GET') return;
  if (url.hostname.endsWith('workers.dev')) return;

  // 2) 同源靜態資源:cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((resp) => {
            if (resp && resp.status === 200 && resp.type === 'basic') {
              const clone = resp.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, clone));
            }
            return resp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3) 跨域 GET(Google Fonts、CDN):network-first
  event.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return resp;
      })
      .catch(() => caches.match(req))
  );
});

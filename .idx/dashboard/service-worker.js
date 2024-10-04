const CACHE_NAME = 'desain-web-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/assets/Logo_Unand_PTNBH.png',
  '/about.html',
  '/contact1.html',
  '/offline.html',
  '/service-worker.js'
];

const maxAge = 60 * 60 * 24 * 30; // 30 days

// Install event: Caching resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
  );
});

// Fetch event: Serve cached content if available, fallback to network, or offline page
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {
            const cacheControlHeader = `public, max-age=${maxAge}`;
            networkResponse.headers.set('Cache-Control', cacheControlHeader);
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          })
          .catch(() => {
            return caches.match('/offline.html');
          });
      })
  );
});

// Activate event: Clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME).map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Update cache when static assets change
self.addEventListener('update', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
  );
});
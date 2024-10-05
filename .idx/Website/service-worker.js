const CACHE_NAME = 'desain-web-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/assets/Logo_Unand_PTNBH.png',
  '/about.html',
  '/contact.html',   // Update: Make sure the URL matches the actual file name.
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
        // Return cached response if available
        if (response) {
          return response;
        }

        // Fallback to network
        return fetch(event.request)
          .then(networkResponse => {
            // Clone the response to save it in cache
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });
            return networkResponse;
          })
          .catch(() => {
            // Fallback to offline.html if network fails
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
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

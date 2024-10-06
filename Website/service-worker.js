const CACHE_NAME = 'desain-web-cache-v1';
const urlsToCache = [
  '/',                // root page
  '/index.html',       // main page
  '/styles.css',       // styles
  '/assets/Logo_Unand_PTNBH.png',  // image
  '/about.html',       // about page
  '/contact.html',     // contact page
  '/offline.html',     // offline fallback
  '/service-worker.js' // this service worker
];

const maxAge = 60 * 60 * 24 * 30; // 30 days

// Install event: Cache specified resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
        console.error('Failed to cache:', error);
      })
  );
});

// Fetch event: Serve cached content if available, fallback to network, or offline page
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // Ignore non-GET requests

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Fallback to network and cache the response
        return fetch(event.request)
          .then(networkResponse => {
            // Clone the network response to save it in the cache
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });
            return networkResponse;
          })
          .catch(() => {
            // Fallback to offline.html if network fails
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
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
    .then(() => {
      console.log('Old caches cleared');
    })
    .catch(error => {
      console.error('Failed to clear old caches:', error);
    })
  );
});

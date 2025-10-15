// A version number is used to manage caches.
const CACHE_NAME = 'business-builder-cache-v1';

// A list of all the files and assets the app needs to run offline.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/resources.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap'
];

// --- INSTALL EVENT ---
// This event runs when the service worker is first installed.
// It opens a cache and adds all our essential files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// --- ACTIVATE EVENT ---
// This event runs when the service worker is activated.
// It's used to clean up any old, unused caches from previous versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (CACHE_NAME !== cacheName) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- FETCH EVENT ---
// This event intercepts every network request made by the page.
// It checks if the requested file is in the cache first.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return the cached version.
        // Otherwise, fetch it from the network.
        return response || fetch(event.request);
      })
  );
});
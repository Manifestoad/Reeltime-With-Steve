const CACHE_NAME = 'reel-time-cache-v2'; // Bump version to force update
const urlsToCache = [
  '/',
  '/index.html',
  '/index.jsx',
  '/logo.svg',
  '/manifest.json',
  '/App.jsx',
  '/services/geminiService.js',
  '/services/audioService.js',
  '/services/catchLogService.js',
  '/services/catchLimitService.js',
  '/components/Dashboard.jsx',
  '/components/WeatherCard.jsx',
  '/components/SolunarCard.jsx',
  '/components/FishCard.jsx',
  '/components/DepthCard.jsx',
  '/components/HistoryModal.jsx',
  '/components/common/Card.jsx',
  '/components/common/Logo.jsx',
  '/components/common/SpeakerIcon.jsx',
  '/components/common/Spinner.jsx',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/@google/genai@^1.29.1'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

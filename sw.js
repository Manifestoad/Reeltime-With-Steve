const CACHE_NAME = 'reel-time-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/logo.svg',
  '/manifest.json',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/services/audioService.ts',
  '/services/catchLogService.ts',
  '/services/catchLimitService.ts',
  '/components/Dashboard.tsx',
  '/components/WeatherCard.tsx',
  '/components/SolunarCard.tsx',
  '/components/FishCard.tsx',
  '/components/DepthCard.tsx',
  '/components/HistoryModal.tsx',
  '/components/common/Card.tsx',
  '/components/common/Logo.tsx',
  '/components/common/SpeakerIcon.tsx',
  '/components/common/Spinner.tsx',
  'https://cdn.tailwindcss.com',
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
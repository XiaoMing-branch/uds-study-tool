const CACHE_NAME = 'uds-tool-v1';
const ASSETS = [
  '/uds-study-tool/',
  '/uds-study-tool/uds_learning_tool.html',
  '/uds-study-tool/uds_simulator.html',
  '/uds-study-tool/manifest.json',
  '/uds-study-tool/js/learning-tool.js',
  '/uds-study-tool/js/simulator.js',
  '/uds-study-tool/css/learning-tool.css',
  '/uds-study-tool/css/simulator.css',
  '/uds-study-tool/css/shared.css',
];

// Install event: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

// Fetch event: cache-first, fallback to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Return cached if available
        if (cached) return cached;
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (event.request.headers.get('Accept')?.includes('text/html')) {
              return caches.match('/uds-study-tool/uds_learning_tool.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

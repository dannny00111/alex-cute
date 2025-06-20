// Service Worker for Alexandra's Christening PWA
const CACHE_NAME = 'alexandra-christening-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline interactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'reaction-sync') {
    event.waitUntil(syncReactions());
  }
});

// Sync reactions when back online
function syncReactions() {
  // This would sync any offline reactions with the server
  console.log('Syncing reactions...');
}

// Push notifications for new photos or messages
self.addEventListener('push', (event) => {
  const options = {
    body: 'New blessed memories have been added to Alexandra\'s gallery! ✨',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'new-photos',
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Alexandra\'s Christening', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
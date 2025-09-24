// --- Service Worker for AURA ---

// NOTE: If you change the logoUrl in index.html, you MUST change it here too.
const logoUrl = "https://ahdsjmblyfklicnjlndt.supabase.co/storage/v1/object/public/app%20icon/aura1.jpg";

// Increment the version number to force the service worker to update
// and re-cache all the files when you make changes.
const CACHE_NAME = 'aura-cache-v19';

// List of all the essential files your app needs to work offline.
const urlsToCache = [
    '/', // This caches the main index.html file
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/plugin/customParseFormat.min.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    logoUrl // Cache the app icon itself
];

// Event: 'install'
// This runs when the service worker is first installed.
// It opens our app's cache and adds all the essential files to it.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching essential assets.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Event: 'activate'
// This runs after the service worker is installed and activated.
// It cleans up old, unused caches to save space.
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

// Event: 'fetch'
// This runs every time the app requests a file (like a script, image, or data).
// It checks if the file is already in the cache. If yes, it serves it from there (making it fast and offline-capable).
// If not, it fetches it from the network.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached version if found, otherwise fetch from the network.
                return response || fetch(event.request);
            })
    );
});

// Event: 'notificationclick'
// This runs when a user clicks on a notification sent by the app.
// It closes the notification and opens the app.
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});


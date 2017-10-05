'use strict';

const cacheName = 'v0.2a';

self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/index.html',
        '/manifest.json',
        '/css/damn.css',
        '/js/min/damn.min.js',
        '/svg/offline-dog.svg',
        '/offline.html'
      ]).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
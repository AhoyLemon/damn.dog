'use strict';

const cacheName = 'v0.1a';
const offlineUrl = '/offline.html';


self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/css/damn.css',
        '/js/min/damn.min.js',
        '/svg/offline-dog.svg',
        offlineUrl
        /*
          DEAR READER,
          ADD A LIST OF YOUR ASSETS THAT
          YOU WANT TO WORK WHEN OFFLINE
          TO THIS ARRAY OF URLS
        */
      ]).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        return caches.match(offlineUrl);
      })
    );
  } else {
    event.respondWith(caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
      })
    );
  }
});
'use strict';

const cacheName = 'v1.01a';

self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/index.html',
        '/manifest.json',
        '/css/damn.css',
        '/js/min/damn.vue.min.js',
        'js/libraries/vue.js',
        'js/libraries/vue.min.js',
        '/svg/offline-dog.svg',
        '/offline.html'
      ]).then(() => self.skipWaiting());
    })
  );
});
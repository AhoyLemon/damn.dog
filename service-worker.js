'use strict';

const PRECACHE = 'precache-v104b';
const RUNTIME = 'runtime';
const offlineUrl = '/offline.html';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  './', // Alias for index.html
  '/index.html',
  '/manifest.json',
  '/css/damn.css',
  '/js/min/damn.vue.min.js',
  'js/libraries/vue.js',
  'js/libraries/vue.min.js',
  '/svg/offline-dog.svg',
  offlineUrl
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
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
    return response
  }
});
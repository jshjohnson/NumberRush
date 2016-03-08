'use strict';
var CACHE_NAME = 'number-rush-cache-v13';

// The files we want to cache
const urlsToCache = [
    'index.html',
    'assets/audio/beep.mp3',
    'assets/audio/incorrect.mp3',
    'assets/audio/success.mp3',
    'assets/images/favicon.ico',
    'assets/images/arrow.svg',
    'assets/styles/css/main.min.css',
    'assets/scripts/dist/bundle.js'
];

// Install service worker with cache name and add urls above
self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('WORKER: Opened cache');
            return cache.addAll(urlsToCache);
        })
        .then(function() {
            console.log('WORKER: Install completed');
        })
        .catch(function(err) {
           console.error('Error: ' + err);
        })
    );
});

// Listen for when the browser attempts to fetch assets
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function(response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have 2 stream.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
        .catch(function(err) {
           console.error('Error: ' + err)
        })
    );
});

// Delete pre-existing caches that aren't in a whitelist
self.addEventListener('activate', function(event) {

    // Store any cache names in this array to avoid deletion.
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
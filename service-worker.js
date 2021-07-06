const version = "V0.01";
const CACHE_NAME = version + "staticfiles";
const urlsToCache = ["/"];

self.addEventListener("install", (installEvent) => {
  // Perform install steps
  skipWaiting();
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName != CACHE_NAME) {
              return caches.delete(cacheName);
            } // end if
          }) // end map
        ); // end return Promise.all
      }) // end keys then
      .then(() => {
        return clients.claim();
      }) // end then
  ); // end waitUntil
}); // end addEventListener

self.addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    caches.match(request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(request);
    })
  );
});

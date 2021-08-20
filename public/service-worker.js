const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';


const FILES_TO_CACHE = [
    "./index.html",
    "./public/css/style.css",
    "./public/js/idb.js",
    "./public/js/index.js",
    "./public/icons/icon-144x144.png",
    "./public/icons/icon-152x152.png",
    "./public/icons/icon-192x192.png",
    "./public/icons/icon-384x384.png",
    "./public/icons/icon-512x512.png",
];




// Cache resources
self.addEventListener('install',  (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files have been pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    //forces server worker to become the active service worker
    self.skipWaiting();
})
  
  // Delete outdated caches
  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then(keyList => {
        // `keyList` contains all cache names under your username.github.io
        return Promise.all(
          keyList.map(key => {
              //checking against the caches set up and removing unnecessary caches
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log('deleting cache : ' + key);
              return caches.delete(key);
            }
          })
        );
      })
    );
    //causes pages to be controlled and loaded immediately
    self.clients.claim();
  });

  self.addEventListener('fetch',  (e) => {
      console.log('fetch request : ' + e.request.url)
      e.respondWith(
          caches.match(e.request).then(function (request) {
              if(request) {
                  console.log('responding with cache : ' + e.request.url)
                  return request
              } else {
                  console.log('file is not cached, fetching : ' + e.request.url)
                  return fetch(e.request)
              }
          })
      )
  })
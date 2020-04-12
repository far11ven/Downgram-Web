const cacheName = "Downgram";

// Our application only has two files here index.html and manifest.json
// but you can add more such as style.css as your app grows
const assets = ["/", "index.html", "manifest.json"];

// Cache all the files to make a PWA
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

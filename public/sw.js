const CACHE_NAME = 'swadheen-shell-v1'
const APP_SHELL = ['/', '/properties', '/offline']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response || caches.match('/offline')),
    ),
  )
})

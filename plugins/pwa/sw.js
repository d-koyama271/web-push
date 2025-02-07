import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST || [])

// サーバーサイドPushを受け取る
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default Body',
    icon: data.icon || 'icons/icon-192x192.png',
    badge: data.badge || 'icons/icon-192x192.png',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

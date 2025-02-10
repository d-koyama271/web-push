import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);

// サーバーサイドPushを受け取る
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || "テスト通知";
  const options = {
    body: data.body || "これはテスト通知です",
    icon: data.icon || "icons/web-128.png",
    badge: data.badge || "icons/web-128.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

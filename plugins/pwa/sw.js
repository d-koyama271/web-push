import { precacheAndRoute } from 'workbox-precaching'

// ビルド時に生成されたアセットをプリキャッシュ
precacheAndRoute(self.__WB_MANIFEST || [])

// クライアントからのメッセージを受信して通知を表示
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data.payload
    self.registration.showNotification(title, options)
  }
})

// 通知クリック時の動作
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  // 通知クリック時に特定のURLを開く
  event.waitUntil(
    clients.openWindow('https://d-koyama271.github.io/web-push/')
  )
})

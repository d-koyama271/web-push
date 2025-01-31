<template>
  <div class="container">
    <h1>Web Push Demo</h1>
    <button @click="subscribe">通知を購読</button>
    <button @click="triggerNotification">通知を表示</button>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const subscribe = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('このブラウザはPush通知に対応していません。')
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey)
    })
    console.log('Push Subscription:', subscription)

    // サブスクリプション情報をサーバーに送信
    await fetch(`${config.public.backendUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    })

    alert('通知を購読しました。')
  } catch (error) {
    console.error('Subscription failed:', error)
    alert('通知の購読に失敗しました。')
  }
}

const sendTestNotification = async () => {
  try {
    await fetch(`${config.public.backendUrl}/sendNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'テスト通知',
        body: 'これはテスト通知です。',
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-192x192.png',
      })
    })

    alert('通知を送信しました。')
  } catch (error) {
    console.error('Error sending notification:', error)
    alert('通知の送信に失敗しました。')
  }
}

// Utility function to convert Base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 50px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>

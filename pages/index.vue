<template>
  <div class="container">
    <h1>Web Push Demo</h1>
    <button @click="subscribe">通知を購読</button>
    <div>
      <label for="title">タイトル:</label>
      <input id="title" v-model="title" type="text" placeholder="通知タイトル" />
    </div>

    <div>
      <label for="body">本文:</label>
      <input id="body" v-model="body" type="text" placeholder="通知本文" />
    </div>

    <div>
      <label for="icon">アイコン:</label>
      <select id="icon" v-model="icon">
        <option disabled value="">--- 選択してください ---</option>
        <option value="icons/line-192.png">ライン</option>
        <option value="icons/instagram-128.png">インスタ</option>
        <option value="icons/tiktok-128.png">tiktok</option>
      </select>
    </div>

    <button @click="sendNotification">通知を送信</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const title = ref('')
const body = ref('')
const icon = ref('')

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

const sendNotification = async () => {
  try {
    await fetch(`${config.public.backendUrl}/sendNotification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value,
        body: body.value,
        icon: icon.value,
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
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
label {
  display: inline-block;
  width: 60px;
  margin-right: 8px;
}
input, select {
  width: 80%;
  margin-bottom: 1rem;
}
button {
  display: inline-block;
  padding: 8px 16px;
  cursor: pointer;
}
</style>

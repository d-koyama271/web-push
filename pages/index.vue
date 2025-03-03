<template>
  <div class="container">
    <h1>Web Push Demo</h1>

    <div class="subscribe-group">
      <button @click="subscribe">通知を購読</button>
      <button @click="unsubscribe">購読解除</button>
    </div>

    <div class="form-group">
      <label for="title">タイトル:</label>
      <input id="title" v-model="title" type="text" placeholder="通知タイトル" />
    </div>

    <div class="form-group">
      <label for="body">本文:</label>
      <input id="body" v-model="body" type="text" placeholder="通知本文" />
    </div>

    <div class="form-group">
      <label for="icon">アイコン:</label>
      <select id="icon" v-model="icon">
        <option disabled value="">--- 選択してください ---</option>
        <option value="icons/line-192.png">ライン</option>
        <option value="icons/instagram-128.png">インスタ</option>
        <option value="icons/tiktok-128.png">tiktok</option>
      </select>
    </div>

    <div class="button-row">
      <label>&nbsp;</label>
      <div class="right-align">
        <button @click="sendNotification">通知を送信</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const title = ref('')
const body = ref('')
const icon = ref('')

// 購読
const subscribe = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('このブラウザはPush通知に対応していません。')
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const existing = await registration.pushManager.getSubscription()
    if (existing) {
      alert('すでに購読済みです。')
      return
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey)
    })

    await fetch(`${config.public.backendUrl}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })

    alert('通知を購読しました。')
  } catch (error) {
    console.error('Subscription failed:', error)
    alert('通知の購読に失敗しました。')
  }
}

// 購読解除
const unsubscribe = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('このブラウザはPush通知に対応していません。')
    return
  }
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      alert('購読されていません。')
      return
    }

    await fetch(`${config.public.backendUrl}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    })

    // ブラウザ側で購読を解除
    await subscription.unsubscribe()
    alert('購読を解除しました。')
  } catch (error) {
    console.error('Unsubscribe failed:', error)
    alert('購読の解除に失敗しました。')
  }
}

// 通知送信
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
h1 {
  text-align: center;
  margin-bottom: 1rem;
}
.subscribe-group {
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.form-group label {
  width: 80px;
  margin-right: 8px;
  text-align: right;
  vertical-align: middle;
}
.form-group input,
.form-group select {
  flex: 1;
  height: 36px;
  line-height: 36px;
  padding: 0 8px;
  box-sizing: border-box;
}
.button-row {
  display: flex;
  margin-bottom: 1rem;
}
.button-row label {
  width: 80px; /* ダミーラベルで揃える */
}
.right-align {
  flex: 1;
  text-align: right;
}
button {
  display: inline-block;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0 8px; /* ボタン間に余白 */
}
</style>

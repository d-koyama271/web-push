<template>
    <div class="container">
      <h1>Web通知デモ</h1>
      <button @click="requestNotificationPermission">通知を許可</button>
      <button @click="sendNotification">通知を送信</button>
    </div>
  </template>

  <script setup>
  import { useRuntimeConfig } from '#imports';

  const config = useRuntimeConfig();

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('このブラウザは通知に対応していません。');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      alert('通知が許可されました。');
    } else {
      alert('通知が拒否されました。');
    }
  };

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      const iconUrl = `icons/icon-192x192.png`; // ベースURLを考慮
      new Notification('こんにちは！これはテスト通知です。', {
        body: 'これはデモの通知メッセージです。',
        icon: iconUrl,
      });
    } else {
      alert('通知の許可が必要です。');
    }
  };
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

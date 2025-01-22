import webpush from 'web-push';
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

webpush.setVapidDetails(
  'mailto:test@example.com',
  config.public.vapidPublicKey,
  config.vapidPrivateKey
);

let subscriptions = [];

export default async function handler(req, res) {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // プリフライトリクエストに対するレスポンス
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { title, body, icon, badge } = req.body;
    const payload = JSON.stringify({ title, body, icon, badge });

    const sendNotifications = subscriptions.map(sub => webpush.sendNotification(sub, payload));

    try {
      await Promise.all(sendNotifications);
      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Error sending notifications' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

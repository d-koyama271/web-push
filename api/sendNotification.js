import { Redis } from '@upstash/redis';
import webpush from 'web-push';

const redis = Redis.fromEnv();

const vapidKeys = {
  publicKey: process.env.NUXT_VAPID_PUBLIC_KEY,
  privateKey: process.env.NUXT_VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com', // 実際のメールアドレスに置き換えてください
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req, res) {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { title, body, icon, badge } = req.body;
    const payload = JSON.stringify({ title, body, icon, badge });

    try {
      const subscriptions = await redis.lrange('subscriptions', 0, -1);

      if (subscriptions.length === 0) {
        res.status(400).json({ error: 'No subscriptions available' });
        return;
      }

      const sendNotifications = subscriptions.map((sub) => {
        const subscription = JSON.parse(sub);
        return webpush.sendNotification(subscription, payload).catch((error) => {
          console.error('Error sending notification to:', subscription.endpoint, error);
        });
      });

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

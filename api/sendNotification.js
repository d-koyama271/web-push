import { Redis } from "@upstash/redis";
import webpush from "web-push";

const redis = Redis.fromEnv();

const vapidKeys = {
  publicKey: process.env.NUXT_VAPID_PUBLIC_KEY,
  privateKey: process.env.NUXT_VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:example@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req, res) {
  // CORSヘッダーの設定
  // res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io')
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { title, body, icon } = req.body;
      const payload = JSON.stringify({ title, body, icon });

      // Redis から全サブスクリプションを取得
      const subscriptions = await redis.lrange("subscriptions", 0, -1);
      if (subscriptions.length === 0) {
        return res.status(400).json({ error: "No subscriptions available" });
      }

      // 送信
      const results = subscriptions.map(async (sub) => {
        const subscription = JSON.parse(sub);
        try {
          await webpush.sendNotification(subscription, payload);
        } catch (err) {
          console.error("送信失敗:", subscription.endpoint, err);
        }
      });

      await Promise.all(results);
      return res.status(200).json({ message: "Notifications sent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error sending notifications" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

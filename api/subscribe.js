import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // CORSヘッダーの設定
  // res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io')
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // プリフライトリクエスト
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "POST") {
      // サブスクリプションをリストに追加
      await redis.lpush("subscriptions", JSON.stringify(req.body));
      res.status(201).json({ message: "Subscribed successfully" });
    } else if (req.method === "GET") {
      // リストの全要素を取得
      const subscriptions = await redis.lrange("subscriptions", 0, -1);
      const parsed = subscriptions.map((sub) => JSON.parse(sub));
      res.status(200).json(parsed);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

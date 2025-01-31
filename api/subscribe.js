import Redis from 'ioredis';

const redis = new Redis(process.env.VERCEL_KV_URL, {
  password: process.env.VERCEL_KV_TOKEN,
});

export default async function handler(req, res) {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const subscription = req.body;
    try {
      await redis.lpush('subscriptions', JSON.stringify(subscription));
      res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const subscriptions = await redis.lrange('subscriptions', 0, -1);
      const parsedSubscriptions = subscriptions.map(sub => JSON.parse(sub));
      res.status(200).json(parsedSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

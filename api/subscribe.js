import webpush from 'web-push';

let subscriptions = [];

export default async function handler(req, res) {
  // CORSヘッダー
  res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // プリフライトリクエストに対するレスポンス
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscribed successfully' });
  } else if (req.method === 'GET') {
    res.status(200).json(subscriptions);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

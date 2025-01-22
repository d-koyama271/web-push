import { VercelRequest, VercelResponse } from '@vercel/node'

let subscriptions: PushSubscription[] = []

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const subscription = req.body
    subscriptions.push(subscription)
    res.status(201).json({ message: 'Subscribed successfully' })
  } else if (req.method === 'GET') {
    console.log('get')
    res.status(200).json(subscriptions)
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

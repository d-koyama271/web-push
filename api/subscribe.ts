import { VercelRequest, VercelResponse } from '@vercel/node'

let subscriptions: PushSubscription[] = []

export default function handler(req: VercelRequest, res: VercelResponse) {
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

import { VercelRequest, VercelResponse } from '@vercel/node'
const webpush = require('web-push')

// 環境変数にVAPIDキーを設定
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
}

webpush.setVapidDetails(
  'mailto:test@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// サブスクリプションを保持
let subscriptions: PushSubscription[] = []

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { title, body, icon, badge } = req.body

    const payload = JSON.stringify({ title, body, icon, badge })

    const sendNotifications = subscriptions.map(sub => webpush.sendNotification(sub, payload))

    try {
      await Promise.all(sendNotifications)
      res.status(200).json({ message: 'Notifications sent successfully' })
    } catch (error) {
      console.error('Error sending notifications:', error)
      res.status(500).json({ error: 'Error sending notifications' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

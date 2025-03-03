import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  // res.setHeader('Access-Control-Allow-Origin', 'https://d-koyama271.github.io')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const subscription = JSON.parse(req.body)

    // Redisに保存されている文字列を検索・削除
    // 購読時に "await redis.lpush('subscriptions', JSON.stringify(subscription))"
    // と同じ形で保存している前提で lrem する
    const removedCount = await redis.lrem(
      'subscriptions',
      0,
      JSON.stringify(subscription)
    )

    if (removedCount === 0) {
      // 該当のサブスクリプションが見つからない
      return res.status(404).json({ error: 'Subscription not found in Redis' })
    }

    // 正常に削除された
    return res.status(200).json({ message: 'Subscription removed from Redis' })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

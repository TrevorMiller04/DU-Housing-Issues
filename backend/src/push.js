import webpush from 'web-push'
import db from './db.js'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function sendPushToAll(payload) {
  const { rows } = await db.query('SELECT id, subscription FROM push_subscriptions')

  for (const row of rows) {
    try {
      await webpush.sendNotification(JSON.parse(row.subscription), JSON.stringify(payload))
    } catch (err) {
      // 410 Gone = subscription expired or unsubscribed, clean it up
      if (err.statusCode === 410) {
        await db.query('DELETE FROM push_subscriptions WHERE id = $1', [row.id])
      }
    }
  }
}

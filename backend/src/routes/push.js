import { Router } from 'express'
import db from '../db.js'

const router = Router()

// POST /api/push/subscribe
router.post('/subscribe', async (req, res) => {
  const { subscription } = req.body

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' })
  }

  // One-device simplification: replace all existing subscriptions
  await db.query('DELETE FROM push_subscriptions')
  await db.query(
    'INSERT INTO push_subscriptions (subscription) VALUES ($1)',
    [JSON.stringify(subscription)]
  )

  res.status(201).json({ ok: true })
})

// DELETE /api/push/subscribe
router.delete('/subscribe', async (req, res) => {
  const { endpoint } = req.body

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint' })
  }

  await db.query(
    `DELETE FROM push_subscriptions WHERE subscription->>'endpoint' = $1`,
    [endpoint]
  )

  res.json({ ok: true })
})

export default router

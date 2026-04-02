import { Router } from 'express'
import db from '../db.js'

const router = Router()

function requireSlug(req, res, next) {
  if (req.body?.slug !== process.env.SUBMISSION_SLUG) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

// POST /api/push/subscribe
router.post('/subscribe', requireSlug, async (req, res) => {
  try {
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
  } catch (err) {
    console.error('POST /api/push/subscribe error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/push/subscribe
router.delete('/subscribe', requireSlug, async (req, res) => {
  try {
    const { endpoint } = req.body

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint' })
    }

    await db.query(
      `DELETE FROM push_subscriptions WHERE subscription->>'endpoint' = $1`,
      [endpoint]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/push/subscribe error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

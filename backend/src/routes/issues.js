import { Router } from 'express'
import db from '../db.js'
import upload from '../middleware/upload.js'
import { uploadPhoto } from '../storage.js'
import { sendPushToAll } from '../push.js'

const router = Router()

// GET /api/issues?floor_id=&room_id=
router.get('/', async (req, res) => {
  const { floor_id, room_id } = req.query

  const { rows } = await db.query(
    `SELECT * FROM issues
     WHERE ($1::text IS NULL OR floor_id = $1)
       AND ($2::text IS NULL OR room_id = $2)
     ORDER BY submitted_at DESC`,
    [floor_id ?? null, room_id ?? null]
  )

  res.json(rows)
})

// POST /api/issues
router.post('/', upload.single('photo'), async (req, res) => {
  const { slug, submitter_name, floor_id, floor_label, room_id, room_label, issue_type, description } = req.body

  if (slug !== process.env.SUBMISSION_SLUG) {
    return res.status(403).json({ error: 'Invalid submission slug' })
  }

  if (!submitter_name || !floor_id || !floor_label || !room_id || !room_label || !issue_type) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  let photo_url = null
  if (req.file) {
    photo_url = await uploadPhoto(req.file.buffer, req.file.mimetype)
  }

  const { rows } = await db.query(
    `INSERT INTO issues
       (submitter_name, floor_id, floor_label, room_id, room_label, issue_type, description, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [submitter_name, floor_id, floor_label, room_id, room_label, issue_type, description ?? null, photo_url]
  )

  const issue = rows[0]

  // Fire-and-forget push notification
  sendPushToAll({
    title: 'New Maintenance Request',
    body: `${floor_label} · ${room_label} — ${issue_type} (${submitter_name})`,
    url: '/dashboard',
    issueId: issue.id,
  }).catch(() => {})

  res.status(201).json(issue)
})

// DELETE /api/issues/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { rows } = await db.query('SELECT * FROM issues WHERE id = $1', [id])
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Issue not found' })
  }

  const snapshot = rows[0]

  await db.query(
    `INSERT INTO resolution_log (issue_snapshot) VALUES ($1)`,
    [JSON.stringify(snapshot)]
  )

  await db.query('DELETE FROM issues WHERE id = $1', [id])

  res.json({ ok: true })
})

export default router

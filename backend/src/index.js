import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import issuesRouter from './routes/issues.js'
import pushRouter from './routes/push.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/issues', issuesRouter)
app.use('/api/push', pushRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

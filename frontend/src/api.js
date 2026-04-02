const BASE = import.meta.env.VITE_API_URL || ''
const SLUG = import.meta.env.VITE_SUBMISSION_SLUG

export async function getIssues({ floorId, roomId } = {}) {
  const params = new URLSearchParams()
  if (floorId) params.set('floor_id', floorId)
  if (roomId) params.set('room_id', roomId)
  const query = params.toString() ? `?${params}` : ''
  const res = await fetch(`${BASE}/api/issues${query}`)
  if (!res.ok) throw new Error('Failed to fetch issues')
  return res.json()
}

export async function submitIssue(formData) {
  const res = await fetch(`${BASE}/api/issues`, {
    method: 'POST',
    body: formData, // FormData (multipart)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Submission failed')
  }
  return res.json()
}

export async function resolveIssue(id) {
  const res = await fetch(`${BASE}/api/issues/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: SLUG }),
  })
  if (!res.ok) throw new Error('Failed to resolve issue')
  return res.json()
}

export async function subscribePush(subscription) {
  const res = await fetch(`${BASE}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: SLUG, subscription }),
  })
  if (!res.ok) throw new Error('Failed to subscribe to push')
  return res.json()
}

export async function unsubscribePush(endpoint) {
  const res = await fetch(`${BASE}/api/push/subscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: SLUG, endpoint }),
  })
  if (!res.ok) throw new Error('Failed to unsubscribe from push')
  return res.json()
}

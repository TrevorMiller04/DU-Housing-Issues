import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const BUCKET = 'maintenance-photos'
const SIGNED_URL_EXPIRY = 365 * 24 * 60 * 60 // 1 year in seconds

export async function uploadPhoto(buffer, mimeType) {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg'
  const path = `${randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimeType })

  if (uploadError) throw uploadError

  const { data, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY)

  if (urlError) throw urlError

  return data.signedUrl
}

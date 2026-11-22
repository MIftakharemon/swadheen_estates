// Client-side preparation for listing image uploads. Photos from phones are
// often several MB — over Vercel's 4.5MB request-body cap — so oversized or
// exotic files (e.g. HEIC) are decoded, downscaled and re-encoded in the
// browser before the multipart POST; small supported files go up untouched.

const RAW_UPLOAD_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_RAW_BYTES = 3.5 * 1024 * 1024
const MAX_EDGE_PX = 1600
const ENCODE_QUALITY = 0.85

export type PreparedImage =
  | { ok: true; blob: Blob; filename: string }
  | { ok: false; reason: 'unsupported' | 'tooLarge' }

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function prepareListingImage(file: File): Promise<PreparedImage> {
  const rawSupported = RAW_UPLOAD_TYPES.has(file.type)
  if (rawSupported && file.size <= MAX_RAW_BYTES) return { ok: true, blob: file, filename: file.name }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Not decodable in this browser (e.g. HEIC outside Safari): only the
    // original bytes can still be accepted, and only when already small.
    return { ok: false, reason: rawSupported ? 'tooLarge' : 'unsupported' }
  }

  try {
    const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return { ok: false, reason: 'unsupported' }
    context.drawImage(bitmap, 0, 0, width, height)

    const blob =
      (await toBlob(canvas, 'image/webp', ENCODE_QUALITY)) ??
      (await toBlob(canvas, 'image/jpeg', ENCODE_QUALITY))
    if (!blob) return { ok: false, reason: 'unsupported' }
    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image'
    return { ok: true, blob, filename: `${baseName}.${extension}` }
  } finally {
    bitmap.close()
  }
}

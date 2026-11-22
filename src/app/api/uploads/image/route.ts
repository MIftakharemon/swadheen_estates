import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { env } from '@/lib/env'
import { can } from '@/lib/auth/rbac'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { isSameOrigin } from '@/lib/security/validate-origin'
import {
  extensionForContentType,
  matchesMagicBytes,
  uploadMetadataSchema,
} from '@/lib/storage/file-validation'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const
// Vercel caps function request bodies at 4.5MB, so anything larger never reaches the handler.
// The client downscales photos before sending; this is the hard backstop.
const MAX_BODY_BYTES = 4 * 1024 * 1024

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const role = session.user.role
  if (!can({ userId: session.user.id, role }, 'property:write'))
    return NextResponse.json({ error: 'You do not have permission to upload media.' }, { status: 403 })
  const limit = checkRateLimit(`upload:${session.user.id}`, 30, 60_000)
  if (!limit.allowed)
    return NextResponse.json({ error: 'Too many uploads. Please wait a moment.' }, { status: 429 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected a multipart image upload.' }, { status: 400 })
  }
  const entry = form.get('file')
  if (!entry || typeof entry === 'string')
    return NextResponse.json({ error: 'Attach one image file.' }, { status: 400 })
  const file = entry
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type))
    return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 })
  if (file.size > MAX_BODY_BYTES)
    return NextResponse.json({ error: 'This file is too large. Maximum size is 4 MB.' }, { status: 413 })

  const originalName = (file.name || 'image').trim().slice(0, 180) || 'image'
  const parsed = uploadMetadataSchema.safeParse({
    contentType: file.type,
    size: file.size,
    originalName,
  })
  if (!parsed.success) return NextResponse.json({ error: 'Unsupported file metadata.' }, { status: 400 })

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  if (!matchesMagicBytes(header, parsed.data.contentType))
    return NextResponse.json({ error: 'File content does not match its type.' }, { status: 400 })

  if (!env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ error: 'Media storage is not configured yet.' }, { status: 503 })

  const pathname = `listing/${randomUUID()}.${extensionForContentType(parsed.data.contentType)}`
  try {
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: parsed.data.contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    })
    return NextResponse.json({ ok: true, url: blob.url }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Upload failed while saving to storage.' }, { status: 500 })
  }
}

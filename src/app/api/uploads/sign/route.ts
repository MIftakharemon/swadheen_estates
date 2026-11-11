import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { isSameOrigin } from '@/lib/security/validate-origin'
import { createUploadUrl } from '@/lib/storage/r2'
import {
  extensionForContentType,
  uploadMetadataSchema,
  validateUploadSize,
} from '@/lib/storage/file-validation'

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
  const parsed = uploadMetadataSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Unsupported file metadata.' }, { status: 400 })
  const sizeError = validateUploadSize(parsed.data)
  if (sizeError) return NextResponse.json({ error: sizeError }, { status: 413 })
  const key = `media/${randomUUID()}.${extensionForContentType(parsed.data.contentType)}`
  const url = await createUploadUrl(key, parsed.data)
  if (!url) return NextResponse.json({ error: 'Media storage is not configured yet.' }, { status: 503 })
  return NextResponse.json({ ok: true, key, uploadUrl: url, expiresIn: 300 }, { status: 201 })
}

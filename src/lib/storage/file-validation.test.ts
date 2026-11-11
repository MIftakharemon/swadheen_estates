import { describe, expect, it } from 'vitest'
import { matchesMagicBytes, uploadMetadataSchema, validateUploadSize } from '@/lib/storage/file-validation'

describe('upload validation', () => {
  it('accepts an allowed image signature', () => {
    const metadata = uploadMetadataSchema.parse({
      contentType: 'image/png',
      size: 1024,
      originalName: 'hero.png',
    })
    expect(
      matchesMagicBytes(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        metadata.contentType,
      ),
    ).toBe(true)
  })

  it('rejects a mismatched signature even when metadata claims an image', () => {
    expect(matchesMagicBytes(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), 'image/png')).toBe(false)
  })

  it('enforces the per-type size limit', () => {
    const metadata = uploadMetadataSchema.parse({
      contentType: 'model/gltf-binary',
      size: 81 * 1024 * 1024,
      originalName: 'model.glb',
    })
    expect(validateUploadSize(metadata)).toContain('too large')
  })
})

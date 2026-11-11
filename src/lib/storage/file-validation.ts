import { z } from 'zod'

export const uploadMetadataSchema = z.object({
  contentType: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'model/gltf-binary',
    'video/mp4',
    'application/pdf',
  ]),
  size: z.number().int().positive(),
  originalName: z.string().trim().min(1).max(180),
})

export type UploadMetadata = z.infer<typeof uploadMetadataSchema>

const MAX_BYTES: Record<UploadMetadata['contentType'], number> = {
  'image/jpeg': 15 * 1024 * 1024,
  'image/png': 15 * 1024 * 1024,
  'image/webp': 15 * 1024 * 1024,
  'image/avif': 15 * 1024 * 1024,
  'model/gltf-binary': 80 * 1024 * 1024,
  'video/mp4': 150 * 1024 * 1024,
  'application/pdf': 20 * 1024 * 1024,
}

export function validateUploadSize(metadata: UploadMetadata): string | null {
  return metadata.size > MAX_BYTES[metadata.contentType]
    ? `This file is too large for ${metadata.contentType}.`
    : null
}

function startsWithBytes(bytes: Uint8Array, expected: number[]): boolean {
  return expected.every((byte, index) => bytes[index] === byte)
}

function hasBrand(bytes: Uint8Array, brand: string): boolean {
  return new TextDecoder().decode(bytes.slice(4, 12)).includes(brand)
}

export function matchesMagicBytes(bytes: Uint8Array, contentType: UploadMetadata['contentType']): boolean {
  if (contentType === 'image/jpeg') return startsWithBytes(bytes, [0xff, 0xd8, 0xff])
  if (contentType === 'image/png')
    return startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (contentType === 'image/webp')
    return (
      startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) &&
      new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
    )
  if (contentType === 'image/avif') return hasBrand(bytes, 'avif') || hasBrand(bytes, 'avis')
  if (contentType === 'model/gltf-binary') return new TextDecoder().decode(bytes.slice(0, 4)) === 'glTF'
  if (contentType === 'application/pdf') return new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
  if (contentType === 'video/mp4')
    return hasBrand(bytes, 'mp4') || hasBrand(bytes, 'isom') || hasBrand(bytes, 'iso2')
  return false
}

export function extensionForContentType(contentType: UploadMetadata['contentType']): string {
  const extensions: Record<UploadMetadata['contentType'], string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'model/gltf-binary': 'glb',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf',
  }
  return extensions[contentType]
}

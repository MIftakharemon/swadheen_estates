import 'server-only'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/lib/env'
import type { UploadMetadata } from '@/lib/storage/file-validation'

function getClient(): S3Client | null {
  if (!env.R2_ENDPOINT || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) return null
  return new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
  })
}

export async function createUploadUrl(key: string, metadata: UploadMetadata): Promise<string | null> {
  const client = getClient()
  if (!client || !env.R2_BUCKET_NAME) return null
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: metadata.contentType,
    ContentLength: metadata.size,
    CacheControl: 'public, max-age=31536000, immutable',
  })
  return getSignedUrl(client, command, { expiresIn: 300 })
}

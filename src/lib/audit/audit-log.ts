import 'server-only'

import { createHash } from 'node:crypto'
import { db } from '@/lib/db'

type AuditInput = {
  actorId?: string
  action: string
  entity: string
  entityId: string
  before?: unknown
  after?: unknown
  ipAddress?: string
}

function hashIp(ipAddress?: string): string | undefined {
  if (!ipAddress) return undefined
  return createHash('sha256').update(ipAddress).digest('hex')
}

export async function writeAuditLog(input: AuditInput): Promise<void> {
  await db.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      beforeJson: input.before,
      afterJson: input.after,
      ipHash: hashIp(input.ipAddress),
    },
  })
}

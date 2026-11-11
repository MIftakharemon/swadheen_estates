declare module '@prisma/client' {
  type SeedRecord = { id: string }
  type PropertyDelegate = {
    findUnique(args: unknown): Promise<SeedRecord | null>
    upsert(args: unknown): Promise<SeedRecord>
  }
  type UserDelegate = {
    upsert(args: unknown): Promise<SeedRecord>
    findUnique(
      args: unknown,
    ): Promise<{ id: string; name: string; email: string; role: string; passwordHash: string | null } | null>
  }
  type ProjectRecord = { id: string; name: string; slug: string }
  type ProjectDelegate = {
    upsert(args: unknown): Promise<SeedRecord>
    findUnique(args: unknown): Promise<ProjectRecord | null>
  }
  type ProjectVideoRecord = {
    id: string
    projectId: string
    kind: 'SHORT' | 'VIDEO'
    title: string
    description: string
    youtubeUrl: string
    youtubeId: string
    thumbnailUrl: string
    published: boolean
    sortOrder: number
    project?: { slug: string; name: string }
  }
  type ProjectVideoDelegate = {
    findMany(args: unknown): Promise<ProjectVideoRecord[]>
    create(args: unknown): Promise<ProjectVideoRecord>
    update(args: unknown): Promise<ProjectVideoRecord>
    delete(args: unknown): Promise<ProjectVideoRecord>
    upsert(args: unknown): Promise<ProjectVideoRecord>
  }
  type LeadDelegate = { create(args: unknown): Promise<SeedRecord> }
  type AuditLogDelegate = { create(args: unknown): Promise<SeedRecord> }

  export class PrismaClient {
    constructor(options?: { log?: string[] })
    property: PropertyDelegate
    user: UserDelegate
    project: ProjectDelegate
    projectVideo: ProjectVideoDelegate
    lead: LeadDelegate
    auditLog: AuditLogDelegate
    $disconnect(): Promise<void>
  }

  export const PropertyType: { LAND: 'LAND'; HOUSE: 'HOUSE'; FLAT: 'FLAT' }
  export type PropertyType = 'LAND' | 'HOUSE' | 'FLAT'
  export const PropertyStatus: {
    DRAFT: 'DRAFT'
    PUBLISHED: 'PUBLISHED'
    SCHEDULED: 'SCHEDULED'
    ARCHIVED: 'ARCHIVED'
  }
  export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  export const InventoryStatus: {
    AVAILABLE: 'AVAILABLE'
    BOOKED: 'BOOKED'
    SOLD: 'SOLD'
    UPCOMING: 'UPCOMING'
  }
  export type InventoryStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD' | 'UPCOMING'
  export const VideoKind: { SHORT: 'SHORT'; VIDEO: 'VIDEO' }
  export type VideoKind = 'SHORT' | 'VIDEO'
}

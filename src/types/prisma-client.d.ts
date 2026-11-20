declare module '@prisma/client' {
  type SeedRecord = { id: string }
  type PropertyDelegate = {
    findUnique(args: unknown): Promise<{ id: string; title?: string } | null>
    upsert(args: unknown): Promise<SeedRecord>
  }
  type SavedPropertyRecord = {
    userId: string
    propertyId: string
    createdAt: Date
    property?: { slug: string }
  }
  type SavedPropertyDelegate = {
    findMany(args: unknown): Promise<Array<{ property: { slug: string } }>>
    findUnique(args: unknown): Promise<SavedPropertyRecord | null>
    create(args: unknown): Promise<SavedPropertyRecord>
    delete(args: unknown): Promise<SavedPropertyRecord>
  }
  type UserRecord = {
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
  }
  type UserDelegate = {
    create(args: unknown): Promise<UserRecord>
    upsert(args: unknown): Promise<SeedRecord>
    findUnique(
      args: unknown,
    ): Promise<{ id: string; name: string; email: string; role: string; passwordHash: string | null } | null>
    findMany(args: unknown): Promise<UserRecord[]>
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
  type LeadRecord = {
    id: string
    name: string
    email: string
    phone: string
    note: string | null
    stage: string
    source: string
    createdAt: Date
    property?: { title: string; slug: string } | null
  }
  type LeadDelegate = {
    create(args: unknown): Promise<LeadRecord>
    findMany(args: unknown): Promise<LeadRecord[]>
  }
  type NotificationRecord = {
    id: string
    audience: string
    userId: string | null
    type: string
    title: string
    body: string | null
    link: string | null
    meta: unknown
    readAt: Date | null
    createdAt: Date
  }
  type NotificationDelegate = {
    create(args: unknown): Promise<NotificationRecord>
    findMany(args: unknown): Promise<NotificationRecord[]>
    count(args: unknown): Promise<number>
    updateMany(args: unknown): Promise<{ count: number }>
  }
  type AuditLogDelegate = { create(args: unknown): Promise<SeedRecord> }

  export namespace Prisma {
    type NotificationWhereInput = Record<string, unknown>
  }

  // Scalar shape of PropertyCreateInput — enough for typed create/upsert data
  // without pulling the whole generated client into the ambient stub.
  export type PropertyCreateInput = {
    slug: string
    title: string
    type: PropertyType
    status?: PropertyStatus
    inventory?: InventoryStatus
    location: string
    city: string
    description: string
    priceMinor: bigint | number
    area: number | string
    areaUnit?: string
    bedrooms?: number | null
    bathrooms?: number | null
    floor?: number | null
    facing?: string | null
    featured?: boolean
    verified?: boolean
    focalX?: number
    focalY?: number
    publishedAt?: Date | string
  }

  export class PrismaClient {
    constructor(options?: { log?: string[] })
    property: PropertyDelegate
    user: UserDelegate
    project: ProjectDelegate
    projectVideo: ProjectVideoDelegate
    lead: LeadDelegate
    savedProperty: SavedPropertyDelegate
    notification: NotificationDelegate
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

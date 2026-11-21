import type { Project } from '@/types/project'

// Admin API payloads — the web shapes plus DB bookkeeping the panel shows.
export type AdminPropertyDto = import('@/types/property').Property & {
  dbStatus: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export type AdminProjectDto = Project

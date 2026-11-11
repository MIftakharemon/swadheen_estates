export type VideoKind = 'SHORT' | 'VIDEO'

export type ProjectVideo = {
  id: string
  projectSlug: string
  projectName: string
  kind: VideoKind
  title: string
  description: string
  youtubeUrl: string
  youtubeId: string
  thumbnailUrl: string
  published: boolean
  sortOrder: number
}

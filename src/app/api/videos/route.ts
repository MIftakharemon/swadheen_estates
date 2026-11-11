import { NextResponse } from 'next/server'
import { projectVideos } from '@/data/videos'
import { env } from '@/lib/env'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const projectSlug = url.searchParams.get('projectSlug')
  const kind = url.searchParams.get('kind')
  if (!env.DATABASE_URL)
    return NextResponse.json(
      projectVideos.filter(
        (video) =>
          (!projectSlug || video.projectSlug === projectSlug) &&
          (!kind || video.kind === kind) &&
          video.published,
      ),
    )
  try {
    const { db } = await import('@/lib/db')
    const rows = await db.projectVideo.findMany({
      where: {
        published: true,
        ...(kind ? { kind } : {}),
        ...(projectSlug ? { project: { slug: projectSlug } } : {}),
      },
      include: { project: { select: { slug: true, name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(
      rows.map((video) => ({
        ...video,
        projectSlug: video.project?.slug ?? projectSlug ?? '',
        projectName: video.project?.name ?? '',
      })),
    )
  } catch {
    return NextResponse.json(
      projectVideos.filter(
        (video) =>
          (!projectSlug || video.projectSlug === projectSlug) &&
          (!kind || video.kind === kind) &&
          video.published,
      ),
    )
  }
}

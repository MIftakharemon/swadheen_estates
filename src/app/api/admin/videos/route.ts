import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { projectVideos } from '@/data/videos'
import { videoInputSchema, parseYouTubeUrl } from '@/features/videos/schemas/video.schema'
import { can } from '@/lib/auth/rbac'
import { env } from '@/lib/env'
import { isSameOrigin } from '@/lib/security/validate-origin'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!can({ userId: session.user.id, role: session.user.role }, 'property:write'))
    return NextResponse.json(
      { error: 'You do not have permission to manage project videos.' },
      { status: 403 },
    )
  const parsed = videoInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return NextResponse.json({ error: 'Please check the project video details.' }, { status: 400 })
  const youtube = parseYouTubeUrl(parsed.data.youtubeUrl)
  if (!youtube)
    return NextResponse.json(
      { error: 'Use a valid YouTube watch, shorts, embed, live or youtu.be URL.' },
      { status: 400 },
    )
  if (!env.DATABASE_URL)
    return NextResponse.json(
      {
        ok: true,
        persisted: false,
        video: {
          ...parsed.data,
          id: `local-${Date.now()}`,
          youtubeId: youtube.youtubeId,
          youtubeUrl: youtube.normalizedUrl,
          thumbnailUrl: youtube.thumbnailUrl,
          projectName:
            projectVideos.find((video) => video.projectSlug === parsed.data.projectSlug)?.projectName ??
            parsed.data.projectSlug,
        },
      },
      { status: 201 },
    )
  try {
    const { db } = await import('@/lib/db')
    const project = await db.project.findUnique({
      where: { slug: parsed.data.projectSlug },
      select: { id: true, name: true },
    })
    if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    const video = await db.projectVideo.create({
      data: {
        ...parsed.data,
        projectId: project.id,
        youtubeId: youtube.youtubeId,
        youtubeUrl: youtube.normalizedUrl,
        thumbnailUrl: youtube.thumbnailUrl,
      },
    })
    return NextResponse.json(
      {
        ok: true,
        persisted: true,
        video: { ...video, projectSlug: parsed.data.projectSlug, projectName: project.name },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('project_video_create_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'The project video could not be saved.' }, { status: 500 })
  }
}

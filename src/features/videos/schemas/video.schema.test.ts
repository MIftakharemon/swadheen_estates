import { describe, expect, it } from 'vitest'
import { parseYouTubeUrl } from '@/features/videos/schemas/video.schema'
import { projectVideos } from '@/data/videos'

describe('project video URL validation', () => {
  it('normalizes watch and Shorts URLs to a stable video id', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=ScMzIvxBSi4')?.youtubeId).toBe('ScMzIvxBSi4')
    expect(parseYouTubeUrl('https://youtube.com/shorts/M7lc1UVf-VE')?.normalizedUrl).toContain('M7lc1UVf-VE')
  })

  it('accepts youtu.be links and rejects unrelated hosts', () => {
    expect(parseYouTubeUrl('https://youtu.be/aqz-KE-bpKQ')?.thumbnailUrl).toContain('aqz-KE-bpKQ')
    expect(parseYouTubeUrl('https://vimeo.com/123456')).toBeNull()
  })

  it('keeps the homepage film catalog aligned with the supplied YouTube links', () => {
    expect(projectVideos.filter((video) => video.kind === 'SHORT')).toHaveLength(9)
    expect(projectVideos.filter((video) => video.kind === 'VIDEO')).toHaveLength(4)
    expect(projectVideos.map((video) => video.youtubeId)).toEqual([
      'uYqTlMWMnZk',
      'j14fWqUluPQ',
      'rQsgbxJ3x0Y',
      'KTuPYHn9IlQ',
      '5-MDnMDODqw',
      'zGODBiDG08A',
      'qw5xuH-VHKM',
      'zngS-txFzK0',
      'VLXSHfJO6JM',
      'YB_RRhM3zjU',
      'mUTCQyYYvuY',
      '35S3Ip1k-no',
      'hFPaD9keGJY',
    ])
  })
})

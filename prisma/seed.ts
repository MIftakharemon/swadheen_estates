import { PrismaClient, PropertyType, PropertyStatus, InventoryStatus } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const seedImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
]

async function main() {
  const manager = await prisma.user.upsert({
    where: { email: 'manager@swadheen.example' },
    update: {},
    create: {
      email: 'manager@swadheen.example',
      name: 'Ayesha Rahman',
      role: 'MANAGER',
      passwordHash: process.env.SEED_ADMIN_PASSWORD
        ? await argon2.hash(process.env.SEED_ADMIN_PASSWORD)
        : null,
    },
  })

  const project = await prisma.project.upsert({
    where: { slug: 'the-grove-bashundhara' },
    update: {},
    create: {
      slug: 'the-grove-bashundhara',
      name: 'The Grove, Bashundhara',
      location: 'Bashundhara R/A, Dhaka',
      description: 'A low-density address shaped around shade, light and everyday rituals.',
      coverImage: seedImages[0] ?? '',
      totalUnits: 48,
    },
  })

  const videos = [
    {
      id: 'video-grove-short-01',
      kind: 'SHORT',
      title: 'Morning light at The Grove',
      description: 'A 30-second walk through the courtyard as the first light reaches home.',
      youtubeUrl: 'https://www.youtube.com/shorts/ScMzIvxBSi4',
      youtubeId: 'ScMzIvxBSi4',
      thumbnailUrl: 'https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg',
      sortOrder: 0,
    },
    {
      id: 'video-grove-short-02',
      kind: 'SHORT',
      title: 'A threshold made for shade',
      description: 'Small architectural details that make arrival feel different.',
      youtubeUrl: 'https://www.youtube.com/shorts/M7lc1UVf-VE',
      youtubeId: 'M7lc1UVf-VE',
      thumbnailUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
      sortOrder: 1,
    },
    {
      id: 'video-grove-film-01',
      kind: 'VIDEO',
      title: 'The Grove: a quieter kind of city life',
      description: 'A three-minute film about the landscape, light and daily rituals behind the project.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      youtubeId: 'ScMzIvxBSi4',
      thumbnailUrl: 'https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
      sortOrder: 0,
    },
  ] as const
  for (const video of videos) {
    await prisma.projectVideo.upsert({
      where: { id: video.id },
      update: video,
      create: { ...video, projectId: project.id, published: true },
    })
  }

  const types = [PropertyType.FLAT, PropertyType.HOUSE, PropertyType.LAND]
  for (let index = 0; index < 20; index += 1) {
    const type = types[index % types.length] ?? PropertyType.FLAT
    await prisma.property.upsert({
      where: { slug: `swadheen-demo-${index + 1}` },
      update: {},
      create: {
        slug: `swadheen-demo-${index + 1}`,
        title: `${type === 'LAND' ? 'Corner plot' : type === 'HOUSE' ? 'Courtyard residence' : 'Light-filled apartment'} ${String(index + 1).padStart(2, '0')}`,
        type,
        status: PropertyStatus.PUBLISHED,
        inventory: index % 7 === 0 ? InventoryStatus.BOOKED : InventoryStatus.AVAILABLE,
        location: index % 2 === 0 ? 'Bashundhara R/A, Dhaka' : 'Uttara, Dhaka',
        city: 'Dhaka',
        description:
          'A considered home with generous daylight, durable materials and a calm relationship to its surroundings.',
        priceMinor: BigInt(12000000 + index * 1750000),
        area: 980 + index * 80,
        bedrooms: type === 'LAND' ? null : 2 + (index % 3),
        bathrooms: type === 'LAND' ? null : 2 + (index % 2),
        floor: type === 'FLAT' ? 2 + (index % 8) : null,
        featured: index < 6,
        verified: true,
        projectId: type === 'FLAT' ? project.id : null,
        publishedAt: new Date(),
        media: {
          create: {
            type: 'IMAGE',
            url: seedImages[index % seedImages.length] ?? seedImages[0],
            altText: 'Swadheen Estates property',
          },
        },
      },
    })
  }

  await prisma.lead.create({
    data: {
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      phone: '+880 1712 345678',
      note: 'Looking for a three-bedroom home near Gulshan.',
      source: 'WEBSITE',
      score: 78,
      assignedTo: manager.id,
      activities: { create: { kind: 'NOTE', body: 'First enquiry received through the website.' } },
    },
  })
}

main().finally(() => prisma.$disconnect())

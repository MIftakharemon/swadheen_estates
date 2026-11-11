import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' },
  engine: 'classic',
  datasource: { url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/swadheen_estates' },
})

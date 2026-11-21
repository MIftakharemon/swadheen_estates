import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { env } from '@/lib/env'
import { mapDbProperty } from '@/features/listings/services/db-property.mapper'
import type { Property } from '@/types/property'

// Staff roles that may browse customer accounts (mirrors the admin layout —
// CUSTOMER itself holds property:read for the public site).
const STAFF_ROLES = ['SUPER_ADMIN', 'MANAGER', 'SALES_AGENT', 'CONTENT_EDITOR']

type CustomerLeadDto = {
  id: string
  name: string
  phone: string
  note: string | null
  stage: string
  source: string
  score: number
  propertyTitle: string | null
  createdAt: string
}

type CustomerDto = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  leadCount: number
  wishlistCount: number
}

type CustomerDetailDto = CustomerDto & {
  leads: CustomerLeadDto[]
  wishlist: Array<Property & { savedAt: string }>
}

// GET /api/admin/users — every signed-up customer with their profile,
// enquiries/viewing requests (leads matched by email) and saved wishlist.
// ?email=… returns the detail payload for one customer.
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const role = session.user.role
  if (!role || !STAFF_ROLES.includes(role) || !can({ userId: session.user.id, role }, 'lead:read'))
    return NextResponse.json(
      { error: 'You do not have permission to view customers.' },
      { status: 403 },
    )

  if (!env.DATABASE_URL) return NextResponse.json({ ok: true, customers: [] })

  try {
    const { db } = await import('@/lib/db')
    const customers = await db.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { savedListings: true, createdLeads: true } } },
    })
    if (customers.length === 0) return NextResponse.json({ ok: true, customers: [] })

    const emails = customers.map((customer) => customer.email)
    const [leads, saved] = await Promise.all([
      db.lead.findMany({
        where: { email: { in: emails } },
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { title: true, slug: true } } },
      }),
      db.savedProperty.findMany({
        where: { userId: { in: customers.map((customer) => customer.id) } },
        orderBy: { createdAt: 'desc' },
        include: { property: true },
      }),
    ])

    const requestedEmail = new URL(request.url).searchParams.get('email')?.toLowerCase()
    const summary: CustomerDto[] = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt.toISOString(),
      leadCount: leads.filter((lead) => lead.email.toLowerCase() === customer.email.toLowerCase())
        .length,
      wishlistCount: customer._count?.savedListings ?? 0,
    }))

    if (requestedEmail) {
      const customer = customers.find((item) => item.email.toLowerCase() === requestedEmail)
      if (!customer)
        return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
      const detail: CustomerDetailDto = {
        ...summary.find((item) => item.id === customer.id)!,
        leads: leads
          .filter((lead) => lead.email.toLowerCase() === requestedEmail)
          .map((lead) => ({
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            note: lead.note,
            stage: lead.stage,
            source: lead.source,
            score: lead.score,
            propertyTitle: lead.property?.title ?? null,
            createdAt: lead.createdAt.toISOString(),
          })),
        wishlist: saved
          .filter((item) => item.userId === customer.id)
          .map((item) => ({
            ...mapDbProperty(item.property),
            savedAt: item.createdAt.toISOString(),
          })),
      }
      return NextResponse.json({ ok: true, customer: detail })
    }

    return NextResponse.json({ ok: true, customers: summary })
  } catch (error) {
    console.error('customer_list_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Customers could not be loaded.' }, { status: 500 })
  }
}

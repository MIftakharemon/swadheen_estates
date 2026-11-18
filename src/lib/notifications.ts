import type { Prisma } from '@prisma/client'

// Shared helpers for the in-app notification API routes.
// "admin" scope = staff notifications (viewing requests, lead updates).
// "user" scope = notifications addressed to the signed-in customer.

export type NotificationScope = 'admin' | 'user'

const SIGNED_OUT_USER = '__signed_out__'

export function scopeFromRequest(request: Request): NotificationScope {
  return new URL(request.url).searchParams.get('scope') === 'user' ? 'user' : 'admin'
}

export function scopeFromBody(body: { scope?: string } | null | undefined): NotificationScope {
  return body?.scope === 'user' ? 'user' : 'admin'
}

export function scopeWhere(
  scope: NotificationScope,
  userId?: string,
): Prisma.NotificationWhereInput {
  return scope === 'admin'
    ? { audience: 'ADMIN' }
    : { audience: 'USER', userId: userId ?? SIGNED_OUT_USER }
}

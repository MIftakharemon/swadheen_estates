'use client'

import { SessionProvider } from 'next-auth/react'

// Client-side session context for components that need the signed-in user
// (header profile menu, wishlist guard). Server components keep using auth().
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

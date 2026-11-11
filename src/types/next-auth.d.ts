import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: 'SUPER_ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'CONTENT_EDITOR' | 'CUSTOMER'
    }
  }

  interface User {
    role?: 'SUPER_ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'CONTENT_EDITOR' | 'CUSTOMER'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'SUPER_ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'CONTENT_EDITOR' | 'CUSTOMER'
  }
}

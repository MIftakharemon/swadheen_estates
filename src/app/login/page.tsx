import { LoginPageContent } from '@/components/auth/login-page'
import { safeRedirect } from '@/lib/utils'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const nextPath = safeRedirect(params.next, '/portal')
  return <LoginPageContent nextPath={nextPath} />
}

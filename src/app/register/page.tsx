import { RegisterPageContent } from '@/components/auth/register-page'
import { safeRedirect } from '@/lib/utils'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const nextPath = safeRedirect(params.next, '/portal')
  return <RegisterPageContent nextPath={nextPath} />
}

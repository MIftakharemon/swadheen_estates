'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'
import type { CopyKey } from '@/i18n/dictionaries'

// Status codes from POST /api/auth/register are mapped to translated messages
// here so the visitor never sees a raw server string.
function messageForStatus(status: number, t: (key: CopyKey) => string): string {
  if (status === 409) return t('form.emailTaken')
  if (status === 429) return t('form.tooManyAttempts')
  if (status === 503) return t('form.accountUnavailable')
  return t('form.registerError')
}

export function RegisterForm({ nextPath }: { nextPath: string }) {
  const { t } = useLocale()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    if (password !== confirmPassword) {
      setError(t('form.passwordMismatch'))
      setPending(false)
      return
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        setError(
          response.status === 400 && body?.error ? body.error : messageForStatus(response.status, t),
        )
        setPending(false)
        return
      }
    } catch {
      setError(t('form.registerError'))
      setPending(false)
      return
    }

    // The account exists — sign in and continue to the requested page.
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: nextPath })
    if (result?.error) {
      // Rare: credentials sign-in failed right after a successful sign-up.
      router.push(`/login?next=${encodeURIComponent(nextPath)}`)
      return
    }
    window.location.assign(nextPath)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-bold">{t('register.name')}</span>
        <div className="relative mt-2">
          <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            required
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('form.yourName')}
            className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-bold">{t('form.email')}</span>
        <div className="relative mt-2">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-bold">{t('form.password')}</span>
        <div className="relative mt-2">
          <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            required
            minLength={10}
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('form.passwordHint')}
            className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-12 text-sm outline-none focus:border-terracotta"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/45"
            aria-label={showPassword ? t('a11y.hidePassword') : t('a11y.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-bold">{t('register.confirmPassword')}</span>
        <div className="relative mt-2">
          <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            required
            minLength={10}
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t('form.passwordHint')}
            className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
          />
        </div>
      </label>
      {error && (
        <p role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          t('register.creating')
        ) : (
          <>
            {t('register.submit')} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
      <p className="flex items-start gap-2 pt-2 text-[10px] leading-4 text-ink/45">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" />
        {t('form.sessionNote')}
      </p>
      <p className="text-center text-xs text-ink/45">
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="font-bold text-terracotta">
          {t('register.haveAccount')} {t('profile.signIn')}
        </Link>
      </p>
    </form>
  )
}

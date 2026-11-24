'use client'

import Link from 'next/link'
import { ChevronLeft, Mail, Phone, UserRound } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'
import type { CopyKey } from '@/i18n/dictionaries'

type ProfileUser = { name: string; email: string; phone: string | null; role: string }

// Status codes from GET/PATCH /api/profile are mapped to translated messages
// here so the member never sees a raw server string.
function messageForStatus(status: number, t: (key: CopyKey) => string): string {
  if (status === 429) return t('form.tooManyAttempts')
  if (status === 503) return t('profile.unavailable')
  return t('profile.saveFailed')
}

// The member's own personal information: name and phone number are editable,
// email is shown read-only because it is the sign-in identity. After a save
// the session is updated with the new name so the header and profile menu
// show it at once, without another sign-in.
export function ProfileForm() {
  const { t } = useLocale()
  const { update } = useSession()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        setError(response.status === 503 ? t('profile.unavailable') : t('profile.loadFailed'))
        setLoading(false)
        return
      }
      const body = (await response.json()) as { user?: ProfileUser }
      if (!body.user) {
        setError(t('profile.loadFailed'))
        setLoading(false)
        return
      }
      setName(body.user.name)
      setPhone(body.user.phone ?? '')
      setEmail(body.user.email)
    } catch {
      setError(t('profile.loadFailed'))
    }
    setLoading(false)
  }

  useEffect(() => {
    void load()
    // Load once when the page opens; saving refreshes the fields from the response.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setSaved(false)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        setError(
          response.status === 400 && body?.error ? body.error : messageForStatus(response.status, t),
        )
        setPending(false)
        return
      }
      const body = (await response.json()) as { user?: ProfileUser }
      if (body.user) {
        setName(body.user.name)
        setPhone(body.user.phone ?? '')
        setEmail(body.user.email)
      }
      // Carry the new name into the session so the header shows it at once.
      await update({ name: body.user?.name ?? name })
      setSaved(true)
    } catch {
      setError(t('profile.saveFailed'))
    }
    setPending(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.14em] text-terracotta"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> {t('profile.mySpace')}
      </Link>
      <p className="eyebrow mt-5">{t('profile.mySpace')}</p>
      <h1 className="display-type mt-3 text-5xl leading-[.9]">{t('profile.personalInfo')}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">{t('profile.personalInfoCopy')}</p>

      <div className="mt-8 rounded-panel border border-line bg-paper p-5 shadow-soft sm:p-7">
        {loading ? (
          <div className="space-y-4" aria-busy="true">
            <div className="h-12 w-full animate-pulse rounded-xl bg-stone" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-stone" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-stone" />
          </div>
        ) : error && !email ? (
          <div>
            <p role="alert" className="text-sm font-semibold text-danger">
              {error}
            </p>
            <Button variant="outline" size="sm" className="mt-5" onClick={() => void load()}>
              {t('tryAgain')}
            </Button>
          </div>
        ) : (
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
                  onChange={(event) => {
                    setName(event.target.value)
                    setSaved(false)
                  }}
                  placeholder={t('form.yourName')}
                  className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold">{t('form.phoneNumber')}</span>
              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value)
                    setSaved(false)
                  }}
                  placeholder="+880 1XXX-XXXXXX"
                  className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold">{t('form.email')}</span>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                <input
                  readOnly
                  type="email"
                  value={email}
                  aria-readonly="true"
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-line bg-stone/60 pl-11 pr-4 text-sm text-ink/60 outline-none"
                />
              </div>
              <span className="mt-2 block text-[10px] leading-4 text-ink/45">
                {t('profile.emailLocked')}
              </span>
            </label>
            {error && (
              <p role="alert" className="text-xs font-semibold text-danger">
                {error}
              </p>
            )}
            {saved && (
              <p role="status" className="text-xs font-semibold text-moss">
                {t('profile.saved')}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? t('profile.saving') : t('profile.saveChanges')}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

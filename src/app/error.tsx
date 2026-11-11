'use client'

import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale()
  return (
    <main className="flex justify-center items-center min-h-screen bg-paper px-6">
      <div className="max-w-md text-center">
        <span className="flex mx-auto justify-center items-center h-14 w-14 rounded-full bg-[hsl(var(--danger)/.1)] text-danger">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="mt-7 eyebrow">{t('error.eyebrow')}</p>
        <h1 className="display-type mt-3 text-5xl">{t('error.title')}</h1>
        <p className="mt-4 text-sm leading-7 text-ink/55">{t('error.copy')}</p>
        <Button className="mt-7" onClick={reset}>
          <RefreshCcw className="h-4 w-4" /> {t('tryAgain')}
        </Button>
      </div>
    </main>
  )
}

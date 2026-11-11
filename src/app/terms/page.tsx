'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useLocale } from '@/i18n/locale-provider'

export default function TermsPage() {
  const { t } = useLocale()
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl container-shell py-16 sm:py-24">
        <p className="eyebrow">{t('legal')}</p>
        <h1 className="display-type mt-4 text-[clamp(3.4rem,15vw,6rem)] leading-[.86]">{t('terms.title')}</h1>
        <div className="mt-10 space-y-7 text-sm leading-8 text-ink/65">
          <p>{t('terms.p1')}</p>
          <p>{t('terms.p2')}</p>
          <p>{t('terms.p3')}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

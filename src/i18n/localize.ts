import type { Locale } from '@/i18n/locale-provider'

export function localizedText(en: string | undefined, bn: string | undefined, locale: Locale): string {
  return locale === 'bn' ? bn ?? en ?? '' : en ?? ''
}

import type { Property } from '@/types/property'

const currencyFormatter = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 0,
})
const numberFormatter = new Intl.NumberFormat('en-BD')

export function formatPrice(value: number): string {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)} Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} Lac`
  return currencyFormatter.format(value).replace('.00', '')
}

export function formatExactPrice(value: number): string {
  return `৳${numberFormatter.format(value)}`
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

// "19 Nov 2026, 14:32" — used wherever an exact request time has to be visible
// (admin viewing-request cards, notification bell).
export function formatDateTime(value: string | Date, locale: 'en' | 'bn' = 'en'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function propertyMeta(property: Property): string {
  const parts = [
    property.beds ? `${property.beds} beds` : null,
    property.baths ? `${property.baths} baths` : null,
    `${formatNumber(property.area)} ${property.areaUnit}`,
  ]
  return parts.filter(Boolean).join(' · ')
}

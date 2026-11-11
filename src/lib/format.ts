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

export function propertyMeta(property: Property): string {
  const parts = [
    property.beds ? `${property.beds} beds` : null,
    property.baths ? `${property.baths} baths` : null,
    `${formatNumber(property.area)} ${property.areaUnit}`,
  ]
  return parts.filter(Boolean).join(' · ')
}

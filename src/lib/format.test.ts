import { describe, expect, it } from 'vitest'
import { formatExactPrice, formatPrice, propertyMeta } from '@/lib/format'

describe('property formatters', () => {
  it('formats crore prices compactly without floating point noise', () => {
    expect(formatPrice(28500000)).toBe('৳2.85 Cr')
    expect(formatPrice(10000000)).toBe('৳1 Cr')
  })

  it('formats exact BDT prices for transactional surfaces', () => {
    expect(formatExactPrice(28500000)).toBe('৳28,500,000')
  })

  it('builds a concise property metadata line', () => {
    expect(propertyMeta({ beds: 3, baths: 3, area: 2180, areaUnit: 'sq ft' } as never)).toBe(
      '3 beds · 3 baths · 2,180 sq ft',
    )
  })
})

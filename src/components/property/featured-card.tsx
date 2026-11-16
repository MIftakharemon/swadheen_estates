import Image from 'next/image'
import Link from 'next/link'
import { Building2, LandPlot } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { Property } from '@/types/property'
import { useLocale } from '@/i18n/locale-provider'
import { localizedText } from '@/i18n/localize'

function TypeIcon({ type }: { type: Property['type'] }) {
  if (type === 'Land') return <LandPlot className="h-3.5 w-3.5" />
  return <Building2 className="h-3.5 w-3.5" />
}

export function FeaturedCard({
  property,
  priority = false,
  sizes = '(max-width: 768px) 86vw, 33vw',
}: {
  property: Property
  priority?: boolean
  sizes?: string
}) {
  const { locale, t } = useLocale()
  const title = localizedText(property.title, property.titleBn, locale)
  const typeLabel = t(`type.${property.type.toLowerCase()}` as 'type.land' | 'type.house' | 'type.flat')

  return (
    <article className="group">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="image-frame aspect-[4/3] overflow-hidden rounded-panel">
          <Image
            src={property.image}
            alt={title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
        <div className="pt-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-terracotta">
            <TypeIcon type={property.type} />
            {typeLabel} · {localizedText(property.location, property.locationBn, locale).split(',')[0]}
          </p>
          <h3 className="display-type mt-2 truncate text-[25px] leading-none transition group-hover:text-terracotta">
            {title}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
            <p className="numeric text-lg font-extrabold">{formatPrice(property.price)}</p>
            <p className="flex items-center gap-1 text-[11px] text-ink/50">
              {property.area.toLocaleString()} {property.areaUnit}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

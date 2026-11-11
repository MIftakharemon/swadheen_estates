import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'max-w-xl')}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-type mt-3 text-4xl leading-[.95] sm:text-5xl">{title}</h2>
        {description && (
          <p className="muted-copy mt-4 max-w-xl text-sm leading-7 sm:text-base">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

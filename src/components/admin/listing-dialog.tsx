'use client'

import { Building2, Home, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'
import { cn } from '@/lib/utils'
import type { AdminProjectDto, AdminPropertyDto } from '@/features/listings/types'

export type ListingKind = 'PROPERTY' | 'PROJECT'

// The dialog works on plain strings/booleans so every input stays controlled;
// the payload is converted to numbers/lists on submit and validated on the
// server against the same schema the API uses.
type PropertyDraft = {
  title: string
  titleBn: string
  slug: string
  type: 'Land' | 'House' | 'Flat'
  availability: 'Available' | 'Booked' | 'Sold' | 'Upcoming'
  published: boolean
  location: string
  locationBn: string
  price: string
  area: string
  areaUnit: 'sq ft' | 'katha'
  beds: string
  baths: string
  floor: string
  facing: string
  image: string
  galleryText: string
  summary: string
  summaryBn: string
  description: string
  descriptionBn: string
  amenitiesText: string
  amenitiesBnText: string
  badgesText: string
  featured: boolean
  verified: boolean
  has3d: boolean
  has360: boolean
  hasVideo: boolean
  projectSlug: string
  completion: string
  focalX: string
  focalY: string
}

type ProjectDraft = {
  name: string
  slug: string
  location: string
  description: string
  coverImage: string
  totalUnits: string
  deliveredAt: string
}

const emptyPropertyDraft: PropertyDraft = {
  title: '',
  titleBn: '',
  slug: '',
  type: 'Flat',
  availability: 'Available',
  published: true,
  location: '',
  locationBn: '',
  price: '',
  area: '',
  areaUnit: 'sq ft',
  beds: '',
  baths: '',
  floor: '',
  facing: '',
  image: '',
  galleryText: '',
  summary: '',
  summaryBn: '',
  description: '',
  descriptionBn: '',
  amenitiesText: '',
  amenitiesBnText: '',
  badgesText: '',
  featured: false,
  verified: false,
  has3d: false,
  has360: false,
  hasVideo: false,
  projectSlug: '',
  completion: '',
  focalX: '50',
  focalY: '50',
}

const emptyProjectDraft: ProjectDraft = {
  name: '',
  slug: '',
  location: '',
  description: '',
  coverImage: '',
  totalUnits: '',
  deliveredAt: '',
}

function propertyToDraft(property: AdminPropertyDto): PropertyDraft {
  return {
    title: property.title,
    titleBn: property.titleBn ?? '',
    slug: property.slug,
    type: property.type,
    availability: property.status,
    published: property.dbStatus === 'PUBLISHED',
    location: property.location,
    locationBn: property.locationBn ?? '',
    price: String(property.price),
    area: String(property.area),
    areaUnit: property.areaUnit === 'katha' ? 'katha' : 'sq ft',
    beds: property.beds !== null && property.beds !== undefined ? String(property.beds) : '',
    baths: property.baths !== null && property.baths !== undefined ? String(property.baths) : '',
    floor: property.floor ?? '',
    facing: property.facing ?? '',
    image: property.image,
    galleryText: property.gallery.join('\n'),
    summary: property.summary,
    summaryBn: property.summaryBn ?? '',
    description: property.description,
    descriptionBn: property.descriptionBn ?? '',
    amenitiesText: property.amenities.join('\n'),
    amenitiesBnText: (property.amenitiesBn ?? []).join('\n'),
    badgesText: property.badges.join('\n'),
    featured: property.featured,
    verified: property.verified,
    has3d: property.has3d,
    has360: property.has360,
    hasVideo: property.hasVideo,
    projectSlug: property.projectSlug ?? '',
    completion: property.completion ?? '',
    focalX: String(property.focalPoint.x),
    focalY: String(property.focalPoint.y),
  }
}

function projectToDraft(project: AdminProjectDto): ProjectDraft {
  return {
    name: project.name,
    slug: project.slug,
    location: project.location,
    description: project.description,
    coverImage: project.coverImage,
    totalUnits: String(project.totalUnits),
    deliveredAt: project.deliveredAt ? project.deliveredAt.slice(0, 10) : '',
  }
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function toNumber(value: string, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const inputClass =
  'mt-2 h-11 w-full rounded-xl border border-line bg-stone px-3 text-sm outline-none focus:border-terracotta'
const textareaClass =
  'mt-2 w-full rounded-xl border border-line bg-stone px-3 py-2 text-sm leading-6 outline-none focus:border-terracotta'

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="text-xs font-bold">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[10px] leading-4 text-ink/40">{hint}</span> : null}
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="col-span-full border-b border-line pb-2 text-[10px] font-bold uppercase tracking-[.14em] text-ink/40">
      {children}
    </p>
  )
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-ink/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-line accent-[hsl(var(--terracotta))]"
      />
      {label}
    </label>
  )
}

type ListingDialogProps = {
  // null kind + create mode → the Property-or-Project chooser shows first.
  kind: ListingKind | null
  mode: 'create' | 'edit'
  property?: AdminPropertyDto | null
  project?: AdminProjectDto | null
  projects: AdminProjectDto[]
  onClose: () => void
  onSaved: () => void
}

export function ListingDialog({
  kind: initialKind,
  mode,
  property,
  project,
  projects,
  onClose,
  onSaved,
}: ListingDialogProps) {
  const { t } = useLocale()
  const [kind, setKind] = useState<ListingKind | null>(initialKind)
  const [propertyDraft, setPropertyDraft] = useState<PropertyDraft>(
    property ? propertyToDraft(property) : emptyPropertyDraft,
  )
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(
    project ? projectToDraft(project) : emptyProjectDraft,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const setProperty = <K extends keyof PropertyDraft>(key: K, value: PropertyDraft[K]) =>
    setPropertyDraft((current) => ({ ...current, [key]: value }))
  const setProject = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) =>
    setProjectDraft((current) => ({ ...current, [key]: value }))

  const submit = async () => {
    setError(null)
    if (kind === 'PROPERTY') {
      const draft = propertyDraft
      if (!draft.title.trim() || !draft.slug.trim() || !draft.location.trim() || !draft.price || !draft.area) {
        setError(t('admin.requiredFields'))
        return
      }
    } else if (kind === 'PROJECT') {
      const draft = projectDraft
      if (!draft.name.trim() || !draft.slug.trim() || !draft.location.trim()) {
        setError(t('admin.requiredFields'))
        return
      }
    } else {
      return
    }
    setSaving(true)
    try {
      const payload =
        kind === 'PROPERTY'
          ? {
              kind: 'PROPERTY' as const,
              property: {
                slug: propertyDraft.slug.trim(),
                title: propertyDraft.title.trim(),
                titleBn: propertyDraft.titleBn.trim(),
                type: propertyDraft.type,
                status: propertyDraft.availability,
                published: propertyDraft.published,
                location: propertyDraft.location.trim(),
                locationBn: propertyDraft.locationBn.trim(),
                price: toNumber(propertyDraft.price),
                area: toNumber(propertyDraft.area),
                areaUnit: propertyDraft.areaUnit,
                beds: propertyDraft.beds === '' ? null : toNumber(propertyDraft.beds),
                baths: propertyDraft.baths === '' ? null : toNumber(propertyDraft.baths),
                floor: propertyDraft.floor.trim(),
                facing: propertyDraft.facing.trim(),
                image: propertyDraft.image.trim(),
                gallery: splitLines(propertyDraft.galleryText),
                summary: propertyDraft.summary.trim(),
                summaryBn: propertyDraft.summaryBn.trim(),
                description: propertyDraft.description.trim(),
                descriptionBn: propertyDraft.descriptionBn.trim(),
                amenities: splitLines(propertyDraft.amenitiesText),
                amenitiesBn: splitLines(propertyDraft.amenitiesBnText),
                badges: splitLines(propertyDraft.badgesText),
                featured: propertyDraft.featured,
                verified: propertyDraft.verified,
                has3d: propertyDraft.has3d,
                has360: propertyDraft.has360,
                hasVideo: propertyDraft.hasVideo,
                projectSlug: propertyDraft.projectSlug.trim(),
                completion: propertyDraft.completion.trim(),
                focalX: toNumber(propertyDraft.focalX, 50),
                focalY: toNumber(propertyDraft.focalY, 50),
              },
            }
          : {
              kind: 'PROJECT' as const,
              project: {
                slug: projectDraft.slug.trim(),
                name: projectDraft.name.trim(),
                location: projectDraft.location.trim(),
                description: projectDraft.description.trim(),
                coverImage: projectDraft.coverImage.trim(),
                totalUnits: toNumber(projectDraft.totalUnits),
                deliveredAt: projectDraft.deliveredAt,
              },
            }
      const response = await fetch(
        mode === 'create'
          ? '/api/admin/listings'
          : `/api/admin/listings/${kind === 'PROPERTY' ? property?.id : project?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        setError(body?.error ?? t('admin.saveFailed'))
        return
      }
      onSaved()
    } catch {
      setError(t('admin.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const title =
    mode === 'edit'
      ? kind === 'PROJECT'
        ? t('admin.editProject')
        : t('admin.editProperty')
      : kind === 'PROPERTY'
        ? t('admin.newProperty')
        : kind === 'PROJECT'
          ? t('admin.newProject')
          : t('admin.chooseKind')

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/45 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative mx-auto my-6 w-full max-w-3xl rounded-panel border border-line bg-paper shadow-float">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow">{t('admin.inventory')}</p>
            <h2 className="display-type mt-2 text-3xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone transition hover:bg-line"
            aria-label={t('admin.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          {kind === null ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setKind('PROPERTY')}
                className="rounded-panel border border-line bg-stone/50 p-6 text-left transition hover:-translate-y-0.5 hover:border-terracotta hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                  <Home className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-sm font-extrabold">{t('admin.kindProperty')}</span>
                <span className="mt-2 block text-xs leading-5 text-ink/55">
                  {t('admin.kindPropertyHint')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setKind('PROJECT')}
                className="rounded-panel border border-line bg-stone/50 p-6 text-left transition hover:-translate-y-0.5 hover:border-terracotta hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss/15 text-ink">
                  <Building2 className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-sm font-extrabold">{t('admin.kindProject')}</span>
                <span className="mt-2 block text-xs leading-5 text-ink/55">
                  {t('admin.kindProjectHint')}
                </span>
              </button>
            </div>
          ) : kind === 'PROPERTY' ? (
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <SectionTitle>{t('admin.form.basics')}</SectionTitle>
              <Field label={t('admin.form.titleEn')}>
                <input
                  className={inputClass}
                  value={propertyDraft.title}
                  onChange={(event) => setProperty('title', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.titleBn')}>
                <input
                  className={inputClass}
                  value={propertyDraft.titleBn}
                  onChange={(event) => setProperty('titleBn', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.slug')} hint={t('admin.form.slugHint')}>
                <input
                  className={inputClass}
                  value={propertyDraft.slug}
                  onChange={(event) => setProperty('slug', event.target.value)}
                  placeholder="gulshan-garden-house"
                />
              </Field>
              <Field label={t('admin.form.type')}>
                <select
                  className={inputClass}
                  value={propertyDraft.type}
                  onChange={(event) => setProperty('type', event.target.value as PropertyDraft['type'])}
                >
                  <option value="Land">{t('type.land')}</option>
                  <option value="House">{t('type.house')}</option>
                  <option value="Flat">{t('type.flat')}</option>
                </select>
              </Field>
              <Field label={t('admin.form.locationEn')}>
                <input
                  className={inputClass}
                  value={propertyDraft.location}
                  onChange={(event) => setProperty('location', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.locationBn')}>
                <input
                  className={inputClass}
                  value={propertyDraft.locationBn}
                  onChange={(event) => setProperty('locationBn', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.availability')}>
                <select
                  className={inputClass}
                  value={propertyDraft.availability}
                  onChange={(event) =>
                    setProperty('availability', event.target.value as PropertyDraft['availability'])
                  }
                >
                  <option value="Available">{t('available')}</option>
                  <option value="Booked">{t('booked')}</option>
                  <option value="Sold">{t('sold')}</option>
                  <option value="Upcoming">{t('upcoming')}</option>
                </select>
              </Field>
              <Field label={t('admin.form.publishStatus')}>
                <select
                  className={inputClass}
                  value={propertyDraft.published ? 'published' : 'draft'}
                  onChange={(event) => setProperty('published', event.target.value === 'published')}
                >
                  <option value="published">{t('admin.form.published')}</option>
                  <option value="draft">{t('admin.form.draft')}</option>
                </select>
              </Field>

              <SectionTitle>{t('admin.form.pricingSpecs')}</SectionTitle>
              <Field label={t('admin.form.price')}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={propertyDraft.price}
                  onChange={(event) => setProperty('price', event.target.value)}
                  placeholder="28500000"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('admin.form.area')}>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    value={propertyDraft.area}
                    onChange={(event) => setProperty('area', event.target.value)}
                  />
                </Field>
                <Field label={t('admin.form.areaUnit')}>
                  <select
                    className={inputClass}
                    value={propertyDraft.areaUnit}
                    onChange={(event) =>
                      setProperty('areaUnit', event.target.value as PropertyDraft['areaUnit'])
                    }
                  >
                    <option value="sq ft">sq ft</option>
                    <option value="katha">katha</option>
                  </select>
                </Field>
              </div>
              <Field label={t('admin.form.beds')}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={propertyDraft.beds}
                  onChange={(event) => setProperty('beds', event.target.value)}
                  placeholder="3"
                />
              </Field>
              <Field label={t('admin.form.baths')}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={propertyDraft.baths}
                  onChange={(event) => setProperty('baths', event.target.value)}
                  placeholder="3"
                />
              </Field>
              <Field label={t('admin.form.floor')}>
                <input
                  className={inputClass}
                  value={propertyDraft.floor}
                  onChange={(event) => setProperty('floor', event.target.value)}
                  placeholder="Level 03"
                />
              </Field>
              <Field label={t('admin.form.facing')}>
                <input
                  className={inputClass}
                  value={propertyDraft.facing}
                  onChange={(event) => setProperty('facing', event.target.value)}
                  placeholder="South-east"
                />
              </Field>
              <Field label={t('admin.form.project')}>
                <select
                  className={inputClass}
                  value={propertyDraft.projectSlug}
                  onChange={(event) => setProperty('projectSlug', event.target.value)}
                >
                  <option value="">{t('admin.form.noProject')}</option>
                  {projects.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('admin.form.completion')}>
                <input
                  className={inputClass}
                  value={propertyDraft.completion}
                  onChange={(event) => setProperty('completion', event.target.value)}
                  placeholder="Ready to move"
                />
              </Field>

              <SectionTitle>{t('admin.form.mediaCopy')}</SectionTitle>
              <Field label={t('admin.form.image')} className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={propertyDraft.image}
                  onChange={(event) => setProperty('image', event.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field
                label={t('admin.form.gallery')}
                hint={t('admin.form.galleryHint')}
                className="sm:col-span-2"
              >
                <textarea
                  className={textareaClass}
                  rows={3}
                  value={propertyDraft.galleryText}
                  onChange={(event) => setProperty('galleryText', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.summary')}>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={propertyDraft.summary}
                  onChange={(event) => setProperty('summary', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.summaryBn')}>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={propertyDraft.summaryBn}
                  onChange={(event) => setProperty('summaryBn', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.description')}>
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={propertyDraft.description}
                  onChange={(event) => setProperty('description', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.descriptionBn')}>
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={propertyDraft.descriptionBn}
                  onChange={(event) => setProperty('descriptionBn', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.amenities')} hint={t('admin.form.linesHint')}>
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={propertyDraft.amenitiesText}
                  onChange={(event) => setProperty('amenitiesText', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.amenitiesBn')} hint={t('admin.form.linesHint')}>
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={propertyDraft.amenitiesBnText}
                  onChange={(event) => setProperty('amenitiesBnText', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.badges')} hint={t('admin.form.badgesHint')}>
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={propertyDraft.badgesText}
                  onChange={(event) => setProperty('badgesText', event.target.value)}
                />
              </Field>

              <SectionTitle>{t('admin.form.options')}</SectionTitle>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <CheckField
                  label={t('admin.form.featured')}
                  checked={propertyDraft.featured}
                  onChange={(value) => setProperty('featured', value)}
                />
                <CheckField
                  label={t('admin.form.verified')}
                  checked={propertyDraft.verified}
                  onChange={(value) => setProperty('verified', value)}
                />
                <CheckField
                  label={t('admin.form.has3d')}
                  checked={propertyDraft.has3d}
                  onChange={(value) => setProperty('has3d', value)}
                />
                <CheckField
                  label={t('admin.form.has360')}
                  checked={propertyDraft.has360}
                  onChange={(value) => setProperty('has360', value)}
                />
                <CheckField
                  label={t('admin.form.hasVideo')}
                  checked={propertyDraft.hasVideo}
                  onChange={(value) => setProperty('hasVideo', value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('admin.form.focalX')} hint={t('admin.form.focalHint')}>
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    value={propertyDraft.focalX}
                    onChange={(event) => setProperty('focalX', event.target.value)}
                  />
                </Field>
                <Field label={t('admin.form.focalY')}>
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    value={propertyDraft.focalY}
                    onChange={(event) => setProperty('focalY', event.target.value)}
                  />
                </Field>
              </div>
            </div>
          ) : (
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <SectionTitle>{t('admin.form.basics')}</SectionTitle>
              <Field label={t('admin.form.projectName')}>
                <input
                  className={inputClass}
                  value={projectDraft.name}
                  onChange={(event) => setProject('name', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.slug')} hint={t('admin.form.slugHint')}>
                <input
                  className={inputClass}
                  value={projectDraft.slug}
                  onChange={(event) => setProject('slug', event.target.value)}
                  placeholder="parkside-banani"
                />
              </Field>
              <Field label={t('admin.form.locationEn')}>
                <input
                  className={inputClass}
                  value={projectDraft.location}
                  onChange={(event) => setProject('location', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.totalUnits')}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={projectDraft.totalUnits}
                  onChange={(event) => setProject('totalUnits', event.target.value)}
                  placeholder="48"
                />
              </Field>
              <Field label={t('admin.form.coverImage')}>
                <input
                  className={inputClass}
                  value={projectDraft.coverImage}
                  onChange={(event) => setProject('coverImage', event.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label={t('admin.form.deliveredAt')}>
                <input
                  className={inputClass}
                  type="date"
                  value={projectDraft.deliveredAt}
                  onChange={(event) => setProject('deliveredAt', event.target.value)}
                />
              </Field>
              <Field label={t('admin.form.projectDescription')} className="sm:col-span-2">
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={projectDraft.description}
                  onChange={(event) => setProject('description', event.target.value)}
                />
              </Field>
            </div>
          )}

          {error ? (
            <p className="mt-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs font-bold text-danger">
              {error}
            </p>
          ) : null}
        </div>

        {kind !== null ? (
          <div className="flex flex-col-reverse gap-3 border-t border-line px-6 py-5 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? t('admin.saving') : t('admin.saveChanges')}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

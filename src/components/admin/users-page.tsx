'use client'

import { Heart, Mail, MessageSquare, Phone, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'
import { localizedText } from '@/i18n/localize'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

type CustomerLead = {
  id: string
  name: string
  phone: string
  note: string | null
  stage: string
  source: string
  score: number
  propertyTitle: string | null
  createdAt: string
}

type CustomerSummary = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  leadCount: number
  wishlistCount: number
}

type CustomerDetail = CustomerSummary & {
  leads: CustomerLead[]
  wishlist: Array<Property & { savedAt: string }>
}

const STAGE_LABELS: Record<string, string> = {
  NEW: 'admin.stageNew',
  CONTACTED: 'admin.stageContacted',
  VISIT_SCHEDULED: 'admin.stageVisitScheduled',
  NEGOTIATION: 'admin.stageNegotiation',
  BOOKED: 'admin.stageBooked',
  CLOSED_WON: 'admin.stageClosedWon',
  CLOSED_LOST: 'admin.stageClosedLost',
}

type Tab = 'profile' | 'messages' | 'wishlist'

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Signed-up customers: the list is every CUSTOMER account; picking one loads
// their profile, enquiries/viewing requests and saved wishlist.
export function AdminUsersPage() {
  const { t, locale } = useLocale()
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailFailed, setDetailFailed] = useState(false)
  const [tab, setTab] = useState<Tab>('profile')

  useEffect(() => {
    fetch('/api/admin/users')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('load'))))
      .then((data: { customers?: CustomerSummary[] }) => setCustomers(data.customers ?? []))
      .catch(() => setLoadFailed(true))
      .finally(() => setLoaded(true))
  }, [])

  const lowerQuery = query.trim().toLowerCase()
  const filtered = customers.filter((item) =>
    `${item.name} ${item.email} ${item.phone ?? ''}`.toLowerCase().includes(lowerQuery),
  )

  const openCustomer = (customer: CustomerSummary) => {
    setDetailLoading(true)
    setDetailFailed(false)
    setTab('profile')
    fetch(`/api/admin/users?email=${encodeURIComponent(customer.email)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('load'))))
      .then((data: { customer?: CustomerDetail }) => {
        setSelected(data.customer ?? null)
        if (!data.customer) setDetailFailed(true)
      })
      .catch(() => {
        setSelected(null)
        setDetailFailed(true)
      })
      .finally(() => setDetailLoading(false))
  }

  const stageLabel = (stage: string) => {
    const key = STAGE_LABELS[stage]
    return key ? t(key as 'admin.stageNew') : stage
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{t('admin.workspace')}</p>
          <h1 className="display-type mt-3 text-5xl">{t('admin.users')}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">{t('users.copy')}</p>
        </div>
        <p className="text-sm font-bold text-ink/50">
          {`${customers.length} ${t('users.customerCount')}`}
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-panel border border-line bg-paper shadow-soft">
          <label className="flex h-12 items-center gap-2 border-b border-line px-4">
            <Search className="h-4 w-4 shrink-0 text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('users.search')}
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink/35"
            />
          </label>
          {!loaded ? (
            <p className="px-5 py-10 text-center text-xs font-semibold text-ink/45">
              {t('notif.loading')}
            </p>
          ) : loadFailed ? (
            <p className="px-5 py-10 text-center text-xs font-bold text-danger">
              {t('users.loadFailed')}
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-xs font-semibold text-ink/45">
              {t('users.empty')}
            </p>
          ) : (
            <ul className="max-h-[640px] divide-y divide-line overflow-y-auto">
              {filtered.map((customer) => (
                <li key={customer.id}>
                  <button
                    type="button"
                    onClick={() => openCustomer(customer)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-stone/50',
                      selected?.id === customer.id && 'bg-stone/70',
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-xs font-extrabold text-terracotta">
                      {initialsOf(customer.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{customer.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-ink/45">
                        {customer.email}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-bold text-ink/45">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {customer.leadCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {customer.wishlistCount}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-panel border border-line bg-paper shadow-soft">
          {detailLoading ? (
            <p className="px-5 py-16 text-center text-xs font-semibold text-ink/45">
              {t('notif.loading')}
            </p>
          ) : detailFailed ? (
            <p className="px-5 py-16 text-center text-xs font-bold text-danger">
              {t('users.loadFailed')}
            </p>
          ) : !selected ? (
            <p className="px-5 py-16 text-center text-sm font-semibold text-ink/45">
              {t('users.selectPrompt')}
            </p>
          ) : (
            <div>
              <div className="flex items-start gap-4 border-b border-line p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-base font-extrabold text-terracotta">
                  {initialsOf(selected.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-extrabold">{selected.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-ink/55">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {selected.email}
                  </p>
                  {selected.phone ? (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
                      <Phone className="h-3.5 w-3.5 shrink-0" /> {selected.phone}
                    </p>
                  ) : null}
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink/40">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    {t('users.joined')} {formatDateTime(selected.createdAt, locale)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border-b border-line px-5 py-3">
                {(['profile', 'messages', 'wishlist'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-bold transition',
                      tab === item ? 'bg-ink text-paper' : 'text-ink/50 hover:bg-stone',
                    )}
                  >
                    {t(
                      item === 'profile'
                        ? 'users.tabProfile'
                        : item === 'messages'
                          ? 'users.tabMessages'
                          : 'users.tabWishlist',
                    )}
                    <span className="ml-1.5 text-[10px] opacity-60">
                      {item === 'profile' ? '' : item === 'messages' ? selected.leadCount : selected.wishlistCount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-5">
                {tab === 'profile' ? (
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-stone p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/40">
                        {t('form.email')}
                      </dt>
                      <dd className="mt-1.5 break-all text-sm font-bold">{selected.email}</dd>
                    </div>
                    <div className="rounded-xl bg-stone p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/40">
                        {t('form.phoneNumber')}
                      </dt>
                      <dd className="mt-1.5 text-sm font-bold">{selected.phone || '—'}</dd>
                    </div>
                    <div className="rounded-xl bg-stone p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/40">
                        {t('users.joined')}
                      </dt>
                      <dd className="mt-1.5 text-sm font-bold">
                        {formatDateTime(selected.createdAt, locale)}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-stone p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/40">
                        {t('users.accountType')}
                      </dt>
                      <dd className="mt-1.5 text-sm font-bold">{t('users.customerRole')}</dd>
                    </div>
                  </dl>
                ) : tab === 'messages' ? (
                  selected.leadCount === 0 ? (
                    <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm font-semibold text-ink/45">
                      {t('users.noMessages')}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {selected.leads.map((lead) => (
                        <li key={lead.id} className="rounded-xl border border-line p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-bold">
                              {lead.propertyTitle ?? t('users.generalEnquiry')}
                            </p>
                            <Badge>{stageLabel(lead.stage)}</Badge>
                          </div>
                          {lead.note ? (
                            <p className="mt-2 text-sm leading-6 text-ink/60">{lead.note}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink/45">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {lead.phone}
                            </span>
                            <span>{formatDateTime(lead.createdAt, locale)}</span>
                            <span>
                              {t('users.source')}: {lead.source}
                            </span>
                            <span>
                              {t('admin.score')}: {lead.score}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                ) : selected.wishlistCount === 0 ? (
                  <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm font-semibold text-ink/45">
                    {t('users.noWishlist')}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {selected.wishlist.map((item) => (
                      <li
                        key={item.slug}
                        className="flex items-center gap-4 rounded-xl border border-line p-3"
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt=""
                            className="h-16 w-24 shrink-0 rounded-lg object-cover"
                          />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {localizedText(item.title, item.titleBn, locale)}
                          </p>
                          <p className="mt-1 truncate text-xs text-ink/45">
                            {localizedText(item.location, item.locationBn, locale)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <StatusBadge status={item.status} />
                            <span className="text-[10px] text-ink/40">
                              {t('users.savedAt')} {formatDateTime(item.savedAt, locale)}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/properties/${item.slug}`}
                          className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[11px] font-bold transition hover:border-terracotta hover:text-terracotta"
                        >
                          {t('users.viewListing')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selected ? (
        <div className="mt-4 flex justify-end xl:hidden">
          <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
            {t('users.backToList')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

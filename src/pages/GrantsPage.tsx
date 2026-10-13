import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import '../components/grants/grants.css'
import { GRANTS_INTRO, GRANTS_DISCLAIMER, GRANT_CATEGORIES, GRANTS_CLOSING, GRANT_COUNT, type Grant } from '../lib/grants'
import { parseDeadline, statusOf, statusLabel, lagosToday, type Deadline, type GrantStatus } from '../lib/grantStatus'
import DeadlineCalendar from '../components/grants/DeadlineCalendar'
import GrantsToolbar, { HIDE_CLOSED_ID, type SortMode, type CategoryOption } from '../components/grants/GrantsToolbar'
import GrantRow from '../components/grants/GrantRow'

// Short chip labels for the filter bar. The full category titles from
// grants.ts are still the section headings.
const CATEGORY_SHORT: Partial<Record<string, string>> = {
  'category-a': 'Students',
  'category-b': 'Lecturers',
  'category-c': 'Women',
  'category-d': 'NGOs & CSOs',
  'category-e': 'Founders',
}

const SOCIAL_ICONS: Partial<Record<string, { Icon: IconType; name: string }>> = {
  'ON INSTAGRAM:': { Icon: FaInstagram, name: 'Instagram' },
  'ON TIKTOK:': { Icon: FaTiktok, name: 'TikTok' },
  'ON X:': { Icon: FaXTwitter, name: 'X' },
  'ON YOUTUBE:': { Icon: FaYoutube, name: 'YouTube' },
}

const ease = [0.23, 1, 0.32, 1] as const
const focusOnDark = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ivory)]'

type Entry = {
  grant: Grant
  categoryId: string
  letter: string
  deadline: Deadline | null
  status: GrantStatus
  statusText: string
}

export default function GrantsPage() {
  useEffect(() => {
    document.title = 'Opportunity Grants — October 2026 — Tito Finance'
  }, [])

  // Re-read the clock each minute so a tab left open past midnight in Lagos
  // moves grants to "Closed" on time.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const [category, setCategory] = useState('all')
  const [hideClosed, setHideClosed] = useState(false)
  const [sort, setSort] = useState<SortMode>('list')
  const toolbarRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const entries = useMemo<Entry[]>(
    () =>
      GRANT_CATEGORIES.flatMap((cat) =>
        cat.grants.map((grant) => {
          const deadline = parseDeadline(grant.deadline)
          return {
            grant,
            categoryId: cat.id,
            letter: cat.id.slice(-1).toUpperCase(),
            deadline,
            status: statusOf(deadline, now),
            statusText: statusLabel(deadline, now),
          }
        }),
      ),
    [now],
  )

  const openCount = entries.filter((e) => e.status !== 'closed').length
  const soonCount = entries.filter((e) => e.status === 'soon').length
  const closedCount = GRANT_COUNT - openCount

  const options: CategoryOption[] = GRANT_CATEGORIES.map((c) => ({
    id: c.id,
    letter: c.id.slice(-1).toUpperCase(),
    label: CATEGORY_SHORT[c.id] ?? c.title,
    count: c.grants.length,
  }))

  const visible = entries.filter((e) => (category === 'all' || e.categoryId === category) && !(hideClosed && e.status === 'closed'))
  const byDeadline = [...visible].sort(
    (a, b) => Number(a.status === 'closed') - Number(b.status === 'closed') || (a.deadline?.closesAt ?? 0) - (b.deadline?.closesAt ?? 0) || a.grant.n - b.grant.n,
  )

  // Filter changes land the reader at the top of the results, but only once
  // the toolbar is pinned; from the hero the page shouldn't jump.
  const keepResultsInView = () => {
    const list = listRef.current
    const bar = toolbarRef.current
    if (!list || !bar) return
    const barHeight = bar.getBoundingClientRect().height
    const top = list.getBoundingClientRect().top
    if (top < barHeight) window.scrollTo({ top: window.scrollY + top - barHeight, behavior: 'auto' })
  }
  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    requestAnimationFrame(keepResultsInView)
  }

  const today = lagosToday(now)
  const titleOf = Object.fromEntries(GRANT_CATEGORIES.map((c) => [c.id, c.title]))

  return (
    <MotionConfig reducedMotion="user">
      <div className="gp">
        <a
          href="#grants-list"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:rounded-full focus:bg-[var(--ink)] focus:text-[var(--ivory)] focus:px-4 focus:py-2 focus:text-[14px]"
        >
          Skip to the grants
        </a>

        <header className="bg-[var(--forest)] px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between">
            <a href="/" className={`flex items-center ${focusOnDark}`}>
              <img src="/tf-icon-white.png" alt="Tito Finance home" className="h-[32px] w-auto" draggable={false} />
            </a>
            <a href="/" className={`gp-press text-[14px] font-medium text-[rgba(248,245,238,0.85)] hover:text-[var(--gold)] ${focusOnDark}`}>
              Main site
            </a>
          </div>
        </header>

        <main>
          {/* ── HERO: title, the list's own intro, live counts, the calendar ── */}
          <section className="bg-[var(--forest)] text-[var(--ivory)] px-4 md:px-8 pt-10 md:pt-16 pb-12 md:pb-16">
            <div className="max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-16 items-end">
                <div>
                  <h1 className="gp-serif italic font-normal text-[clamp(2.6rem,6.4vw,5.25rem)] leading-[1.02] tracking-[-0.02em] pb-1">
                    Opportunity Grants — October 2026
                  </h1>
                  <div className="mt-6 max-w-[58ch] space-y-1">
                    {GRANTS_INTRO.map((line) => (
                      <p key={line} className="text-[14px] md:text-[15px] leading-[1.7] tracking-[0.02em] text-[rgba(248,245,238,0.82)]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease }}
                  className="lg:pb-2 border-t border-[rgba(248,245,238,0.18)] pt-5 lg:border-t-0 lg:pt-0"
                >
                  {openCount > 0 ? (
                    <p className="gp-serif text-[1.65rem] md:text-[2rem] leading-[1.2]">
                      <span className="gp-num font-semibold text-[var(--gold)]">{openCount}</span> of {GRANT_COUNT} still open today.{' '}
                      {soonCount > 0 && (
                        <>
                          <span className="gp-num font-semibold text-[var(--gold)]">{soonCount}</span> close within a week.
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="gp-serif text-[1.65rem] md:text-[2rem] leading-[1.2]">Every grant on this list has now closed.</p>
                  )}
                  <a
                    href="#grants-list"
                    className={`gp-press mt-5 inline-flex items-center gap-3 rounded-full bg-[var(--gold)] text-[var(--ink)] pl-5 pr-1.5 py-1.5 text-[15px] font-medium hover:bg-[#d6b864] ${focusOnDark}`}
                  >
                    Browse the grants
                    <span aria-hidden="true" className="w-8 h-8 rounded-full bg-[var(--ink)] text-[var(--gold)] flex items-center justify-center">↓</span>
                  </a>
                </motion.div>
              </div>

              <div className="mt-12 md:mt-16">
                <DeadlineCalendar deadlines={entries.flatMap((e) => (e.deadline ? [e.deadline] : []))} today={today} />
              </div>
            </div>
          </section>

          {/* ── DISCLAIMER ── */}
          <section aria-labelledby="grants-disclaimer" className="px-4 md:px-8 pt-12 md:pt-16">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] gap-4 md:gap-12 rounded-xl border border-[var(--rule)] bg-white p-5 md:p-10">
              <h2 id="grants-disclaimer" className="gp-serif text-[1.5rem] md:text-[1.75rem] leading-[1.15] font-semibold text-[var(--forest)]">
                {GRANTS_DISCLAIMER.title}
              </h2>
              <div className="space-y-3 text-[15px] leading-[1.7] max-w-[68ch]">
                {GRANTS_DISCLAIMER.lead.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="font-medium text-[var(--forest)] pt-1">{GRANTS_DISCLAIMER.adviseTitle}</p>
                <ul className="space-y-1.5">
                  {GRANTS_DISCLAIMER.advise.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-3 shrink-0 bg-[var(--gold)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {GRANTS_DISCLAIMER.closing.map((p) => (
                  <p key={p} className="whitespace-pre-wrap">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* ── THE LIST ── */}
          <div className="mt-12 md:mt-16">
            <GrantsToolbar
              ref={toolbarRef}
              options={options}
              total={GRANT_COUNT}
              active={category}
              onCategory={change(setCategory)}
              hideClosed={hideClosed}
              closedCount={closedCount}
              onHideClosed={change(setHideClosed)}
              sort={sort}
              onSort={change(setSort)}
              shown={visible.length}
            />

            <div id="grants-list" ref={listRef} className="px-4 md:px-8 pb-20 md:pb-28">
              <div className="max-w-[1200px] mx-auto">
                {visible.length === 0 ? (
                  <div className="py-20 md:py-28 max-w-[40ch]">
                    <p className="gp-serif text-[1.9rem] leading-[1.2] text-[var(--ink)]">No open grants match these filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        change(setHideClosed)(false)
                        requestAnimationFrame(() => document.getElementById(HIDE_CLOSED_ID)?.focus())
                      }}
                      className="gp-press mt-5 rounded-full border border-[var(--forest)] px-5 h-10 text-[15px] font-medium text-[var(--forest)] hover:bg-[var(--tint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)]"
                    >
                      Show closed grants
                    </button>
                  </div>
                ) : sort === 'deadline' ? (
                  <section aria-labelledby="grants-by-deadline" className="pt-6">
                    <h2 id="grants-by-deadline" className="sr-only">
                      Grants, soonest deadline first
                    </h2>
                    {byDeadline.map((e) => (
                      <GrantRow
                        key={e.grant.n}
                        grant={e.grant}
                        deadline={e.deadline}
                        status={e.status}
                        statusText={e.statusText}
                        categoryTag={titleOf[e.categoryId]}
                      />
                    ))}
                  </section>
                ) : (
                  GRANT_CATEGORIES.map((cat) => {
                    const rows = visible.filter((e) => e.categoryId === cat.id)
                    if (rows.length === 0) return null
                    const open = rows.filter((e) => e.status !== 'closed').length
                    return (
                      <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className="pt-14 md:pt-20">
                        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:gap-x-10 items-start pb-8 md:pb-10">
                          <span aria-hidden="true" className="gp-serif italic font-medium text-[var(--forest)] text-[4rem] md:text-[6.5rem] leading-[0.8]">
                            {cat.id.slice(-1).toUpperCase()}
                          </span>
                          <div className="pt-1 md:pt-3">
                            <h2 id={`${cat.id}-title`} className="gp-serif font-medium text-[1.45rem] md:text-[2.25rem] leading-[1.1] text-[var(--ink)] max-w-[30ch]">
                              {cat.title}
                            </h2>
                            {cat.subtitle && <p className="mt-2 text-[15px] text-[var(--stone)]">{cat.subtitle}</p>}
                            <p className="mt-3 gp-num text-[13px] text-[var(--stone)]">
                              {rows.length} {rows.length === 1 ? 'grant' : 'grants'}, {open} open
                            </p>
                          </div>
                        </div>
                        {rows.map((e) => (
                          <GrantRow key={e.grant.n} grant={e.grant} deadline={e.deadline} status={e.status} statusText={e.statusText} />
                        ))}
                      </section>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* ── CLOSING ── */}
          <section aria-labelledby="grants-closing" className="bg-[var(--forest)] text-[var(--ivory)] px-4 md:px-8 py-16 md:py-24">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 md:gap-16 items-center">
              <img
                src="/images/titobi-authority.jpg"
                srcSet="/images/titobi-authority-xs.webp 640w, /images/titobi-authority-sm.webp 926w"
                sizes="(min-width: 768px) 420px, min(100vw, 420px)"
                alt="Titobi Oreolorun, founder of Tito Finance"
                width={926}
                height={1280}
                loading="lazy"
                className="w-full max-w-[420px] aspect-[5/4] md:aspect-[4/5] object-cover object-[50%_20%] rounded-xl"
              />
              <div className="max-w-[60ch]">
                <h2 id="grants-closing" className="gp-serif italic font-normal text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] pb-1">
                  {GRANTS_CLOSING.title}
                </h2>
                <div className="mt-5 space-y-3 text-[16px] leading-[1.75] text-[rgba(248,245,238,0.88)]">
                  {GRANTS_CLOSING.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                <p className="mt-8 text-[13px] font-medium tracking-[0.04em] text-[var(--gold)]">{GRANTS_CLOSING.registerLabel}</p>
                <a
                  href="/stock-101"
                  className={`gp-press mt-3 inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--gold)] text-[var(--ink)] pl-5 pr-1.5 py-1.5 text-[15px] font-medium hover:bg-[#d6b864] ${focusOnDark}`}
                  style={{ overflowWrap: 'anywhere' }}
                >
                  {GRANTS_CLOSING.registerText}
                  <span aria-hidden="true" className="w-8 h-8 shrink-0 rounded-full bg-[var(--ink)] text-[var(--gold)] flex items-center justify-center">→</span>
                </a>

                <p className="mt-8 text-[16px] leading-[1.75] text-[rgba(248,245,238,0.88)]">{GRANTS_CLOSING.community}</p>
                <p className="mt-3 text-[16px] leading-[1.75] text-[rgba(248,245,238,0.88)]">{GRANTS_CLOSING.follow}</p>

                <ul className="mt-5 flex flex-wrap gap-3" aria-label="Follow Tito">
                  {GRANTS_CLOSING.socials.map((s) => {
                    const social = SOCIAL_ICONS[s.label]
                    if (!social) return null
                    const { Icon, name } = social
                    return (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${name}: ${s.handle} (opens in a new tab)`}
                          title={`${name}: ${s.handle}`}
                          className="gp-press w-12 h-12 rounded-full border border-[rgba(248,245,238,0.35)] flex items-center justify-center text-[var(--ivory)] hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ivory)]"
                        >
                          <Icon size={18} aria-hidden="true" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[var(--ink)] px-4 md:px-8 py-6">
          <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[13px]">
            <p className="text-[rgba(255,255,255,0.65)]">© 2026 Tito Finance. All rights reserved.</p>
            <a href="/" className={`text-[rgba(255,255,255,0.75)] hover:text-[var(--gold)] ${focusOnDark}`}>
              Main site
            </a>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}

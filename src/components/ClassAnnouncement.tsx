import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * The upcoming-classes announcement.
 *
 * Built from scratch on framer-motion rather than a dialog library: this
 * project has @radix-ui/react-accordion and nothing else, no shadcn, no
 * headless UI. Adding @radix-ui/react-dialog for one popup would introduce a
 * second component system for a single surface, so this follows the house
 * pattern instead - the Navbar overlay's fixed/inset-0 + inline brand styles,
 * and Stock101Page's forest pill button.
 *
 * ============================================================================
 * ONE COUNTDOWN, NOT TWO
 * ============================================================================
 * Both dates are shown; only the nearer one gets a ticking clock.
 *
 * Two live timers a fortnight apart tick in lockstep - the seconds column is
 * identical, the minutes column is identical, and only the day count differs.
 * The eye reads two near-identical number rows, compares them, and takes longer
 * to parse either than it would take to read one. Urgency does not add up; it
 * divides. One clock gives the popup a single focal point, which matches the
 * single CTA underneath it.
 *
 * ============================================================================
 * NO DISMISSAL MEMORY
 * ============================================================================
 * Closing it closes it for that page view only. Reload, come back from another
 * page, or open a new tab and it greets you again after the same 1.4s beat.
 *
 * Deliberate for a dated announcement with two weeks to run: a visitor who
 * dismissed it on Monday without reading it should still learn about the class
 * on Thursday. The cost is that a determined re-loader sees it more than once,
 * which is the cheaper mistake than a visitor who never sees it at all.
 *
 * There is no in-page timer bringing it back mid-visit. Re-interrupting
 * somebody who has already closed it is a different and much worse thing than
 * greeting them on a new visit.
 *
 * ============================================================================
 * IT RETIRES ITSELF
 * ============================================================================
 * The only button registers for Stock 101. Once that class has passed, the
 * button is a dead offer, and a popup whose one action is stale is worse than
 * no popup - so the whole thing stops rendering on 5 September. It does not
 * silently fall through to the Beginner's Portfolio date, because there is no
 * CTA for that class in this pass; that was a deliberate client decision, and
 * quietly promoting a class nobody can register for from here would undo it.
 */

/* --------------------------------------------------------------- content */

/**
 * Local midnight, not UTC. A Lagos visitor reading "9 days" should get the
 * number their own calendar agrees with; `new Date(y, m, d)` is local by
 * construction. Month is 0-indexed: 8 is September.
 */
const STOCK_101 = new Date(2026, 8, 5)
const BEGINNERS_PORTFOLIO = new Date(2026, 8, 19)

const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** Long enough for the hero to paint and the eye to settle; short enough to
 *  still read as part of arriving. An instant popup is an ambush. */
const APPEAR_AFTER_MS = 1400

/* ------------------------------------------------------------- countdown */

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const remainingUntil = (target: Date, from: number): Remaining | null => {
  const ms = target.getTime() - from
  if (ms <= 0) return null
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

function CountdownCell({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div
        style={{
          fontFamily: "'DM Mono', ui-monospace, monospace",
          // NOT 6vw. The container SHRINKS as the viewport grows: at the
          // two-column breakpoint the content column drops from full width to
          // ~390px while a vw-based size keeps climbing, so a 3-digit day
          // count overflowed its cell. Capped at 28px, which clears the widest
          // run at every width this ships at.
          fontSize: 'clamp(22px, 5vw, 28px)',
          fontWeight: 500,
          lineHeight: 1,
          color: '#1A3A16',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: '6px',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#6B6B6B',
        }}
      >
        {label}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- component */

export function ClassAnnouncement() {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<Element | null>(null)

  const countdown = remainingUntil(STOCK_101, now)

  // ---- Appear once per mount, after a beat. NO MEMORY OF A DISMISSAL.
  //
  // This used to read a sessionStorage flag and stay closed for the rest of the
  // session. That is gone by decision: the announcement is time-sensitive, so
  // it should greet every fresh page load - a reload, a return from another
  // page, a new tab - rather than being silenced by one early dismissal.
  //
  // ONCE PER MOUNT IS THE WHOLE RULE, and the empty dependency array is what
  // enforces it. There is deliberately NO interval that re-opens the popup
  // while somebody stays on the page: that was considered and rejected, since
  // re-interrupting a reader who has already said no is the behaviour people
  // install ad blockers over. Fresh visit, fresh popup; same visit, one popup.
  useEffect(() => {
    if (!countdown) return
    const t = setTimeout(() => setOpen(true), APPEAR_AFTER_MS)
    return () => clearTimeout(t)
    // countdown is derived from `now`, which ticks every second. Depending on
    // it directly would re-arm this timer once a second and the popup would
    // never open. Gate on mount instead; the target date never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Tick. Only while open, so a dismissed popup costs nothing.
  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [open])

  // Closes it for this mount and nothing more. Nothing is written anywhere, so
  // there is no storage to fail on in private mode and nothing to clear.
  const dismiss = useCallback(() => setOpen(false), [])

  // ---- Escape, focus, and the page behind it.
  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement
    // Focus the close button, not the CTA: the first thing a keyboard user
    // reaches should be the way out, never the conversion.
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)

    // Freeze the page behind the overlay so a scroll gesture over the backdrop
    // does not move the article underneath it.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      // Put focus back where it was, so dismissing does not dump a keyboard
      // user at the top of the document.
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, dismiss])

  // Past the class, or never opened: render nothing at all.
  if (!countdown) return null

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="class-announcement"
          role="presentation"
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{
            background: 'rgba(13, 13, 13, 0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-announcement-title"
            // The backdrop closes on click; the card must not, or every click
            // inside the popup would dismiss it.
            onClick={(e) => e.stopPropagation()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid w-full overflow-hidden md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]"
            style={{
              maxWidth: '860px',
              // Landscape phones are ~380px tall. Cap and scroll rather than
              // letting the card run off both ends of the screen.
              maxHeight: 'calc(100dvh - 32px)',
              overflowY: 'auto',
              background: '#F8F5EE',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(13, 13, 13, 0.28)',
            }}
          >
            {/* Close. Sits above the photo on desktop, so it carries its own
                surface rather than relying on whatever pixel is behind it. */}
            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              aria-label="Close announcement"
              className="absolute top-3 right-3 z-10 flex items-center justify-center transition-colors duration-200"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                background: 'rgba(248, 245, 238, 0.92)',
                border: '1px solid rgba(45, 90, 39, 0.15)',
                color: '#1A3A16',
                cursor: 'pointer',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* PHOTO. Hidden below md rather than sm. At 640-767px the split
                left a 320px content column, which squeezed the countdown cells
                and wrapped every date row. Single column all the way to 768px
                is calmer and gives the clock room. */}
            <div className="relative hidden md:block" style={{ minHeight: '100%' }}>
              <img
                src="/images/titobi-authority.jpg"
                srcSet="/images/titobi-authority-xs.webp 640w, /images/titobi-authority-sm.webp 1024w, /images/titobi-authority-md.webp 1920w, /images/titobi-authority.webp 2560w"
                sizes="(min-width: 768px) 400px, 100vw"
                alt="Titobi Alagbe"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 22%' }}
              />
              {/* Dissolves the photo's right edge into the ivory card so the
                  two halves read as one surface, not a pasted-in thumbnail. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(248,245,238,0) 55%, rgba(248,245,238,0.9) 92%, #F8F5EE 100%)',
                }}
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-center px-6 py-8 md:px-9 md:py-10">
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                }}
              >
                Upcoming classes
              </p>

              <h2
                id="class-announcement-title"
                style={{
                  marginTop: '10px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(28px, 6vw, 40px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#1A3A16',
                  textWrap: 'balance',
                }}
              >
                Two classes, two weeks apart
              </h2>

              {/* THE CLOCK — one, for the nearer date. */}
              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '18px',
                  paddingBottom: '18px',
                  borderTop: '1px solid rgba(45, 90, 39, 0.15)',
                  borderBottom: '1px solid rgba(45, 90, 39, 0.15)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '12px',
                    letterSpacing: '0.04em',
                    color: '#6B6B6B',
                    marginBottom: '12px',
                  }}
                >
                  Stock 101 starts in
                </p>
                <div
                  className="grid grid-cols-4"
                  style={{ gap: '8px' }}
                  aria-hidden
                >
                  <CountdownCell value={String(countdown.days)} label="Days" />
                  <CountdownCell value={pad(countdown.hours)} label="Hrs" />
                  <CountdownCell value={pad(countdown.minutes)} label="Min" />
                  <CountdownCell value={pad(countdown.seconds)} label="Sec" />
                </div>
                {/* The cells above are decorative for assistive tech - four
                    numbers ticking every second is unusable read aloud. This
                    says the same thing once, and politely. */}
                <p className="sr-only" aria-live="polite">
                  Stock 101 starts in {countdown.days} days.
                </p>
              </div>

              {/* BOTH DATES, plainly. */}
              <dl style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
                {[
                  { name: 'Stock 101', date: STOCK_101, soonest: true },
                  { name: "Beginner's Portfolio", date: BEGINNERS_PORTFOLIO, soonest: false },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="flex flex-wrap items-baseline justify-between"
                    style={{ gap: '4px 12px' }}
                  >
                    <dt
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontSize: '15px',
                        fontWeight: c.soonest ? 600 : 400,
                        color: c.soonest ? '#1A3A16' : '#2A2A2A',
                      }}
                    >
                      {c.name}
                    </dt>
                    <dd
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontSize: '14px',
                        color: '#6B6B6B',
                      }}
                    >
                      {LONG_DATE.format(c.date)}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* ONE CTA. Confirmed with the client: no second button. */}
              <Link
                to="/stock-101"
                onClick={dismiss}
                className="mt-6 inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  padding: '15px 28px',
                  background: '#1A3A16',
                  color: '#F8F5EE',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(26, 58, 22, 0.25)',
                }}
              >
                Register for Stock 101
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

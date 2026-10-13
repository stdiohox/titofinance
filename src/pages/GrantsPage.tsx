import { useEffect, type CSSProperties, type ReactNode } from 'react'
import {
  GRANTS_INTRO,
  GRANTS_DISCLAIMER,
  GRANT_CATEGORIES,
  GRANTS_CLOSING,
  type Grant,
} from '../lib/grants'

const FOREST = '#1A3A16'
const GOLD = '#C9A84C'
const IVORY = '#F8F5EE'
const INK = '#0D0B08'
const STONE = '#5C5A55'

const sectionPad = 'clamp(4rem, 8vw, 6.5rem) clamp(1rem, 5vw, 3rem)'
const maxW = '1200px'

const eyebrow: CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: GOLD,
  display: 'block',
  marginBottom: '1rem',
}

const body: CSSProperties = {
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.7,
}

// Underlined; long URLs wrap instead of pushing the layout wide. Gold text and
// gold focus rings fail contrast on white/ivory, so light surfaces use Forest.
const linkBase =
  'underline decoration-[#C9A84C] underline-offset-4 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm'
const linkOnLight = `${linkBase} decoration-1 hover:decoration-2 hover:text-[#1A3A16] focus-visible:outline-[#1A3A16]`
const linkOnDark = `${linkBase} hover:text-[#C9A84C] focus-visible:outline-[#F8F5EE]`
const focusOnDark = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8F5EE] rounded-sm'

function ExternalLink({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={onDark ? linkOnDark : linkOnLight} style={{ overflowWrap: 'anywhere' }}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

// Renders a "Link" line exactly as written, with every URL in it clickable.
function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(/(https?:\/\/\S+)/).map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <ExternalLink key={i} href={part}>
            {part}
          </ExternalLink>
        ) : (
          part
        ),
      )}
    </>
  )
}

const fields: { key: keyof Pick<Grant, 'what' | 'who' | 'funding' | 'why' | 'how'>; label: string }[] = [
  { key: 'what', label: 'What' },
  { key: 'who', label: 'Who' },
  { key: 'funding', label: 'Funding' },
  { key: 'why', label: 'Why apply' },
  { key: 'how', label: 'How' },
]

function GrantCard({ grant }: { grant: Grant }) {
  return (
    <article
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(26,58,22,0.12)',
        borderRadius: '16px',
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: GOLD, letterSpacing: '0.1em' }}>
          {String(grant.n).padStart(2, '0')}
        </span>
        <h3
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.35rem, 2.4vw, 1.6rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: FOREST,
            marginTop: '0.35rem',
            overflowWrap: 'anywhere',
          }}
        >
          {grant.name}
        </h3>
      </div>

      <div
        style={{
          background: IVORY,
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: INK,
        }}
      >
        <p>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: STONE }}>
            Deadline:{' '}
          </span>
          <strong style={{ fontWeight: 500, color: FOREST }}>{grant.deadline}</strong>
        </p>
        <p style={{ overflowWrap: 'anywhere' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: STONE }}>
            Link:{' '}
          </span>
          <Linkified text={grant.link} />
        </p>
        {grant.email && (
          <p style={{ overflowWrap: 'anywhere' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: STONE }}>
              Email:{' '}
            </span>
            <a href={`mailto:${grant.email}`} className={linkOnLight} style={{ overflowWrap: 'anywhere' }}>
              {grant.email}
            </a>
          </p>
        )}
      </div>

      <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {fields.map(({ key, label }) =>
          grant[key] ? (
            <div key={key}>
              <dt style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: FOREST, marginBottom: '0.2rem' }}>
                {label}
              </dt>
              <dd style={{ ...body, fontSize: '0.9375rem', lineHeight: 1.6, color: INK }}>{grant[key]}</dd>
            </div>
          ) : null,
        )}
      </dl>
    </article>
  )
}

export default function GrantsPage() {
  useEffect(() => {
    document.title = 'Opportunity Grants — October 2026 — Tito Finance'
  }, [])

  return (
    <div style={{ background: IVORY, color: INK, overflowX: 'hidden' }}>
      {/* ── HEADER ── */}
      <header style={{ background: FOREST, padding: '0 clamp(1rem, 5vw, 3rem)' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" className={focusOnDark} style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/tf-icon-white.png" alt="Tito Finance home" style={{ height: '34px', width: 'auto' }} draggable={false} />
          </a>
          <a
            href="/"
            className={`transition-colors duration-200 hover:text-[#C9A84C] ${focusOnDark}`}
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(248,245,238,0.8)', textDecoration: 'none' }}
          >
            ← Main site
          </a>
        </div>
      </header>

      <main>
      {/* ── HERO ── */}
      <section style={{ background: FOREST, color: IVORY, padding: '0 clamp(1rem, 5vw, 3rem) clamp(3.5rem, 7vw, 5.5rem)' }}>

        <div style={{ maxWidth: maxW, margin: '0 auto', paddingTop: 'clamp(2rem, 6vw, 4.5rem)' }}>
          <span style={eyebrow}>Tito Finance · Grants</span>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              maxWidth: '15ch',
            }}
          >
            Opportunity Grants — October 2026
          </h1>
          <div style={{ marginTop: '1.75rem', maxWidth: '760px' }}>
            {GRANTS_INTRO.map((line) => (
              <p key={line} style={{ fontFamily: 'DM Mono, monospace', fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)', letterSpacing: '0.06em', lineHeight: 1.7, color: 'rgba(248,245,238,0.75)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem) 0' }}>
        <aside
          aria-labelledby="grants-disclaimer"
          style={{
            maxWidth: maxW,
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1px solid rgba(201,168,76,0.45)',
            borderLeft: `4px solid ${GOLD}`,
            borderRadius: '12px',
            padding: 'clamp(1.25rem, 3.5vw, 2rem)',
            ...body,
            fontSize: '0.9375rem',
            color: INK,
          }}
        >
          <h2 id="grants-disclaimer" style={{ ...eyebrow, fontSize: '12px', color: FOREST, marginBottom: '1rem' }}>
            {GRANTS_DISCLAIMER.title}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {GRANTS_DISCLAIMER.lead.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p style={{ fontWeight: 500, color: FOREST }}>{GRANTS_DISCLAIMER.adviseTitle}</p>
            <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {GRANTS_DISCLAIMER.advise.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {GRANTS_DISCLAIMER.closing.map((p) => (
              <p key={p} style={{ whiteSpace: 'pre-wrap' }}>{p}</p>
            ))}
          </div>
        </aside>
      </section>

      {/* ── CATEGORIES A–E ── */}
      {GRANT_CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} style={{ padding: sectionPad, scrollMarginTop: '1rem' }}>
          <div style={{ maxWidth: maxW, margin: '0 auto' }}>
            <div style={{ borderTop: `1px solid rgba(26,58,22,0.15)`, paddingTop: '1.5rem', marginBottom: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              <h2
                id={`${cat.id}-title`}
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 500,
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: FOREST,
                }}
              >
                {cat.title}
              </h2>
              {cat.subtitle && <p style={{ ...body, color: STONE, marginTop: '0.5rem' }}>{cat.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
              {cat.grants.map((g) => (
                <GrantCard key={g.n} grant={g} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── CLOSING CTA ── */}
      <section style={{ background: FOREST, color: IVORY, padding: sectionPad }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}
          >
            {GRANTS_CLOSING.title}
          </h2>
          <div style={{ ...body, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'rgba(248,245,238,0.85)' }}>
            {GRANTS_CLOSING.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <p style={{ ...eyebrow, marginBottom: '0.75rem' }}>{GRANTS_CLOSING.registerLabel}</p>
            <a
              href="/stock-101"
              className="inline-flex items-center gap-3 rounded-full transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8F5EE]"
              style={{
                background: GOLD,
                color: INK,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                maxWidth: '100%',
                overflowWrap: 'anywhere',
              }}
            >
              {GRANTS_CLOSING.registerText}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <p style={{ ...body, marginTop: '2rem', color: 'rgba(248,245,238,0.85)' }}>{GRANTS_CLOSING.community}</p>
          <p style={{ ...body, marginTop: '0.75rem', color: 'rgba(248,245,238,0.85)' }}>{GRANTS_CLOSING.follow}</p>

          <ul style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {GRANTS_CLOSING.socials.map((s) => (
              <li key={s.label} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.12em', color: 'rgba(248,245,238,0.6)' }}>{s.label}</span>{' '}
                <ExternalLink href={s.href} onDark>{s.handle}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </main>

      <footer style={{ background: INK, padding: '1.5rem clamp(1rem, 5vw, 3rem)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4" style={{ maxWidth: maxW, margin: '0 auto' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>© 2026 Tito Finance. All rights reserved.</p>
          <a href="/" className={`transition-colors duration-200 hover:text-[#C9A84C] ${focusOnDark}`} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            Main site
          </a>
        </div>
      </footer>
    </div>
  )
}

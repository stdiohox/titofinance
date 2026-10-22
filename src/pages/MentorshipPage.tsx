import { useEffect, useState, type CSSProperties } from 'react'
import { Compass, Target, Handshake, MessagesSquare, Menu, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import '../components/landing/landing.css'
import { useReveal } from '../components/landing/useReveal'
import ModuleRows from '../components/landing/ModuleRows'
import { TITO_PERSONAL_WHATSAPP } from '@/lib/forms'

// ── Design tokens ──────────────────────────────────────────────
// Identical to the sibling offer pages. The hero takes FOREST_MID because
// that is the Mentorship card's own colour on the homepage (ServicesSection
// card 04), so the click lands somewhere that already looks like what was
// clicked.
const BG_PRIMARY = '#F8F5EE'
const BG_ALT = '#FFFFFF'
const INK = '#0D0B08'
const FOREST = '#1A3A16'
const FOREST_MID = '#2D5A27'
const GOLD = '#C9A84C'
const STONE = '#6B6B6B'
const BORDER = 'rgba(26,58,22,0.1)'

/**
 * NO LEAD FORM, ON PURPOSE. Every other offer page posts to the ingest
 * script, but leads.source in the CRM only accepts the form types that
 * already exist (tito-crm migration 0015). A 'mentorship' submission would
 * fail that CHECK, and on this ingest path that failure is silent: the
 * visitor sees a thank-you and the lead is gone. Until the CRM accepts the
 * value, Mentorship books the way the homepage card always has, on Tito's
 * personal WhatsApp, with the opening line written for them.
 */
const BOOK_URL = `${TITO_PERSONAL_WHATSAPP}?text=${encodeURIComponent(
  "Hi Tito, I came from your website and I'm interested in Mentorship. I'd like to book a call to talk about it.",
)}`

const eyebrow: CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: GOLD,
  marginBottom: '1rem',
}

const h2Style: CSSProperties = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
  fontWeight: 500,
  letterSpacing: '-0.025em',
  color: INK,
  lineHeight: 1.1,
}

const navLinks = [
  { label: 'Mentorship', href: '#top' },
  { label: "What's Included", href: '#included' },
  { label: 'How It Works', href: '#how' },
  { label: 'Book a Call', href: '#book' },
]

// Drawn from the homepage card ("strategy sessions, goal tracking, and direct
// accountability"). Term length, session frequency and price are deliberately
// absent: the CRM prices Mentorship "per agreement", so those are settled in
// the first conversation, not promised here.
const included = [
  {
    Icon: Compass,
    title: 'Strategy sessions',
    body: 'One-on-one time with Tito to work through where your money is going, where you want it to go, and the decisions in between.',
  },
  {
    Icon: Target,
    title: 'Goal tracking',
    body: 'Your goals written down, measured and revisited, so progress is something you can see rather than something you hope is happening.',
  },
  {
    Icon: Handshake,
    title: 'Direct accountability',
    body: 'Someone who remembers what you said you would do last time, and asks. Most plans fail quietly. This one has a witness.',
  },
  {
    Icon: MessagesSquare,
    title: 'Guidance tailored to you',
    body: 'Not a course and not a group. Your income, your obligations, your timeline, in Nigeria or in the diaspora, and advice that fits them.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Book a call',
    body: 'Message Tito on WhatsApp. The first conversation is about you: what you earn, what you are working towards, and what keeps getting in the way.',
  },
  {
    num: '02',
    title: 'Agree the shape of it',
    body: 'If mentorship is the right fit, you agree how it will run, how often you will meet and what it costs, before anything starts. No surprises later.',
  },
  {
    num: '03',
    title: 'Build the plan together',
    body: 'Your goals become a working plan with clear next steps, built around the life you actually have rather than a template.',
  },
  {
    num: '04',
    title: 'Track, review, adjust',
    body: 'Regular strategy sessions keep the plan honest. When life changes, the plan changes with it, and you are never working it out alone.',
  },
]

const whoFor = [
  'You know what you want financially but keep drifting from the plan',
  'You have outgrown general advice and want guidance about your own situation',
  'You are making bigger decisions now and want a second mind on them',
  'You are building from the diaspora and want someone who understands both sides',
  'You do better with someone who checks in than with a plan you keep alone',
]

function BookButton({ label = 'Book a Call' }: { label?: string }) {
  return (
    <a
      href={BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: GOLD,
        color: FOREST,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '15px',
        fontWeight: 600,
        padding: '1.05rem 2.2rem',
        borderRadius: '999px',
        textDecoration: 'none',
        boxShadow: '0 4px 24px rgba(201,168,76,0.28)',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#B8972B')}
      onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
    >
      <FaWhatsapp size={18} aria-hidden />
      {label} →
    </a>
  )
}

// ── Nav ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkColor = scrolled ? 'rgba(26,58,22,0.65)' : 'rgba(255,255,255,0.75)'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem clamp(1.5rem, 4vw, 3.5rem)',
        background: scrolled ? 'rgba(248,245,238,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      <a href="/">
        <img
          src={scrolled ? '/tf-icon-green.png' : '/tf-icon-white.png'}
          alt="Tito Finance"
          style={{ height: '34px', width: 'auto' }}
          draggable={false}
        />
      </a>

      <nav className="hidden md:flex items-center" style={{ gap: '2rem' }}>
        {navLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: linkColor,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? FOREST : '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <a
        href={BOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline-flex items-center"
        style={{
          background: scrolled ? FOREST : 'white',
          color: scrolled ? 'white' : INK,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '0.6rem 1.5rem',
          borderRadius: '999px',
          textDecoration: 'none',
          transition: 'background 0.2s ease',
        }}
      >
        Book a Call
      </a>

      <button
        className="md:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
      >
        {open ? <X size={22} color={scrolled ? INK : 'white'} /> : <Menu size={22} color={scrolled ? INK : 'white'} />}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: BG_PRIMARY,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={24} color={STONE} />
          </button>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1.9rem, 6vw, 3rem)',
                color: INK,
                textDecoration: 'none',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function MentorshipPage() {
  useReveal()

  useEffect(() => {
    document.title = 'Mentorship — Tito Finance'
  }, [])

  const sectionPad = 'clamp(5rem, 11vw, 9rem) clamp(1.5rem, 5vw, 3rem)'

  return (
    <div style={{ background: BG_PRIMARY }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        id="top"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          background: FOREST_MID,
          padding: 'clamp(7rem, 14vw, 10rem) clamp(1.5rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 20% 80%, rgba(26,58,22,0.7), transparent 60%), radial-gradient(ellipse at 75% 25%, rgba(201,168,76,0.14), transparent 55%)',
          }}
        />

        <div
          className="hero-grid"
          style={{
            position: 'relative',
            maxWidth: '1240px',
            margin: '0 auto',
            width: '100%',
            gap: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          <div>
            {/* Gold is 3.5:1 on FOREST_MID, below AA for 11px text; it only
                passes on the darker FOREST the sibling heroes use. */}
            <p style={{ ...eyebrow, color: 'rgba(255,255,255,0.85)' }}>Mentorship · One-on-one</p>

            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                color: 'white',
                lineHeight: 1.05,
                maxWidth: '16ch',
                marginBottom: '1.5rem',
              }}
            >
              Someone in your corner, for the long run.
            </h1>

            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.65,
                maxWidth: '52ch',
                marginBottom: '2.5rem',
              }}
            >
              Ongoing one-on-one guidance from Tito, tailored to your financial journey.
              Strategy sessions, goal tracking, and direct accountability, for as long as
              you are building.
            </p>

            <BookButton />
          </div>

          {/* Portrait. titobi-cta: dark shirt against warm low light, which
              sits on the forest ground without a lit rectangle around it.
              Same box, ratio and tint recipe as the Beginner's Portfolio
              hero; the asset differs so the two pages do not open on the
              same photograph. */}
          <div className="hero-visual">
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                maxHeight: '560px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: FOREST,
              }}
            >
              <picture>
                <source
                  srcSet="/images/titobi-cta-xs.webp 640w, /images/titobi-cta-sm.webp 1024w, /images/titobi-cta-md.webp 1920w, /images/titobi-cta.webp 2560w"
                  sizes="(min-width: 900px) 44vw, 1px"
                  type="image/webp"
                />
                <img
                  src="/images/titobi-cta.jpg"
                  alt="Titobi Oreolorun"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    display: 'block',
                  }}
                  fetchPriority="high"
                  loading="eager"
                  draggable={false}
                />
              </picture>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(26,58,22,0.5) 0%, rgba(26,58,22,0.08) 45%, transparent 100%), linear-gradient(to bottom, rgba(26,58,22,0.3), transparent 55%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section style={{ background: BG_PRIMARY, padding: 'clamp(4rem, 9vw, 7rem) clamp(1.5rem, 5vw, 3rem)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: INK,
              lineHeight: 1.3,
            }}
          >
            Knowing what to do with money is rarely the hard part. Doing it, month after
            month, is.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section id="included" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={eyebrow}>What's included</p>
          <h2 data-reveal style={{ ...h2Style, maxWidth: '18ch', marginBottom: '3.5rem' }}>
            Guidance that keeps going after the call ends.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {included.map(({ Icon, title, body }) => (
              <div key={title} data-reveal style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(201,168,76,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={19} style={{ color: GOLD }} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.55rem',
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                    color: INK,
                    lineHeight: 1.18,
                    marginBottom: '0.75rem',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: STONE, lineHeight: 1.7 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: FOREST, padding: sectionPad }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={eyebrow}>How it works</p>
          <h2 data-reveal style={{ ...h2Style, color: 'white', maxWidth: '18ch' }}>
            From first call to a plan you keep.
          </h2>
          <ModuleRows modules={steps} />
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section id="who" style={{ background: BG_PRIMARY, padding: sectionPad }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <p style={eyebrow}>Who it's for</p>
          <h2 data-reveal style={{ ...h2Style, marginBottom: '2.5rem' }}>
            This is for you if…
          </h2>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {whoFor.map((line) => (
              <li
                key={line}
                data-reveal
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.1rem 0',
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '999px',
                    background: GOLD,
                    marginTop: '0.6rem',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.02rem', color: INK, lineHeight: 1.6 }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>

          {/* The sibling offer. Someone with one question should not be sold
              an ongoing relationship, and the homepage puts the two side by
              side, so this page does too. */}
          <p
            data-reveal
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.98rem',
              color: STONE,
              lineHeight: 1.7,
              marginTop: '2.5rem',
            }}
          >
            Only have one question right now?{' '}
            <a href="/quick-fire" style={{ color: FOREST_MID, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              A Quick Fire One-on-One might be all you need →
            </a>
          </p>
        </div>
      </section>

      {/* ── BOOK ── */}
      <section id="book" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={eyebrow}>Book a call</p>
          <h2 data-reveal style={{ ...h2Style, marginBottom: '1.5rem' }}>
            Start with a conversation.
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.02rem',
              color: STONE,
              lineHeight: 1.75,
              maxWidth: '50ch',
              margin: '0 auto 2.5rem',
            }}
          >
            Message Tito directly on WhatsApp. You will talk through where you are, where
            you want to be, and whether mentorship is the right way to get there, before
            anything is agreed.
          </p>
          <BookButton label="Book on WhatsApp" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: INK, padding: '3rem clamp(1.5rem, 5vw, 3rem)' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <img src="/tf-icon-green.png" alt="Tito Finance" style={{ height: '28px', opacity: 0.75 }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Tito Finance. All rights reserved.
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>
            Building Wealth. Building Lives.
          </p>
        </div>
      </footer>
    </div>
  )
}

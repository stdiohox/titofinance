import { useEffect, useState, type CSSProperties } from 'react'
import { Scale, ShieldAlert, Wallet, Globe, Landmark, LineChart, Menu, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import '../components/landing/landing.css'
import { useReveal } from '../components/landing/useReveal'
import ModuleRows from '../components/landing/ModuleRows'
import { TITO_PERSONAL_WHATSAPP } from '@/lib/forms'

// ── Design tokens ──────────────────────────────────────────────
// Identical to the sibling offer pages. This is the one offer page with a
// light hero, because the Quick Fire card is the one light card on the
// homepage (ServicesSection card 05). The nav therefore starts in its dark
// colours instead of switching to them on scroll.
const BG_PRIMARY = '#F8F5EE'
const BG_ALT = '#FFFFFF'
const INK = '#0D0B08'
const FOREST = '#1A3A16'
const FOREST_MID = '#2D5A27'
const GOLD = '#C9A84C'
const STONE = '#6B6B6B'
const BORDER = 'rgba(26,58,22,0.1)'

/**
 * NO LEAD FORM, ON PURPOSE. Same reason as MentorshipPage: the CRM's
 * leads.source CHECK (tito-crm migration 0015) does not accept 'quick_fire',
 * and a rejected submission on the ingest path is silent. Booking goes to
 * Tito's personal WhatsApp, as the homepage card always has. The message asks
 * for the question up front, because the whole session is built around it.
 */
const BOOK_URL = `${TITO_PERSONAL_WHATSAPP}?text=${encodeURIComponent(
  "Hi Tito, I came from your website and I'd like to book a Quick Fire One-on-One. My question is: ",
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
  fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
  fontWeight: 500,
  letterSpacing: '-0.02em',
  color: INK,
  lineHeight: 1.12,
}

const navLinks = [
  { label: 'Quick Fire', href: '#top' },
  { label: 'What to Bring', href: '#bring' },
  { label: 'How It Works', href: '#how' },
  { label: 'Book', href: '#book' },
]

// Examples, not a menu. They show the size of question that fits in thirty
// minutes: one decision, specific enough to answer.
const questions = [
  {
    Icon: Scale,
    title: 'Pay off debt, or invest first?',
    body: 'You have some money free and two good uses for it. Which comes first in your situation, and why.',
  },
  {
    Icon: ShieldAlert,
    title: 'Is this opportunity real?',
    body: 'Someone has offered you returns that sound too good. Talk it through before your money goes anywhere.',
  },
  {
    Icon: Wallet,
    title: 'How should I split my salary?',
    body: 'Saving, spending, investing and the people who depend on you. A split you can actually live with.',
  },
  {
    Icon: Globe,
    title: 'Naira, dollars, or both?',
    body: 'How much of your money should sit in which currency, given where you live and where you are going.',
  },
  {
    Icon: Landmark,
    title: 'Which account or platform?',
    body: 'You are ready to start and stuck choosing where. Narrow it down to the one that fits what you are doing.',
  },
  {
    Icon: LineChart,
    title: 'Should I buy, hold or sell this?',
    body: 'One position you are unsure about, looked at with you, so the decision is yours and you know why you made it.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Send your question',
    body: 'Message Tito on WhatsApp with the one question or decision you want to settle. A sentence or two is plenty.',
  },
  {
    num: '02',
    title: 'Pick a time',
    body: 'You will agree a slot and the details of the session before it is booked. Nothing is confirmed until you are happy with it.',
  },
  {
    num: '03',
    title: 'Thirty focused minutes',
    body: 'No preamble and no upsell. The whole session goes on your question, and you leave with a clear answer and your next step.',
  },
]

const whoFor = [
  'You have one specific decision in front of you and want it settled',
  'You want an expert view before you commit money, not after',
  'You are not looking for an ongoing programme, just a straight answer',
  'You have been going back and forth on something for weeks',
]

function BookButton({ label = 'Book a Session' }: { label?: string }) {
  return (
    <a
      href={BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: FOREST,
        color: 'white',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '15px',
        fontWeight: 600,
        padding: '1.05rem 2.2rem',
        borderRadius: '999px',
        textDecoration: 'none',
        boxShadow: '0 4px 22px rgba(26,58,22,0.22)',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = FOREST_MID)}
      onMouseLeave={(e) => (e.currentTarget.style.background = FOREST)}
    >
      {/* WhatsApp green on the glyph only, the same rule the thank-you
          screens follow: the mark carries the recognition, the fill stays
          on-palette. */}
      <FaWhatsapp size={18} color="#25D366" aria-hidden />
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

  // Solid, not the siblings' 0.65 alpha: on this page the nav sits on cream
  // from the first frame, and the faded green is under 4.5:1 there.
  const linkColor = FOREST_MID

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
        <img src="/tf-icon-green.png" alt="Tito Finance" style={{ height: '34px', width: 'auto' }} draggable={false} />
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
            onMouseEnter={(e) => (e.currentTarget.style.color = FOREST)}
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
          background: FOREST,
          color: 'white',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '0.6rem 1.5rem',
          borderRadius: '999px',
          textDecoration: 'none',
        }}
      >
        Book a Session
      </a>

      <button
        className="md:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
      >
        {open ? <X size={22} color={INK} /> : <Menu size={22} color={INK} />}
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
                fontSize: 'clamp(2rem, 6vw, 3rem)',
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
export default function QuickFirePage() {
  useReveal()

  useEffect(() => {
    document.title = 'Quick Fire One-on-One — Tito Finance'
  }, [])

  const sectionPad = 'clamp(4rem, 9vw, 7rem) clamp(1.5rem, 5vw, 3rem)'

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
          background: BG_PRIMARY,
          padding: 'clamp(7rem, 14vw, 10rem) clamp(1.5rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.16), transparent 55%)',
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
            <p style={eyebrow}>Quick Fire One-on-One</p>

            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                color: INK,
                lineHeight: 1.05,
                maxWidth: '16ch',
                marginBottom: '1.5rem',
              }}
            >
              One question. Thirty minutes. A clear answer.
            </h1>

            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: STONE,
                lineHeight: 1.65,
                maxWidth: '52ch',
                marginBottom: '2.5rem',
              }}
            >
              A focused 30-minute session with Tito to tackle one specific financial
              question or decision. Fast, direct, actionable.
            </p>

            <BookButton />

            {/* Three facts a visitor checks before booking anything, set in the
                same mono the homepage cards use for their meta lines. */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1.75rem',
                marginTop: '2.25rem',
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: STONE,
              }}
            >
              <span>30 minutes</span>
              <span>One-on-one with Tito</span>
              <span>Booked on WhatsApp</span>
            </div>
          </div>

          {/* Portrait. titobi-story, the one bright, daylight photograph of
              Tito and the only one not yet used in src/. It is light enough
              to sit on cream without a tint, so it gets none: just the 24px
              card every portrait on these pages uses. */}
          <div className="hero-visual">
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                maxHeight: '560px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#EDE8DC',
                boxShadow: '0 24px 60px rgba(26,58,22,0.12)',
              }}
            >
              <picture>
                <source
                  srcSet="/images/titobi-story-xs.webp 640w, /images/titobi-story-sm.webp 1024w, /images/titobi-story-md.webp 1920w, /images/titobi-story.webp 2560w"
                  sizes="(min-width: 900px) 44vw, 1px"
                  type="image/webp"
                />
                <img
                  src="/images/titobi-story.jpg"
                  alt="Titobi Oreolorun"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    display: 'block',
                  }}
                  fetchPriority="high"
                  loading="eager"
                  draggable={false}
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT TO BRING ── */}
      <section id="bring" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={eyebrow}>What to bring</p>
          <h2 data-reveal style={{ ...h2Style, maxWidth: '20ch', marginBottom: '1.25rem' }}>
            The question you keep putting off.
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.02rem',
              color: STONE,
              lineHeight: 1.7,
              maxWidth: '54ch',
              marginBottom: '3rem',
            }}
          >
            Anything specific enough to answer in one sitting. A few of the questions people
            bring:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {questions.map(({ Icon, title, body }) => (
              <div
                key={title}
                data-reveal
                style={{
                  background: BG_PRIMARY,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '18px',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(45,90,39,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={20} style={{ color: FOREST_MID }} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: INK,
                    lineHeight: 1.2,
                    marginBottom: '0.7rem',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: STONE, lineHeight: 1.65 }}>
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
          <h2 data-reveal style={{ ...h2Style, color: 'white', maxWidth: '20ch' }}>
            Three steps, no back and forth.
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

          {/* The step up. Mirrors the link on MentorshipPage pointing back here. */}
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
            Need more than one conversation?{' '}
            <a href="/mentorship" style={{ color: FOREST_MID, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Mentorship gives you ongoing one-on-one guidance →
            </a>
          </p>
        </div>
      </section>

      {/* ── BOOK ── */}
      <section id="book" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={eyebrow}>Book a session</p>
          <h2 data-reveal style={{ ...h2Style, marginBottom: '1.25rem' }}>
            Bring the question. Leave with the answer.
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.02rem',
              color: STONE,
              lineHeight: 1.75,
              maxWidth: '48ch',
              margin: '0 auto 2.5rem',
            }}
          >
            Message Tito on WhatsApp with your question. The message is started for you;
            just add what you want to settle and send it.
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

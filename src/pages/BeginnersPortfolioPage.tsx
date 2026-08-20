import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, MotionConfig } from 'framer-motion'
import { Compass, Layers, ShieldCheck, LineChart, Menu, X } from 'lucide-react'
import '../components/landing/landing.css'
import { useReveal } from '../components/landing/useReveal'
import {
  WHATSAPP_DIRECT,
  WHATSAPP_GROUP,
  submitLead,
} from '@/lib/forms'

// ── Design tokens ──────────────────────────────────────────────
// Copied from Stock101Page rather than imported, matching how that page and
// RetirementPage each carry their own. This is a sibling page, not a new
// design: every value here is the same one.
const BG_PRIMARY = '#F8F5EE'
const BG_ALT = '#FFFFFF'
const INK = '#0D0B08'
const FOREST = '#1A3A16'
const FOREST_MID = '#2D5A27'
const GOLD = '#C9A84C'
const STONE = '#6B6B6B'
const BORDER = 'rgba(26,58,22,0.1)'

const eyebrow: CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: GOLD,
  marginBottom: '1rem',
}

const inputStyle: CSSProperties = {
  width: '100%',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '15px',
  border: '1.5px solid rgba(26,58,22,0.15)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  color: INK,
  outline: 'none',
  background: 'white',
  transition: 'border-color 0.2s ease',
}

const formLabel: CSSProperties = {
  display: 'block',
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: FOREST,
  marginBottom: '0.5rem',
}

const navLinks = [
  { label: 'The Class', href: '#top' },
  { label: "What You'll Build", href: '#build' },
  { label: "Who It's For", href: '#who' },
  { label: 'Apply', href: '#apply' },
]

const pillars = [
  {
    Icon: Compass,
    title: 'Start from where you actually are',
    body: 'No assumed knowledge and no jargon you have to nod along to. We begin with what you earn, what you owe and what you can realistically set aside, and build from there.',
  },
  {
    Icon: Layers,
    title: 'A portfolio with a reason behind every holding',
    body: 'Not a list of tickers somebody posted. You will understand why each position is there, what job it does, and what would make you sell it.',
  },
  {
    Icon: ShieldCheck,
    title: 'Risk you have chosen on purpose',
    body: 'Your tolerance is not a personality quiz answer. We work out what a bad month would actually feel like for you, and build something you can hold through one.',
  },
  {
    Icon: LineChart,
    title: 'A path you can keep walking alone',
    body: 'The class ends. Your investing does not. You leave knowing how to rebalance, when to add, and how to tell a real opportunity from noise.',
  },
]

const whoFor = [
  'You have money set aside and no idea what to actually do with it',
  'You have read the articles, watched the videos, and still have not opened an account',
  "You have bought a stock or two on a tip and could not explain why you own them",
  'You are in the diaspora and want exposure to both local and international markets',
  'You want to stop asking other people what to buy',
]

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
        href="#apply"
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
        Apply Now
      </a>

      <button
        className="md:hidden"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
      >
        {open ? (
          <X size={22} color={scrolled ? INK : 'white'} />
        ) : (
          <Menu size={22} color={scrolled ? INK : 'white'} />
        )}
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

// ── Application form ───────────────────────────────────────────
function ApplyForm() {
  const [submitting, setSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = showThankYou ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showThankYou])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)

    setError(null)
    setSubmitting(true)

    const result = await submitLead({
      form_type: 'beginner_portfolio',
      fullName: data.get('fullName') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      location: data.get('location') as string,
      howHeard: data.get('howHeard') as string,
      learningGoal: data.get('learningGoal') as string,
      // Sent even though the current ingest script does not read it. The
      // automated messaging work cannot legally send anything without a
      // recorded consent, and collecting it from day one means there is no
      // cohort of leads who can never be contacted.
      consent_marketing: data.get('consent') === 'on',
    })

    setSubmitting(false)

    if (result.ok) {
      setShowThankYou(true)
      form.reset()
      return
    }

    // The form is NOT reset. Everything the visitor typed stays exactly where
    // it was, so retrying costs one click rather than filling it in again.
    setError(result.error ?? 'Something went wrong.')
  }

  const cardStyle: CSSProperties = {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '20px',
    padding: 'clamp(24px, 5vw, 40px)',
    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = FOREST_MID)
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(26,58,22,0.15)')

  return (
    <>
      <form onSubmit={handleSubmit} style={cardStyle} noValidate={false}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="fullName" style={formLabel}>Full Name</label>
          <input id="fullName" name="fullName" type="text" required style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="email" style={formLabel}>Email Address</label>
          <input id="email" name="email" type="email" required style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="phone" style={formLabel}>WhatsApp Number</label>
          <input id="phone" name="phone" type="tel" required style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="location" style={formLabel}>Where are you based?</label>
          <select id="location" name="location" required defaultValue="" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option value="" disabled>Select…</option>
            {['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Other'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="howHeard" style={formLabel}>How did you hear about us?</label>
          <select id="howHeard" name="howHeard" required defaultValue="" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option value="" disabled>Select…</option>
            {['Instagram', 'WhatsApp', 'YouTube', 'TikTok', 'Friend', 'Other'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* One free-text field, deliberately optional-feeling and short. This is
            the entry-level paid product; a long form here costs more
            applications than the answers are worth. */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="learningGoal" style={formLabel}>What do you want to learn?</label>
          <textarea
            id="learningGoal"
            name="learningGoal"
            rows={3}
            placeholder="A sentence is plenty."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            onFocus={focus}
            onBlur={blur}
          />
        </div>

        {/* Unticked and required. A pre-ticked box is not consent, and bundling
            it into the submit button would make it worthless as a record. */}
        <label
          htmlFor="consent"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            lineHeight: 1.5,
            color: STONE,
          }}
        >
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: FOREST, flexShrink: 0 }}
          />
          <span>
            I'd like to receive financial education updates by email and WhatsApp. I can
            unsubscribe at any time.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            background: FOREST,
            color: 'white',
            borderRadius: '999px',
            border: 'none',
            padding: '1rem',
            marginTop: '0.25rem',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            cursor: submitting ? 'wait' : 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = FOREST_MID)}
          onMouseLeave={(e) => (e.currentTarget.style.background = FOREST)}
        >
          {submitting ? 'Sending…' : 'Apply for the Class →'}
        </button>

        {error && (
          <div
            role="alert"
            style={{
              marginTop: '1rem',
              padding: '0.9rem 1rem',
              borderRadius: '10px',
              background: 'rgba(140,47,34,0.07)',
              border: '1px solid rgba(140,47,34,0.2)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13.5px',
              lineHeight: 1.55,
              color: '#8C2F22',
            }}
          >
            {error} Your details are still here, so you can try again.{' '}
            <a
              href={WHATSAPP_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: FOREST, fontWeight: 500 }}
            >
              Or message Tito on WhatsApp →
            </a>
          </div>
        )}

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: STONE, textAlign: 'center', marginTop: '1rem' }}>
          Prefer WhatsApp?{' '}
          <a href={WHATSAPP_DIRECT} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: 'none' }}>
            Chat with Tito directly →
          </a>
        </p>
      </form>

      {showThankYou &&
        createPortal(
          <MotionConfig reducedMotion="user">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: BG_PRIMARY,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 32px',
                overflowY: 'auto',
              }}
            >
              <img src="/tf-icon-green.png" alt="Tito Finance" style={{ height: '40px', marginBottom: '2rem' }} />

              <div style={{ maxWidth: '480px' }}>
                <p style={eyebrow}>Application received</p>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(2rem, 6vw, 3rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: INK,
                    lineHeight: 1.15,
                    marginBottom: '1rem',
                  }}
                >
                  Thanks — Tito's team will be in touch shortly.
                </h2>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: STONE, lineHeight: 1.6, marginBottom: '2rem' }}>
                  We read every application ourselves. Expect a message on WhatsApp with the
                  next steps.
                </p>

                <a
                  href="/"
                  style={{
                    display: 'inline-block',
                    background: FOREST,
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    padding: '0.9rem 2rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                  }}
                >
                  Back to Tito Finance
                </a>

                {/* Secondary, deliberately. The primary outcome is the team
                    following up; the group is a place to wait, not the point. */}
                <p style={{ marginTop: '1.5rem' }}>
                  <a
                    href={WHATSAPP_GROUP}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: GOLD,
                      textDecoration: 'none',
                    }}
                  >
                    Join the free community →
                  </a>
                </p>
              </div>
            </motion.div>
          </MotionConfig>,
          document.body,
        )}
    </>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function BeginnersPortfolioPage() {
  useReveal()

  useEffect(() => {
    document.title = "Beginner's Portfolio Class — Tito Finance"
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
          background: FOREST,
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
              'radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.14), transparent 55%)',
          }}
        />

        {/* hero-grid / hero-visual are the responsive helpers already in
            landing.css: one column below 900px, 1.1fr / 0.9fr above it, with
            the visual hidden on the narrow breakpoint. They were written for
            exactly this layout and had no consumer until now. */}
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
          <p style={eyebrow}>Beginner's Portfolio Class</p>

          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              // Capped lower than the single-column siblings (Stock101 uses
              // 5rem) because the headline now shares the row with the photo.
              // At 5rem in a ~660px column it breaks to four lines.
              fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'white',
              lineHeight: 1.05,
              maxWidth: '17ch',
              marginBottom: '1.5rem',
            }}
          >
            Build your first portfolio. Properly.
          </h1>

          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.65,
              maxWidth: '52ch',
              marginBottom: '2.5rem',
            }}
          >
            A guided class for people who are done reading about investing and want to
            actually start. You leave with a portfolio you understand and can explain.
          </p>

          <a
            href="#apply"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: GOLD,
              color: FOREST,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              padding: '1rem 2rem',
              borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(201,168,76,0.28)',
            }}
          >
            Apply for the Class →
          </a>
          </div>

          {/* Portrait. Same asset as the "Personal Financial Management 101"
              card on the homepage (ServicesSection card 01), and the same
              treatment it already carries elsewhere:

                crop     objectPosition 'center 10%', the framing RetirementPage
                         uses for this exact file, because his head sits high
                         in the frame and 'center' decapitates him
                shape    24px radius, matching RetirementPage's portrait wrapper
                overlay  a FOREST tint, not the black scrim ServicesSection
                         uses. That scrim exists there to carry white text laid
                         over the photo; nothing overlaps this one. On a dark
                         ground the site tints toward the brand green instead
                         (Stock101Page's hero image), which settles the photo
                         into the section rather than leaving a lit rectangle
                         floating on forest.

              <picture> + eager + high priority mirrors HeroSection, since this
              is above the fold and is the desktop LCP element. */}
          <div className="hero-visual">
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                maxHeight: '560px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: FOREST_MID,
              }}
            >
              <picture>
                <source
                  srcSet="/images/titobi-services-xs.webp 640w, /images/titobi-services-sm.webp 1024w, /images/titobi-services-md.webp 1920w, /images/titobi-services.webp 2560w"
                  // hero-visual is display:none below 900px, so the 1px branch
                  // keeps narrow viewports off the large candidates for an
                  // image they will never paint.
                  sizes="(min-width: 900px) 44vw, 1px"
                  type="image/webp"
                />
                <img
                  src="/images/titobi-services.jpg"
                  alt="Titobi Oreolorun"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 10%',
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
                  // Two forest tints, one from each edge. The photo was shot
                  // on a pale studio backdrop, so a single scrim leaves the
                  // top corners reading as a lit rectangle sitting on the
                  // forest rather than in it. The top-down half is
                  // Stock101Page's hero-image tint at its shipped values; the
                  // bottom-up half is the ServicesSection scrim's shape in
                  // forest instead of black. Both clear his face by 45%.
                  background:
                    'linear-gradient(to top, rgba(26,58,22,0.5) 0%, rgba(26,58,22,0.08) 45%, transparent 100%), linear-gradient(to bottom, rgba(26,58,22,0.3), transparent 55%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL BUILD ── */}
      <section id="build" style={{ background: BG_PRIMARY, padding: sectionPad }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={eyebrow}>What you'll build</p>
          <h2
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: INK,
              lineHeight: 1.12,
              maxWidth: '20ch',
              marginBottom: '3rem',
            }}
          >
            Four things you take away.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {pillars.map(({ Icon, title, body }) => (
              <div
                key={title}
                data-reveal
                style={{
                  background: BG_ALT,
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
                    background: 'rgba(201,168,76,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={20} style={{ color: GOLD }} />
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

      {/* ── WHO IT'S FOR ── */}
      <section id="who" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <p style={eyebrow}>Who it's for</p>
          <h2
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: INK,
              lineHeight: 1.12,
              marginBottom: '2.5rem',
            }}
          >
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
        </div>
      </section>

      {/* ── APPLY ── */}
      <section id="apply" style={{ background: BG_PRIMARY, padding: sectionPad }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start',
          }}
        >
          <div>
            <p style={eyebrow}>Apply</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: INK,
                lineHeight: 1.12,
                marginBottom: '1.25rem',
              }}
            >
              Tell us where you're starting.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: STONE, lineHeight: 1.7, maxWidth: '44ch' }}>
              Send this and Tito's team will reach out on WhatsApp to talk through what
              you're hoping to build and whether the class is the right fit.
            </p>
          </div>

          <ApplyForm />
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

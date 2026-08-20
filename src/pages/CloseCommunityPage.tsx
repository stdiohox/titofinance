import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, MotionConfig } from 'framer-motion'
import {
  CalendarCheck,
  ClipboardCheck,
  Compass,
  MessageSquare,
  Users,
  RefreshCw,
  Menu,
  X,
} from 'lucide-react'
import '../components/landing/landing.css'
import { useReveal } from '../components/landing/useReveal'
import { WHATSAPP_DIRECT, WHATSAPP_GROUP, submitLead } from '@/lib/forms'

// ── Design tokens ──────────────────────────────────────────────
// Identical to Stock101Page and BeginnersPortfolioPage. The premium weight of
// this page comes from pacing, type scale and restraint, not from a different
// palette.
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
  { label: 'Close Community', href: '#top' },
  { label: 'Inside', href: '#inside' },
  { label: 'The Room', href: '#room' },
  { label: 'Request Access', href: '#access' },
]

// Drawn from the Sales Playbook. Term length is deliberately absent, as is any
// figure: what the membership costs is a conversation the team has after they
// follow up, not something the page answers.
const inside = [
  {
    Icon: CalendarCheck,
    title: 'Monthly stock updates',
    body: 'What moved, what it means, and what Tito is watching next. Written for people who want to understand the reasoning, not just receive a verdict.',
  },
  {
    Icon: ClipboardCheck,
    title: 'A monthly portfolio review with Tito',
    body: 'Your actual holdings, looked at properly. What is working, what is drifting from your goals, and what you might do about it.',
  },
  {
    Icon: Compass,
    title: 'Guidance from his personal strategy',
    body: 'The framework Tito uses for his own money, explained as he applies it. Not a signal service, a way of thinking you can keep.',
  },
  {
    Icon: Users,
    title: 'An investor network',
    body: 'A room of people at your level and above, in Nigeria and across the diaspora, who are building the same thing you are.',
  },
  {
    Icon: MessageSquare,
    title: 'Communal Q&A',
    body: 'Ask the question you have been embarrassed to ask. Somebody else in the room has already asked it, and the answer is usually useful to everyone.',
  },
  {
    Icon: RefreshCw,
    title: 'A fixed-term membership',
    body: 'You join for a defined period rather than an open-ended subscription that quietly renews. We will walk you through the terms before anything is agreed.',
  },
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
        href="#access"
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
        }}
      >
        Request Access
      </a>

      <button
        className="md:hidden"
        aria-label="Toggle menu"
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

// ── Access request form ────────────────────────────────────────
function AccessForm() {
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
      form_type: 'closed_group',
      fullName: data.get('fullName') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      location: data.get('location') as string,
      howHeard: data.get('howHeard') as string,
      experienceLevel: data.get('experienceLevel') as string,
      capitalBand: data.get('capitalBand') as string,
      consent_marketing: data.get('consent') === 'on',
    })

    setSubmitting(false)

    if (result.ok) {
      setShowThankYou(true)
      form.reset()
      return
    }

    setError(result.error ?? 'Something went wrong.')
  }

  const cardStyle: CSSProperties = {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '20px',
    padding: 'clamp(24px, 5vw, 40px)',
    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = FOREST_MID)
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(26,58,22,0.15)')

  return (
    <>
      <form onSubmit={handleSubmit} style={cardStyle}>
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
          <label htmlFor="experienceLevel" style={formLabel}>Investing experience</label>
          <select id="experienceLevel" name="experienceLevel" required defaultValue="" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option value="" disabled>Select…</option>
            {['Beginner', 'Intermediate', 'Advanced'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/*
          The visitor's own investable capital, not a price. Nothing on this
          page states what anything costs; this asks what they have to work
          with so the conversation afterwards starts in the right place.

          These option values must stay byte-identical to the capital_band
          CHECK in migration 0015. A mismatch is rejected at the database and,
          on this ingest path, rejected silently.
        */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="capitalBand" style={formLabel}>Capital you're working with</label>
          <select id="capitalBand" name="capitalBand" required defaultValue="" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
            <option value="" disabled>Select…</option>
            {['Under ₦500k', '₦500k - ₦2m', '₦2m - ₦10m', 'Over ₦10m'].map((o) => (
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
          {submitting ? 'Sending…' : 'Request Access →'}
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
            <a href={WHATSAPP_DIRECT} target="_blank" rel="noopener noreferrer" style={{ color: FOREST, fontWeight: 500 }}>
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
                <p style={eyebrow}>Request received</p>
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
                  Close Community is a small room, so every request is read by hand. Expect a
                  message on WhatsApp to talk it through.
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
                    Join the free community while you wait →
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
export default function CloseCommunityPage() {
  useReveal()

  useEffect(() => {
    document.title = 'Close Community — Tito Finance'
  }, [])

  const sectionPad = 'clamp(5rem, 11vw, 9rem) clamp(1.5rem, 5vw, 3rem)'

  return (
    <div style={{ background: BG_PRIMARY }}>
      <Navbar />

      {/* ── HERO. Taller and quieter than the Beginner's page: fewer words,
             more room around them. ── */}
      <section
        id="top"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          background: INK,
          padding: 'clamp(8rem, 15vw, 12rem) clamp(1.5rem, 5vw, 3rem) clamp(5rem, 9vw, 7rem)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 25% 20%, rgba(26,58,22,0.55), transparent 60%), radial-gradient(ellipse at 80% 75%, rgba(201,168,76,0.12), transparent 55%)',
          }}
        />

        <div
          className="hero-grid"
          style={{
            position: 'relative',
            maxWidth: '1240px',
            margin: '0 auto',
            width: '100%',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
          }}
        >
          <div>
          <p style={eyebrow}>Close Community</p>

          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              // Capped below the 6rem the single-column version carried, now
              // that the headline shares the row with the portrait. The 14ch
              // measure below is unchanged, so the line breaks fall in the
              // same places; only the scale comes down.
              fontSize: 'clamp(2.8rem, 6vw, 4.25rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: 'white',
              lineHeight: 1.02,
              maxWidth: '14ch',
              marginBottom: '2rem',
            }}
          >
            The room where the real conversation happens.
          </h1>

          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              maxWidth: '50ch',
              marginBottom: '3rem',
            }}
          >
            A small, closed group of serious investors who meet Tito monthly, review their
            portfolios with him, and build alongside people doing the same.
          </p>

          <a
            href="#access"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: GOLD,
              color: INK,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              padding: '1.05rem 2.2rem',
              borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 4px 28px rgba(201,168,76,0.25)',
            }}
          >
            Request Access →
          </a>
          </div>

          {/* Portrait. Deliberately NOT the Beginner's Portfolio treatment.
              That page uses titobi-services.jpg in a clean 24px-radius card
              with a forest tint: a lit, legible, welcoming thumbnail, which is
              right for a class. This page is about a closed room, so the photo
              has to withhold rather than present.

              ASSET. titobi-hero.jpg, the one Tito photograph not used anywhere
              else in src/. It was shot low-key against near-black with a black
              long-sleeve, so the darkness here is photographic, not painted on
              afterwards. Nothing repeats and nothing is faked.

              TREATMENT. Two stacked ink layers, both in INK (#0D0B08) so the
              frame resolves into the section ground rather than sitting on it:

                1. a vignette that keeps his face clear and carries all four
                   edges to near-solid ink, which is what removes the card
                   entirely. No radius, no border, no fill. He emerges from the
                   ground instead of being mounted on it.
                2. Stock101Page's shipped 135deg ink wash over media
                   (line ~800), at lighter stops. That page lays it over a
                   video at 0.3 opacity so it can afford 0.92; over a
                   photograph that would crush the face, so the mid stop opens
                   up to let the diagonal read as light rather than fog.

              Ratio and framing follow Stock101Page's own portrait beside text
              (4/5). fetchPriority/eager/<picture> match the Beginner's page,
              since the technical pattern was never the thing to vary. */}
          <div className="hero-visual">
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                maxHeight: '620px',
              }}
            >
              <picture>
                <source
                  srcSet="/images/titobi-hero-xs.webp 640w, /images/titobi-hero-sm.webp 1024w, /images/titobi-hero-md.webp 1920w, /images/titobi-hero.webp 2560w"
                  // hero-visual is display:none below 900px, so the 1px branch
                  // keeps narrow viewports off the large candidates.
                  sizes="(min-width: 900px) 44vw, 1px"
                  type="image/webp"
                />
                <img
                  src="/images/titobi-hero.jpg"
                  alt="Titobi Oreolorun"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 18%',
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
                    'radial-gradient(ellipse 72% 62% at 55% 34%, transparent 22%, rgba(13,11,8,0.45) 58%, rgba(13,11,8,1) 90%), linear-gradient(135deg, rgba(13,11,8,0.8) 0%, rgba(13,11,8,0.15) 48%, rgba(13,11,8,0.72) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE. The editorial beat RetirementPage uses to slow the
             page between sections. Written inline rather than with the
             PullText component: that one is an oversized decorative word that
             bleeds behind a section on a single nowrap line, which is a
             different device entirely and would run a sentence off screen. ── */}
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
            Most people invest alone, guess quietly, and never find out what they got
            wrong until it has already cost them.
          </p>
        </div>
      </section>

      {/* ── INSIDE ── */}
      <section id="inside" style={{ background: BG_ALT, padding: sectionPad }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={eyebrow}>What's inside</p>
          <h2
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: INK,
              lineHeight: 1.1,
              maxWidth: '18ch',
              marginBottom: '1.25rem',
            }}
          >
            What membership actually gives you.
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.02rem',
              color: STONE,
              lineHeight: 1.7,
              maxWidth: '54ch',
              marginBottom: '3.5rem',
            }}
          >
            Six things, every month, for as long as your membership runs.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {inside.map(({ Icon, title, body }) => (
              <div
                key={title}
                data-reveal
                style={{
                  borderTop: `1px solid ${BORDER}`,
                  paddingTop: '1.75rem',
                }}
              >
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

      {/* ── THE ROOM ── */}
      <section id="room" style={{ background: FOREST, padding: sectionPad }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={eyebrow}>The room</p>
          <h2
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '2rem',
            }}
          >
            Small on purpose.
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              'Membership runs for a fixed term rather than rolling on indefinitely, so everybody in the room chose to be there this month.',
              'Access is by request, not by checkout. We talk to you first, because a room only works if the people in it belong there.',
              'Tito is in it. Not a moderator relaying questions to him — him, monthly, looking at your portfolio.',
              'It spans Nigeria and the diaspora, which means the conversation covers both local and international markets rather than assuming one.',
            ].map((line) => (
              <p
                key={line}
                data-reveal
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '1.05rem',
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.75,
                  paddingLeft: '1.5rem',
                  borderLeft: `2px solid ${GOLD}`,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESS ── */}
      <section id="access" style={{ background: BG_PRIMARY, padding: sectionPad }}>
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
            <p style={eyebrow}>Request access</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                color: INK,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              Tell us where you are.
            </h2>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1rem',
                color: STONE,
                lineHeight: 1.75,
                maxWidth: '46ch',
              }}
            >
              This is a request, not a checkout. Tito's team will reach out on WhatsApp to
              talk through what you're building, what the membership involves, and whether
              the room is right for you.
            </p>
          </div>

          <AccessForm />
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

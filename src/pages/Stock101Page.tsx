import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { TrendingUp, BarChart2, DollarSign, PieChart, ShieldOff, ArrowRight, Menu, X } from 'lucide-react'
import '../components/landing/landing.css'
import PullText from '../components/landing/PullText'
import { useReveal } from '../components/landing/useReveal'
import { WorldMap } from '@/components/ui/WorldMap'
import LandingFaq from '@/components/landing/LandingFaq'

// ── Design tokens ──────────────────────────────────────────────
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

const WHATSAPP = 'https://wa.me/2348184750870'

// ── Data (all existing copy preserved) ─────────────────────────
const modules = [
  { num: '01', Icon: TrendingUp, title: 'Why Invest at All?', body: 'The difference between saving and investing. What inflation quietly does to your money. Why starting now — even small — matters more than starting big later.' },
  { num: '02', Icon: BarChart2, title: 'What Is the Stock Market?', body: 'What a stock actually is. Why companies sell shares. How exchanges like NYSE, NASDAQ, and Nigeria\'s NGX work — and what brokers and investment apps actually do.' },
  { num: '03', Icon: DollarSign, title: 'How People Make Money in Stocks', body: 'Capital appreciation. Dividends. The magic of compounding. Why long-term investors consistently outperform traders.' },
  { num: '04', Icon: PieChart, title: 'Types of Investments', body: 'Stocks, ETFs, REITs, Bonds, Money Market Funds, Mutual Funds — what each one is and when it makes sense to use it.' },
  { num: '05', Icon: ShieldOff, title: 'Investment Myths, Debunked', body: 'Stocks are gambling. You need millions. Only experts profit. We\'ll dismantle every excuse that\'s kept you on the sidelines.' },
  { num: '06', Icon: ArrowRight, title: 'What Comes Next', body: 'After this session, you\'ll know exactly what to study next and how to build your first real portfolio — with Tito\'s guided learning path.' },
]

const whoFor = [
  'You earn a salary and want your money to do more than sit in a bank account',
  'You\'re self-employed and building income outside your business',
  'You\'re Nigerian in the diaspora and don\'t know how to invest in US or UK markets',
  'You\'ve tried to learn investing before but gave up because it felt too technical',
  'You\'re starting from zero — no portfolio, no broker, no prior knowledge',
]

const navLinks = [
  { label: 'Stock 101', href: '#top' },
  { label: 'What You\'ll Learn', href: '#modules' },
  { label: 'About', href: '#about' },
  { label: 'Register', href: '#register' },
]

// ── Navbar ─────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkColor = scrolled ? INK : 'rgba(255,255,255,0.85)'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '64px',
        background: scrolled ? BG_ALT : 'transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(26,58,22,0.08), 0 4px 20px rgba(0,0,0,0.04)' : 'none',
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      <div className="px-6 md:px-12" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left — logo (swaps for legibility over the dark hero) */}
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={scrolled ? '/tf-icon-green.png' : '/tf-icon-white.png'} alt="Tito Finance" style={{ height: '32px', width: 'auto' }} />
        </a>

        {/* Center — links */}
        <nav className="hidden md:flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: linkColor, textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = FOREST_MID)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right — CTA (desktop) + hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="#register"
            className="hidden md:inline-flex"
            style={{
              background: '#C9A84C',
              color: '#0D0B08',
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 1.25rem',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              alignItems: 'center',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Reserve Free Spot →
          </a>
          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: linkColor, lineHeight: 0 }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden" style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 1.5rem 1.25rem' }}>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: INK, textDecoration: 'none', padding: '0.75rem 0', borderBottom: `1px solid ${BORDER}` }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setOpen(false)}
              style={{ background: FOREST, color: 'white', borderRadius: '999px', padding: '0.75rem 1.25rem', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, textDecoration: 'none', textAlign: 'center', marginTop: '1rem' }}
            >
              Reserve Free Spot →
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Inline light-themed register form (webhook + success) ──────
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

function RegisterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      await fetch('https://n8n.srv1759554.hstgr.cloud/webhook/stock101-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {
      // webhook may not be live yet — still confirm to the user
    }
    setStatus('success')
    form.reset()
  }

  const cardStyle: CSSProperties = {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
  }

  if (status === 'success') {
    return (
      <div style={{ ...cardStyle, textAlign: 'center' }}>
        <div style={{ fontSize: '40px', color: FOREST, marginBottom: '0.75rem' }}>✓</div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 500, color: FOREST, lineHeight: 1.6 }}>
          You're registered! Check WhatsApp for your session details.
        </p>
      </div>
    )
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = FOREST_MID)
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = 'rgba(26,58,22,0.15)')

  return (
    <form onSubmit={onSubmit} style={cardStyle}>
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
          {['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Other'].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="source" style={formLabel}>How did you hear about us?</label>
        <select id="source" name="source" required defaultValue="" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
          <option value="" disabled>Select…</option>
          {['Instagram', 'WhatsApp', 'YouTube', 'TikTok', 'Friend', 'Other'].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{ width: '100%', background: FOREST, color: 'white', borderRadius: '999px', border: 'none', padding: '1rem', marginTop: '0.5rem', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500, cursor: status === 'submitting' ? 'wait' : 'pointer', transition: 'background 0.2s ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = FOREST_MID)}
        onMouseLeave={(e) => (e.currentTarget.style.background = FOREST)}
      >
        {status === 'submitting' ? 'Submitting…' : 'Reserve My Free Spot →'}
      </button>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: STONE, textAlign: 'center', marginTop: '1rem' }}>
        Prefer WhatsApp?{' '}
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: 'none' }}>Chat with Tito directly →</a>
      </p>
    </form>
  )
}

// ── Small building blocks ──────────────────────────────────────
function CheckDot() {
  return (
    <span aria-hidden style={{ width: '20px', height: '20px', borderRadius: '50%', background: FOREST, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>
      ✓
    </span>
  )
}

const sectionHeading = (size = 'clamp(34px, 5vw, 52px)'): CSSProperties => ({
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: size,
  fontWeight: 400,
  color: INK,
  lineHeight: 1.15,
})

// ── Circular progress-ring stat ────────────────────────────────
const CircularStat = ({
  value,
  suffix = '',
  prefix = '',
  label,
  percentage,
  color = '#C9A84C',
  trackColor = 'rgba(26,58,22,0.08)',
  size = 160,
  strokeWidth = 8,
  duration = 2000,
}: {
  value: number
  suffix?: string
  prefix?: string
  label: string
  percentage: number
  color?: string
  trackColor?: string
  size?: number
  strokeWidth?: number
  duration?: number
}) => {
  const [progress, setProgress] = useState(0)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(percentage)
      setCount(value)
      return
    }
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(elapsed / duration, 1)
      // Cubic ease out
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased * percentage)
      setCount(Math.round(eased * value))
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, percentage, value, duration])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Ring */}
      <div style={{ position: 'relative', width: '100%', maxWidth: size, aspectRatio: '1', margin: '0 auto' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track (background ring) — dashed segments like reference */}
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i / 32) * 2 * Math.PI
            const gap = 0.08
            const segStart = angle + gap
            const segEnd = angle + (2 * Math.PI) / 32 - gap
            const x1 = size / 2 + radius * Math.cos(segStart)
            const y1 = size / 2 + radius * Math.sin(segStart)
            const x2 = size / 2 + radius * Math.cos(segEnd)
            const y2 = size / 2 + radius * Math.sin(segEnd)
            const largeArc = segEnd - segStart > Math.PI ? 1 : 0
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )
          })}

          {/* Progress arc — solid, smooth */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 1}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: size === 160 ? '36px' : '28px',
              fontWeight: 500,
              color: '#0D0B08',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {prefix}
            {count}
            {suffix}
          </span>
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: '#9A9A9A',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function Stock101Page() {
  useReveal()

  return (
    <div id="top" style={{ background: BG_PRIMARY, color: INK, overflowX: 'hidden' }}>
      <Navbar />

      {/* ============ HERO (video bg, centered) ============ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '7rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
          background: INK,
        }}
      >
        {/* Ambient video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.3 }}
        >
          <source src="/videos/stock101-hero.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(13,11,8,0.92) 0%, rgba(13,11,8,0.72) 50%, rgba(13,11,8,0.88) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div data-reveal style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ ...eyebrow, marginBottom: '1.5rem' }}>Free Online Session · Limited Spots</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(48px, 8vw, 96px)', color: 'white', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            The Stock Market Isn't as Complicated as They{' '}
            <em style={{ color: GOLD, fontStyle: 'italic' }}>Made You Think.</em>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.72)', maxWidth: '36rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Most people avoid investing because no one ever explained it clearly. Stock 101 changes that — in one free session with Titobi Oreolorun.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#register"
              style={{ background: GOLD, color: INK, borderRadius: '999px', padding: '1rem 2rem', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500, textDecoration: 'none', transition: 'opacity 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Reserve My Free Spot →
            </a>
            <a
              href="#modules"
              style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '999px', padding: '1rem 2rem', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', textDecoration: 'none', transition: 'background 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Learn More ↓
            </a>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              FREE · ONLINE · BEGINNERS WELCOME · NIGERIA & DIASPORA
            </span>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF — WORLD MAP ============ */}
      <section
        style={{
          background: '#F8F5EE',
          padding: '80px 24px',
          borderBottom: '1px solid rgba(26,58,22,0.08)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              TRUSTED BY PEOPLE FROM
            </p>
            <h3
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '36px',
                fontWeight: 400,
                color: '#0D0B08',
                lineHeight: 1.2,
              }}
            >
              Nigeria to the World.
            </h3>
          </div>

          <WorldMap
            lineColor="#C9A84C"
            dots={[
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: 40.7128, lng: -74.006, label: 'New York' } },
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: 51.5074, lng: -0.1278, label: 'London' } },
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: 43.6532, lng: -79.3832, label: 'Toronto' } },
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: 52.52, lng: 13.405, label: 'Berlin' } },
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: 25.2048, lng: 55.2708, label: 'Dubai' } },
              { start: { lat: 6.5244, lng: 3.3792, label: 'Lagos' }, end: { lat: -26.2041, lng: 28.0473, label: 'Johannesburg' } },
            ]}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginTop: '32px',
            }}
          >
            {['🇳🇬 Nigeria', '🇺🇸 United States', '🇬🇧 United Kingdom', '🇨🇦 Canada', '🇩🇪 Germany', '🇦🇪 UAE', '🇿🇦 South Africa'].map((location) => (
              <span key={location} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }}>
                {location}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MODULES ============ */}
      <section id="modules" style={{ background: BG_PRIMARY, padding: '6rem 1.5rem' }}>
        <div data-reveal style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
          <p style={eyebrow}>What's Covered</p>
          <h2 style={{ ...sectionHeading('clamp(34px, 5vw, 52px)'), marginBottom: '1rem' }}>
            Six Things You'll Understand After This Session
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: STONE }}>
            No jargon. No textbooks. Just clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {modules.map(({ num, Icon, title, body }) => (
            <div
              key={num}
              data-reveal
              style={{ background: 'white', border: '1px solid rgba(26,58,22,0.08)', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)' }}
            >
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>{num}</p>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(26,58,22,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={20} color={FOREST} strokeWidth={1.75} />
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: INK, marginBottom: '0.75rem' }}>{title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: STONE, lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ LEARNING PATH ============ */}
      <section style={{ background: BG_ALT, padding: '6rem 1.5rem' }}>
        <div data-reveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={eyebrow}>The Roadmap</p>
          <h2 style={sectionHeading('clamp(34px, 5vw, 52px)')}>One Session. A Clear Path Forward.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: '896px', margin: '0 auto' }}>
          {/* Card 1 — active */}
          <div data-reveal style={{ background: FOREST, borderRadius: '16px', padding: '32px', borderTop: `3px solid ${GOLD}` }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>You Are Here</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>Stock 101</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>I understand how the market works.</p>
          </div>
          {/* Card 2 */}
          <div data-reveal style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '32px', opacity: 0.7 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 500, color: INK, marginBottom: '0.5rem' }}>Beginner Portfolio</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: STONE }}>I know what to invest in and why.</p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: GOLD, marginTop: '1rem', letterSpacing: '0.08em' }}>NEXT STEP →</p>
          </div>
          {/* Card 3 */}
          <div data-reveal style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '32px', opacity: 0.5 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 500, color: INK, marginBottom: '0.5rem' }}>Company Analysis</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: STONE }}>I can pick great companies myself.</p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: GOLD, marginTop: '1rem', letterSpacing: '0.08em' }}>COMING SOON →</p>
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section style={{ background: BG_PRIMARY, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '4rem', alignItems: 'start' }} data-reveal>
            <div>
              <p style={eyebrow}>Is This For You?</p>
              <h2 style={sectionHeading('clamp(32px, 4.5vw, 48px)')}>You're in the Right Place If...</h2>
            </div>
            <div>
              {whoFor.map((item) => (
                <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <CheckDot />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#2A2A2A', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal style={{ background: FOREST, borderRadius: '20px', padding: '2.5rem', marginTop: '4rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 32px)', fontStyle: 'italic', color: 'white', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              You don't need to understand everything before you start. You just need one session that finally makes it click.
            </p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: GOLD, letterSpacing: '0.08em' }}>— Titobi Oreolorun</p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT TITO ============ */}
      <section id="about" style={{ background: BG_ALT, padding: '6rem 1.5rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: '1024px', margin: '0 auto', gap: '4rem', alignItems: 'center' }} data-reveal>
          <img
            src="/images/titobi-authority.jpg"
            alt="Titobi Oreolorun"
            style={{ width: '100%', borderRadius: '20px', aspectRatio: '4 / 5', objectFit: 'cover' }}
          />
          <div>
            <p style={eyebrow}>Your Instructor</p>
            <h2 style={{ ...sectionHeading('clamp(32px, 4vw, 44px)'), marginBottom: '1.5rem' }}>
              Taught by Someone Who Learned It the Hard Way First.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8, marginBottom: '1rem' }}>
              Titobi Oreolorun — known as Teetobee — built his financial foundation inside GTBank and Zenith Bank. He didn't inherit wealth. He studied money from the inside out.
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8, marginBottom: '2rem' }}>
              He holds an MBA from Washington University's Olin Business School and has visited 15+ countries studying how people in different economies build wealth. Today he teaches everyday Nigerians to invest with structure, discipline, and confidence.
            </p>
          </div>
        </div>

        {/* Stats — circular progress-ring gauges (full-width row) */}
        <div
          className="stats-grid-4"
          data-reveal
          style={{
            maxWidth: '1024px',
            margin: '48px auto 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            padding: '40px 32px',
            background: '#FFFFFF',
            border: '1px solid rgba(26,58,22,0.08)',
            borderRadius: '24px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
          }}
        >
          <CircularStat value={15} suffix="+" label="Countries" percentage={75} color="#C9A84C" trackColor="rgba(201,168,76,0.12)" size={160} duration={2200} />
          <CircularStat value={2} label="Major Banks" percentage={40} color="#1A3A16" trackColor="rgba(26,58,22,0.08)" size={160} duration={1500} />
          <CircularStat value={300} prefix="$" suffix="K+" label="Revenue" percentage={90} color="#C9A84C" trackColor="rgba(201,168,76,0.12)" size={160} duration={2500} />
          <CircularStat value={100} suffix="K+" label="Followers" percentage={65} color="#1A3A16" trackColor="rgba(26,58,22,0.08)" size={160} duration={2000} />
        </div>
      </section>

      {/* ============ REGISTER ============ */}
      <section id="register" style={{ background: BG_PRIMARY, padding: '6rem 1.5rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: '1024px', margin: '0 auto', gap: '4rem', alignItems: 'start' }} data-reveal>
          <div>
            <p style={eyebrow}>Save Your Spot</p>
            <h2 style={{ ...sectionHeading('clamp(32px, 4.5vw, 48px)'), marginBottom: '1rem' }}>
              This Session Is Free. Your Future Isn't Free to Waste.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: STONE, marginBottom: '2rem', lineHeight: 1.7 }}>
              Fill in your details and we'll send you everything you need to join.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Free session — no credit card required', 'Confirmation sent via WhatsApp', 'Next session starts soon'].map((t) => (
                <div key={t} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <CheckDot />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#4A4A4A' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <RegisterForm />
        </div>
      </section>

      {/* ============ FAQ — static accordion ============ */}
      <section style={{ background: '#FFFFFF', padding: '96px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              FAQ
            </p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '48px',
                fontWeight: 400,
                color: '#0D0B08',
                lineHeight: 1.2,
              }}
            >
              Quick Answers
            </h2>
          </div>

          <LandingFaq
            items={[
              {
                q: 'Is this really free?',
                a: "Yes. Stock 101 is Tito's way of making financial education accessible to everyone — regardless of where you're starting from. No hidden fees, no credit card required.",
              },
              {
                q: 'Do I need any experience?',
                a: 'None at all. This session is designed specifically for beginners. If you can use a smartphone, you can attend. Tito starts from the very basics.',
              },
              {
                q: "I'm in the US/UK — is this relevant to me?",
                a: "Absolutely. Whether you're investing in Nigerian stocks, US markets, or both, the fundamentals are the same. Tito covers both landscapes in every session.",
              },
              {
                q: 'What happens after I register?',
                a: "You'll receive a WhatsApp message with the session details, date, and link to join. The confirmation usually arrives within a few hours.",
              },
              {
                q: 'I missed a previous session. Can I still join?',
                a: "Yes — register and you'll be added to the next available date. Sessions run regularly so you won't have to wait long.",
              },
            ]}
          />
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{ background: FOREST, padding: '8rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(120px, 22vw, 200px)" color="rgba(255,255,255,0.03)" position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          FREE
        </PullText>
        <div data-reveal style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            The Market Has Been Running Without You. Start Catching Up — For Free.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.65)', maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
            One session. One hour. Everything changes about how you see money.
          </p>
          <a
            href="#register"
            style={{ background: GOLD, color: FOREST, borderRadius: '999px', padding: '1rem 2.5rem', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}
          >
            Reserve My Free Spot →
          </a>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '1.5rem' }}>
            Still have questions?{' '}
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: 'none' }}>Chat with Tito →</a>
          </p>
        </div>
      </section>
    </div>
  )
}

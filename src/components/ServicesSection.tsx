import { Wallet, Sprout, Network, Compass, Zap, Sunrise } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { TITO_PERSONAL_WHATSAPP } from '@/lib/forms'

type Service = {
  number: string
  Icon: LucideIcon
  title: string
  body: string
  href: string
  /** Light cards (ivory) flip the gold accents to forest for contrast */
  tone: 'deep' | 'forest' | 'light'
}

const services: Service[] = [
  {
    number: '02',
    Icon: Sprout,
    title: "Beginner's Portfolio",
    body: "Your first step into investing. I'll guide you through building a starter portfolio that matches your risk tolerance and long-term goals.",
    href: '/beginners-portfolio',
    tone: 'deep',
  },
  {
    number: '03',
    Icon: Network,
    title: 'Close Community',
    body: "An exclusive community of growth-minded individuals sharing strategies, accountability, and direct access to Titobi's insights.",
    href: '/close-community',
    tone: 'deep',
  },
  {
    number: '04',
    Icon: Compass,
    title: 'Mentorship',
    body: 'Ongoing one-on-one guidance tailored to your financial journey. Strategy sessions, goal tracking, and direct accountability.',
    href: '/mentorship',
    tone: 'forest',
  },
  {
    number: '05',
    Icon: Zap,
    title: 'Quick Fire One-on-One',
    body: 'A focused 30-minute session to tackle one specific financial question or decision. Fast, direct, actionable.',
    href: '/quick-fire',
    tone: 'light',
  },
  {
    number: '06',
    Icon: Sunrise,
    title: 'Retirement Portfolio',
    body: 'Long-term wealth structuring designed for the life you want after work. We build positions today that compound into lasting freedom.',
    href: '/retirement',
    tone: 'deep',
  },
]

// Every text colour here clears WCAG AA (4.5:1) on its card. Brand gold is
// only 3.5:1 on #2D5A27, so the forest card uses a lighter gold (~5:1).
// focus: full class strings so Tailwind's JIT sees them.
const TONES = {
  deep: { bg: '#1A3A16', title: 'white', body: 'rgba(255,255,255,0.6)', accent: '#C9A84C', number: '#C9A84C', iconBg: 'rgba(201,168,76,0.12)', border: true, focus: 'focus-visible:outline-[#C9A84C]' },
  forest: { bg: '#2D5A27', title: 'white', body: 'rgba(255,255,255,0.75)', accent: '#E5CF8A', number: '#E5CF8A', iconBg: 'rgba(201,168,76,0.12)', border: true, focus: 'focus-visible:outline-[#E5CF8A]' },
  light: { bg: '#F8F5EE', title: '#0D0D0D', body: '#6B6B6B', accent: '#2D5A27', number: '#2D5A27', iconBg: 'rgba(45,90,39,0.08)', border: false, focus: 'focus-visible:outline-[#2D5A27]' },
}

const FOCUS_RING = 'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'

const linkStyle = (color: string): React.CSSProperties => ({
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  color,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
})

const iconBoxStyle = (background: string): React.CSSProperties => ({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  background,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export default function ServicesSection() {
  return (
    <section id="services" style={{ background: '#EDE8DC', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <span data-reveal style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              How I Help
            </span>
            <h2 data-reveal style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 4vw, 4.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: '#0D0D0D',
              lineHeight: 1.05
            }}>
              Built for Every Stage<br />of Your Journey
            </h2>
          </div>
          <a
            data-reveal
            href={TITO_PERSONAL_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full transition-colors duration-200 shrink-0"
            style={{
              background: '#2D5A27',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 500,
              paddingLeft: '1.75rem',
              paddingRight: '0.375rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
          >
            Book a Call
            <span style={{
              background: 'white',
              borderRadius: '9999px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>

        {/* Card grid. Seven tiles that fill every row: at lg it reads 2+1,
            1+1+1, 1+2 (Stock 101 and the closing "not sure" tile are the wide
            ones), at sm it is 2-up with the closing tile full width. Six
            services alone left two empty cells beside Retirement at lg. */}
        <div data-cards className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — image background, spans 2 cols */}
          <div
            data-card
            className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] service-card"
          >
            <img
              src="/images/titobi-services.jpg"
              srcSet="/images/titobi-services-xs.webp 640w, /images/titobi-services-sm.webp 1024w, /images/titobi-services-md.webp 1920w, /images/titobi-services.webp 2560w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)' }}
            />
            <span
              className="absolute top-4 right-4 z-20 rounded-full px-3 py-1"
              style={{
                background: '#C9A84C',
                color: 'white',
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              FREE · Monthly
            </span>
            <div className="relative z-10 p-7 flex flex-col justify-between h-full min-h-[300px]">
              <div className="flex items-center gap-3">
                <div className="service-icon" style={iconBoxStyle('rgba(201,168,76,0.12)')}>
                  <Wallet className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: '#C9A84C' }}>01</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                  Stock 101
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6 }}>
                  A beginner-friendly class designed to help you understand the stock market, how stocks work, and what you need to know before you start investing.
                </p>
                <a
                  href="https://chat.whatsapp.com/ExWenty0nsYHGFK4UZbi2t?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${FOCUS_RING} focus-visible:outline-[#C9A84C]`}
                  style={{ ...linkStyle('#C9A84C'), marginTop: '1rem' }}
                >
                  Join Stock 101 <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cards 2–6 share one layout: icon and number on one row, title
              straight under them, link pinned to the foot. Titles and links
              therefore line up across a row whatever the body length. */}
          {services.map(({ number, Icon, title, body, href, tone }) => {
            const t = TONES[tone]
            return (
              <div
                key={number}
                data-card
                className={`rounded-2xl p-7 flex flex-col min-h-[300px] service-card${t.border ? ' service-border' : ''}`}
                style={{ background: t.bg }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="service-icon" style={iconBoxStyle(t.iconBg)}>
                    <Icon className="w-5 h-5" style={{ color: t.accent }} />
                  </div>
                  <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: t.number }}>{number}</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: t.title, lineHeight: 1.15, marginBottom: '0.6rem' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: t.body, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {body}
                </p>
                <div className="mt-auto pt-6">
                  <a href={href} className={`${FOCUS_RING} ${t.focus}`} style={linkStyle(t.accent)}>
                    Get Started<span className="sr-only">: {title}</span> <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            )
          })}

          {/* Closing tile. Fills the row beside Retirement and answers the
              question six options raise. Same offer and wording as FinalCTA. */}
          <div
            data-card
            className="sm:col-span-2 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-8 min-h-[300px] service-card"
            style={{ background: '#C9A84C' }}
          >
            <div className="flex flex-col h-full">
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#1A3A16', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
                Not sure where to start?
              </span>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1A3A16', lineHeight: 1.05, marginBottom: '0.9rem', maxWidth: '420px' }}>
                Book a call and find the one that fits.
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#1A3A16', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '400px' }}>
                Free 30-minute consultation · No commitment required
              </p>
            </div>
            <a
              href={TITO_PERSONAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full transition-colors duration-200 self-start md:self-auto shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A3A16]"
              style={{
                background: '#1A3A16',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                paddingLeft: '2rem',
                paddingRight: '0.5rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0D0D0D')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1A3A16')}
            >
              Book a Call
              <span style={{ background: 'white', borderRadius: '9999px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

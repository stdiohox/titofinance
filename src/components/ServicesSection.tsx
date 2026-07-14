import { Wallet, Sprout, Network, Compass, Zap, Sunrise } from 'lucide-react'

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
          <button
            data-reveal
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
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
          >
            Book a Free Strategy Call
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
          </button>
        </div>

        {/* Card grid */}
        <div data-cards className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — image background, spans 2 cols */}
          <div
            data-card
            className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[320px] service-card"
          >
            <img
              src="/images/titobi-services.jpg"
              srcSet="/images/titobi-services-xs.webp 640w, /images/titobi-services-sm.webp 1024w, /images/titobi-services-md.webp 1920w, /images/titobi-services.webp 2560w"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
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
            <div className="relative z-10 p-7 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="service-icon" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(201,168,76,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Wallet className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(201,168,76,0.5)' }}>01</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                  Personal Financial Management 101
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6 }}>
                  A free monthly session covering the fundamentals of money management — budgeting, saving, and building healthy financial habits from the ground up.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            data-card
            className="rounded-2xl p-7 flex flex-col justify-between min-h-[320px] service-card service-border"
            style={{ background: '#1A3A16' }}
          >
            <div>
              <div className="service-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Sprout className="w-5 h-5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(201,168,76,0.5)' }}>02</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                Beginner's Portfolio
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your first step into investing. I'll guide you through building a starter portfolio that matches your risk tolerance and long-term goals.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            data-card
            className="rounded-2xl p-7 flex flex-col justify-between min-h-[320px] service-card service-border"
            style={{ background: '#1A3A16' }}
          >
            <div>
              <div className="service-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Network className="w-5 h-5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(201,168,76,0.5)' }}>03</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                Closed Circuit Group
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                An exclusive community of growth-minded individuals sharing strategies, accountability, and direct access to Titobi's insights.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            data-card
            className="rounded-2xl p-7 flex flex-col min-h-[320px] service-card service-border"
            style={{ background: '#2D5A27' }}
          >
            <div className="flex-1">
              <div className="service-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Compass className="w-5 h-5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-xs tracking-widest block" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(201,168,76,0.5)', marginBottom: '0.75rem' }}>04</span>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                Mentorship
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Ongoing one-on-one guidance tailored to your financial journey. Strategy sessions, goal tracking, and direct accountability.
              </p>
            </div>
            <a href="#final-cta" className="mt-auto" style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#C9A84C',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              paddingTop: '1rem'
            }}>
              Book a Call →
            </a>
          </div>

          {/* Card 5 */}
          <div
            data-card
            className="rounded-2xl p-7 flex flex-col min-h-[320px] service-card"
            style={{ background: '#F8F5EE' }}
          >
            <div className="flex-1">
              <div className="service-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(45,90,39,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Zap className="w-5 h-5" style={{ color: '#2D5A27' }} />
              </div>
              <span className="text-xs tracking-widest block" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(26,58,22,0.4)', marginBottom: '0.75rem' }}>05</span>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: '#0D0D0D', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                Quick Fire One-on-One
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6B6B6B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                A focused 30-minute session to tackle one specific financial question or decision. Fast, direct, actionable.
              </p>
            </div>
            <a href="#final-cta" className="mt-auto" style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#2D5A27',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              paddingTop: '1rem'
            }}>
              Book a Call →
            </a>
          </div>

          {/* Card 6 */}
          <div
            data-card
            className="lg:col-span-1 rounded-2xl p-7 flex flex-col justify-between min-h-[320px] service-card service-border"
            style={{ background: '#1A3A16' }}
          >
            <div>
              <div className="service-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Sunrise className="w-5 h-5" style={{ color: '#C9A84C' }} />
              </div>
              <span className="text-xs tracking-widest" style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(201,168,76,0.5)' }}>06</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, marginBottom: '0.6rem' }}>
                Retirement Portfolio
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Long-term wealth structuring designed for the life you want after work.
                We build positions today that compound into lasting freedom.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

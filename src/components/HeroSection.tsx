export default function HeroSection() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 px-6 pt-5 pb-6">
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ height: 'calc(100vh - 88px)' }}
        >
          {/* Background image */}
          <picture>
            <source
              srcSet="/images/titobi-hero-new-xs.webp 640w, /images/titobi-hero-new-sm.webp 1024w, /images/titobi-hero-new-md.webp 1920w, /images/titobi-hero-new.webp 2560w"
              sizes="100vw"
              type="image/webp"
            />
            <img
              src="/images/titobi-hero-new.jpeg"
              alt="Titobi Oreolorun"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center 20%'
              }}
              fetchPriority="high"
              loading="eager"
              draggable={false}
            />
          </picture>

          {/* Gradient overlay — dark studio bg means lighter overlay needed */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 100%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-10 md:p-14 pt-28 md:pt-32">

            {/* Eyebrow */}
            <p style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: '1.75rem'
            }}>
              Personal Finance · Investment Strategy · Wealth Building
            </p>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-[clamp(3.2rem,6vw,7rem)]" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'white',
              maxWidth: '700px',
              marginBottom: '1.75rem'
            }}>
              Your Money Should<br />Work Harder<br />Than You Do.
            </h1>

            {/* Subtext */}
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.68)',
              maxWidth: '460px',
              lineHeight: 1.65,
              marginBottom: '2.5rem'
            }}>
              From a living room floor in Nigeria to an MBA from WashU and 15 countries — Titobi Oreolorun exists to make sure your financial story ends differently.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                className="hidden md:inline-flex items-center gap-3 rounded-full transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                style={{
                  background: '#2D5A27',
                  color: 'white',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  paddingLeft: '2rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
              >
                Book a Free Strategy Call
                <span style={{
                  background: 'white',
                  borderRadius: '9999px',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>

              <a
                href="#"
                className="inline-flex items-center gap-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                Watch My Story
                <span style={{
                  background: '#C9A84C',
                  borderRadius: '9999px',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Stats — pinned to bottom */}
            <div className="mt-auto hidden md:flex flex-wrap gap-10 pb-2">
              {[
                { number: '15+', label: 'Countries' },
                { number: '$300K+', label: 'Education Invested' },
                { number: '2', label: 'Major Banks' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                    fontWeight: 500,
                    color: '#C9A84C',
                    letterSpacing: '-0.03em',
                    lineHeight: 1
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.45)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginTop: '0.25rem'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
            <div style={{ width: '1px', height: '2.5rem', background: 'rgba(255,255,255,0.25)' }} />
            <div className="scroll-dot" style={{ width: '4px', height: '4px', borderRadius: '9999px', background: '#C9A84C' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

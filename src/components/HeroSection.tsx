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
            <div className="flex flex-wrap gap-4 mt-auto md:mt-0">
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
                className="flex items-center gap-3 cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                {/* Text */}
                <span className="text-white text-sm tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  Watch My Story
                </span>

                {/* Container: gold circle anchor + plane flying out with trail */}
                <div className="relative flex items-center" style={{ width: '80px', height: '48px' }}>

                  {/* Gold circle (left side of container) */}
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#C9A84C',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />

                  {/* Paper plane + dashed trail SVG flying out of the circle */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="48"
                    viewBox="0 0 80 48"
                    fill="none"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ position: 'absolute', left: 0, top: 0 }}
                  >
                    {/* Dashed looping trail starting from circle center */}
                    <path
                      d="M20 24 C 28 32, 36 36, 38 28 C 40 20, 34 16, 42 10 C 50 4, 62 8, 70 4"
                      strokeWidth="1.8"
                      strokeDasharray="4,3"
                      stroke="white"
                      opacity="0.6"
                    />
                    {/* Paper plane at the end of the trail (top right) */}
                    <polygon
                      points="70,4 58,14 61,20 74,8"
                      strokeWidth="1.8"
                      stroke="white"
                      fill="none"
                    />
                    <line x1="61" y1="20" x2="70" y2="4" strokeWidth="1.5" stroke="white" />
                    <line x1="58" y1="14" x2="66" y2="16" strokeWidth="1.2" stroke="white" />
                  </svg>
                </div>
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

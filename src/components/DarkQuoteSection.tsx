export default function DarkQuoteSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#1A3A16', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}
    >
      <div className="relative z-10 max-w-[88rem] mx-auto text-center">

        <span data-reveal style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: '#C9A84C',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          display: 'block',
          marginBottom: '2.5rem'
        }}>
          Proximity is Power
        </span>

        <blockquote data-reveal style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 3.5vw, 4rem)',
          color: '#F8F5EE',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          maxWidth: '880px',
          margin: '0 auto 1.25rem'
        }}>
          "I haven't reached my ultimate destination yet. That's exactly why I'm the right person to guide you."
        </blockquote>

        <p data-reveal style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: '#C9A84C',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '4.5rem'
        }}>
          — Titobi Oreolorun
        </p>

        {/* Editorial split bar stats */}
        <div
          data-reveal
          className="stats-grid"
          style={{
            marginTop: '4rem',
            marginBottom: '3.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          {[
            {
              number: '15+',
              label: 'Countries Visited',
              caption: 'Lagos → St. Louis → the world',
            },
            {
              number: '2',
              label: 'Major Banks',
              caption: 'Zenith Bank · GTBank',
            },
            {
              number: '$300K+',
              label: 'Education Invested',
              caption: 'WashU Olin MBA',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '2.5rem 2rem',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(201,168,76,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                position: 'relative',
              }}
            >
              {/* Top label */}
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: 'rgba(248,245,238,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                display: 'block',
                marginBottom: '1rem'
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Large number */}
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(3rem, 5vw, 5.5rem)',
                fontWeight: 400,
                color: '#F8F5EE',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                display: 'block',
                marginBottom: '1.25rem'
              }}>
                {stat.number}
              </span>

              {/* Gold rule */}
              <div style={{
                width: '2rem',
                height: '1px',
                background: '#C9A84C',
                marginBottom: '1rem'
              }} />

              {/* Label */}
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: 'rgba(248,245,238,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                display: 'block',
                marginBottom: '0.4rem'
              }}>
                {stat.label}
              </span>

              {/* Caption */}
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'rgba(201,168,76,0.6)',
                letterSpacing: '0.01em',
                lineHeight: 1.4
              }}>
                {stat.caption}
              </span>
            </div>
          ))}
        </div>

        <button
          data-reveal
          className="inline-flex items-center gap-3 rounded-full transition-colors duration-200"
          style={{
            background: '#F8F5EE',
            color: '#0D0D0D',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            paddingLeft: '2rem',
            paddingRight: '0.5rem',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'white')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F8F5EE')}
        >
          Book a Free Strategy Call
          <span style={{
            background: '#2D5A27',
            borderRadius: '9999px',
            padding: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>

      </div>
    </section>
  )
}

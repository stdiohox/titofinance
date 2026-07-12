const letters = [
  {
    letter: 'G',
    heading: 'Global',
    body: 'Access shares in top international companies — US, UK, Europe, Asia — all from your local brokerage account.'
  },
  {
    letter: 'D',
    heading: 'Depositary',
    body: 'A trusted financial structure that holds foreign shares on your behalf, making global investing safe, regulated, and accessible.'
  },
  {
    letter: 'R',
    heading: 'Receipt',
    body: 'Your proof of ownership. A GDR gives you real equity in world-class companies — with dividends, capital gains, and portfolio growth that crosses borders.'
  },
]

export default function GDRSection() {
  return (
    <section id="gdr" className="bg-[#F8F5EE] px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left */}
        <div>
          <span data-reveal style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: '#C9A84C',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            display: 'block',
            marginBottom: '1rem'
          }}>
            The Method
          </span>

          <h2 data-reveal style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#0D0D0D',
            lineHeight: 1.05,
            marginBottom: '1.5rem'
          }}>
            Tito's GDR Strategy
          </h2>

          <p data-reveal className="text-base" style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#6B6B6B',
            lineHeight: 1.75,
            maxWidth: '420px',
            marginBottom: '1.5rem'
          }}>
            A Global Depositary Receipt (GDR) is one of the most powerful — and least talked about — tools for building an international investment portfolio. It allows everyday investors to own shares in world-class foreign companies without leaving their home market.
          </p>

          <p data-reveal className="text-base" style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#6B6B6B',
            lineHeight: 1.75,
            maxWidth: '420px',
            marginBottom: '2rem'
          }}>
            Titobi's GDR Strategy is built around this instrument — giving his clients access to global wealth-building opportunities that most people never knew existed.
          </p>

          <button
            data-reveal
            className="inline-flex items-center gap-3 rounded-full transition-colors duration-200"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
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
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
          >
            Learn the Strategy
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

        {/* Right — G / D / R cards */}
        <div data-cards className="flex flex-col gap-4">
          {letters.map(({ letter, heading, body }) => (
            <div
              key={letter}
              data-card
              className="bg-[#1A3A16] rounded-2xl p-7 flex items-start gap-6"
            >
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '4.5rem',
                fontWeight: 500,
                color: '#C9A84C',
                lineHeight: 1,
                flexShrink: 0,
                width: '3rem',
                textAlign: 'center'
              }}>
                {letter}
              </span>
              <div>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em'
                }}>
                  {heading}
                </h3>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.65
                }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

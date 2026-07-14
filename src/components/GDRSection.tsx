const portfolios = [
  {
    letter: 'G',
    title: 'Growth Portfolio',
    objective: 'Aggressive long-term capital appreciation',
    coreAssets: 'Stocks, equity funds, ETFs, small business equity',
    bestFor: 'Longer time horizons that can ride out market swings',
    bg: '#1A3A16',
    letterColor: '#C9A84C',
    titleColor: 'white',
    labelColor: 'rgba(255,255,255,0.4)',
    bodyColor: 'rgba(255,255,255,0.7)',
    dividerColor: 'rgba(255,255,255,0.12)',
    bestForColor: 'rgba(248,245,238,0.8)',
  },
  {
    letter: 'D',
    title: 'Dividend Portfolio',
    objective: 'Steady, recurring passive income',
    coreAssets: 'Dividend-paying stocks, REITs, income-focused funds',
    bestFor: 'Investors who want regular cash flow alongside growth',
    bg: '#C9A84C',
    letterColor: '#1A3A16',
    titleColor: '#1A3A16',
    labelColor: 'rgba(26,58,22,0.55)',
    bodyColor: 'rgba(26,58,22,0.85)',
    dividerColor: 'rgba(26,58,22,0.2)',
    bestForColor: '#1A3A16',
  },
  {
    letter: 'R',
    title: 'Retirement Portfolio',
    objective: 'Capital preservation & predictable income',
    coreAssets: 'Bonds, T-bills, balanced / retirement-focused funds',
    bestFor: 'Those nearing or planning for retirement',
    bg: '#1A3A16',
    letterColor: '#C9A84C',
    titleColor: 'white',
    labelColor: 'rgba(255,255,255,0.4)',
    bodyColor: 'rgba(255,255,255,0.7)',
    dividerColor: 'rgba(255,255,255,0.12)',
    bestForColor: 'rgba(248,245,238,0.8)',
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
            The Framework
          </span>

          <h2 data-reveal style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#0D0D0D',
            lineHeight: 1.05,
            marginBottom: '1.25rem'
          }}>
            Tito's GDR Strategy
          </h2>

          <p data-reveal style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
            color: '#2D5A27',
            lineHeight: 1.4,
            maxWidth: '460px',
            marginBottom: '1.5rem'
          }}>
            A portfolio strategy that splits your money across three purpose-built buckets — each with a different job to do.
          </p>

          <p data-reveal className="text-base" style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#6B6B6B',
            lineHeight: 1.75,
            maxWidth: '420px',
            marginBottom: '2rem'
          }}>
            GDR is not just an acronym — it's a complete wealth system. Every naira or dollar you earn gets assigned a job: grow it aggressively, collect income from it steadily, or protect it for the future. Three portfolios. One plan. Built to last.
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

        {/* Right — portfolio cards */}
        <div data-cards className="flex flex-col gap-4">
          {portfolios.map((p) => (
            <div
              key={p.letter}
              data-card
              className="rounded-2xl p-7"
              style={{ background: p.bg }}
            >
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3.5rem',
                fontWeight: 500,
                color: p.letterColor,
                lineHeight: 1,
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                {p.letter}
              </span>

              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: p.titleColor,
                letterSpacing: '-0.01em',
                marginBottom: '1.25rem'
              }}>
                {p.title}
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  color: p.labelColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  display: 'block',
                  marginBottom: '0.3rem'
                }}>
                  Objective
                </span>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  color: p.bodyColor,
                  lineHeight: 1.6
                }}>
                  {p.objective}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  color: p.labelColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  display: 'block',
                  marginBottom: '0.3rem'
                }}>
                  Core Assets
                </span>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  color: p.bodyColor,
                  lineHeight: 1.6
                }}>
                  {p.coreAssets}
                </p>
              </div>

              <div style={{ height: '1px', background: p.dividerColor, marginBottom: '1rem' }} />

              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: p.bestForColor,
                lineHeight: 1.45
              }}>
                Best for: {p.bestFor}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

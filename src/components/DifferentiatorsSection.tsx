export default function DifferentiatorsSection() {
  const points = [
    {
      number: '01',
      heading: 'Intelligence',
      body: 'Backed by an MBA from WashU Olin Business School. Elite analytical frameworks applied to your personal economy — not corporate jargon. Real strategy.'
    },
    {
      number: '02',
      heading: 'Experience',
      body: 'Years inside Zenith Bank and GTBank. Cross-border ventures across 15 countries. Real wins and real losses — both teach what textbooks cannot.'
    },
    {
      number: '03',
      heading: 'Integrity',
      body: 'Open-door policy. No turned-away clients. Honest guidance without hidden agendas. If you are serious about changing your financial trajectory, the door is open.'
    },
  ]

  return (
    <section id="differentiators" style={{ background: '#F8F5EE', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

        {/* Col 1 — Headline */}
        <div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 4.5vw, 5.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: '#0D0D0D',
            lineHeight: 1.0
          }}>
            Intelligence.<br />Experience.<br />Integrity.
          </h2>
        </div>

        {/* Col 2 — Points */}
        <div className="flex flex-col">
          {points.map((point) => (
            <div
              key={point.number}
              data-reveal
              style={{
                borderTop: '1px solid rgba(45,90,39,0.15)',
                padding: '1.75rem 0'
              }}
            >
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                color: '#C9A84C',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '0.6rem'
              }}>
                {point.number}
              </span>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 500,
                color: '#0D0D0D',
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em'
              }}>
                {point.heading}
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
                color: '#6B6B6B',
                lineHeight: 1.7
              }}>
                {point.body}
              </p>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(45,90,39,0.15)' }} />
        </div>

        {/* Col 3 — Authority photo */}
        <div
          data-reveal
          className="relative rounded-2xl overflow-hidden lg:sticky lg:top-8"
          style={{ aspectRatio: '3/4' }}
        >
          <img
            src="/images/titobi-authority.jpg"
            srcSet="/images/titobi-authority-xs.webp 640w, /images/titobi-authority-sm.webp 1024w, /images/titobi-authority-md.webp 1920w, /images/titobi-authority.webp 2560w"
            sizes="(max-width: 1024px) 0vw, 33vw"
            alt="Titobi Oreolorun"
            className="w-full h-full object-cover object-top"
            loading="lazy"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(45,90,39,0.12)' }}
          />
        </div>

      </div>
    </section>
  )
}

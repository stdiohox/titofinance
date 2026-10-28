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
      {/* Headline across the top, then photo and points side by side at lg.
          As three columns, the headline column ran empty for ~400px under
          three short lines while the points and photo carried on beside it. */}
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-16 lg:gap-y-14">

        {/* Headline — no forced breaks: one line at lg, wraps a word per line
            on phones */}
        <div className="lg:col-span-12">
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 4.5vw, 5.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: '#0D0D0D',
            lineHeight: 1.0
          }}>
            Intelligence. Experience. Integrity.
          </h2>
        </div>

        {/* Points */}
        <div className="flex flex-col lg:col-span-7 lg:col-start-6 lg:row-start-2">
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
                fontSize: '0.95rem',
                color: '#6B6B6B',
                lineHeight: 1.7,
                maxWidth: '40rem'
              }}>
                {point.body}
              </p>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(45,90,39,0.15)' }} />
        </div>

        {/* Authority photo — left of the points at lg (Story above has its
            media on the right, so the page alternates), and stretched to the
            points' height so neither column ends early. 3:4 when stacked. */}
        <div
          data-reveal
          className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[16/10] lg:aspect-auto lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:min-h-[420px]"
        >
          <img
            src="/images/titobi-authority.jpg"
            srcSet="/images/titobi-authority-xs.webp 640w, /images/titobi-authority-sm.webp 1024w, /images/titobi-authority-md.webp 1920w, /images/titobi-authority.webp 2560w"
            sizes="(max-width: 1024px) 100vw, 40vw"
            alt="Titobi Oreolorun"
            className="absolute inset-0 w-full h-full object-cover object-top"
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

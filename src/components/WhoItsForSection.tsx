const qualifiers = [
  "You don't know where your money goes each month",
  "You want to start building a real investment portfolio",
  "Retirement feels overwhelming or too far away",
  "You've tried and failed — and want a real strategy",
  "You're ready to stop guessing and start building",
]

export default function WhoItsForSection() {
  return (
    <section id="who" style={{ background: '#EDE8DC', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        <div>
          <span data-reveal style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
            Is This You?
          </span>
          <h2 data-reveal style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 4vw, 4.5rem)', fontWeight: 500, letterSpacing: '-0.03em', color: '#0D0D0D', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Ages 18 to 70.<br />Confused or Curious —<br />Let's Talk.
          </h2>
          <p data-reveal style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2rem' }}>
            Whether you're figuring out where your money goes, building your first portfolio, or planning retirement — if you're serious, Titobi is ready.
          </p>
          <a
            data-reveal
            href="https://wa.me/2348184750870"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full transition-colors duration-200"
            style={{ background: '#2D5A27', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 500, paddingLeft: '1.75rem', paddingRight: '0.375rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
          >
            Book a Free Strategy Call
            <span style={{ background: 'white', borderRadius: '9999px', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>

        <div className="flex flex-col">
          {qualifiers.map((item, i) => (
            <div
              key={i}
              data-reveal
              className="flex items-start gap-4"
              style={{ padding: '1.25rem 0', borderBottom: '1px solid rgba(45,90,39,0.12)' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#2D5A27', marginTop: '0.45rem', flexShrink: 0 }} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: '#2A2A2A', lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

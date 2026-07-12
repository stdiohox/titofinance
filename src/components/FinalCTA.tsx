export default function FinalCTA() {
  return (
    <section id="final-cta" className="relative overflow-hidden" style={{ padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}>
      <img
        src="/images/titobi-cta.jpg"
        srcSet="/images/titobi-cta-xs.webp 640w, /images/titobi-cta-sm.webp 1024w, /images/titobi-cta-md.webp 1920w, /images/titobi-cta.webp 2560w"
        sizes="100vw"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, #F8F5EE 0%, rgba(248,245,238,0.95) 40%, rgba(248,245,238,0.3) 100%)' }}
      />

      <div className="relative z-10 max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span data-reveal style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
            The Door Is Open
          </span>
          <h2 data-reveal style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(2.8rem, 5vw, 6rem)', fontWeight: 400, letterSpacing: '-0.04em', color: '#0D0D0D', lineHeight: 1.0, marginBottom: '1.5rem' }}>
            Are You Ready<br />to Walk<br />Through?
          </h2>
          <p data-reveal style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: '#6B6B6B', lineHeight: 1.7, maxWidth: '400px', marginBottom: '2rem' }}>
            No walls. No jargon. No gatekeeping. If you are serious about changing your financial trajectory, Titobi is ready to speak with you.
          </p>
          <button
            data-reveal
            className="inline-flex items-center gap-3 rounded-full transition-colors duration-200"
            style={{ background: '#2D5A27', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 500, paddingLeft: '2rem', paddingRight: '0.5rem', paddingTop: '0.625rem', paddingBottom: '0.625rem' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
          >
            Book Your Free Strategy Call
            <span style={{ background: 'white', borderRadius: '9999px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </button>
          <p data-reveal style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.75rem' }}>
            Free 30-minute consultation · No commitment required
          </p>
        </div>
      </div>
    </section>
  )
}

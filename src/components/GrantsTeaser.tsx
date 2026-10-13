import { GRANT_COUNT } from '../lib/grants'

export default function GrantsTeaser() {
  return (
    <section id="grants" style={{ background: '#1A3A16', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div style={{ maxWidth: '640px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', fontWeight: 400, letterSpacing: '-0.03em', color: '#F8F5EE', lineHeight: 1.05, marginBottom: '1rem' }}>
            Opportunity Grants — October 2026
          </h2>
          <p data-reveal style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'rgba(248,245,238,0.75)', lineHeight: 1.7 }}>
            {GRANT_COUNT} Nigerian-eligible grants, with links, all closing between October 5th and October 30th, 2026.
          </p>
        </div>
        <a
          data-reveal
          href="/grants"
          className="inline-flex items-center gap-3 rounded-full transition-opacity duration-200 hover:opacity-90 self-start md:self-auto shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8F5EE]"
          style={{ background: '#C9A84C', color: '#0D0B08', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 500, paddingLeft: '2rem', paddingRight: '0.5rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', textDecoration: 'none' }}
        >
          View all {GRANT_COUNT} grants
          <span style={{ background: '#0D0B08', borderRadius: '9999px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </section>
  )
}

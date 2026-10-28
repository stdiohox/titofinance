import { GRANT_COUNT } from '../lib/grants'

export default function GrantsTeaser() {
  return (
    <section id="grants" style={{ background: '#1A3A16', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
      {/* Copy and button on the left, the count on the right. With the button
          pushed to the far edge, the band was ~700px of empty green between
          the two at desktop. */}
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-7" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', fontWeight: 400, letterSpacing: '-0.03em', color: '#F8F5EE', lineHeight: 1.05, marginBottom: '1rem' }}>
            Opportunity Grants — October 2026
          </h2>
          <p data-reveal style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'rgba(248,245,238,0.75)', lineHeight: 1.7, marginBottom: '2rem' }}>
            {GRANT_COUNT} Nigerian-eligible grants, with links, all closing between October 5th and October 30th, 2026.
          </p>
          <a
            data-reveal
            href="/grants"
            className="inline-flex items-center gap-3 rounded-full transition-[filter] duration-200 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8F5EE]"
            style={{ background: '#C9A84C', color: '#0D0B08', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 500, paddingLeft: '2rem', paddingRight: '0.5rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', textDecoration: 'none' }}
          >
            View all {GRANT_COUNT} grants
            <span style={{ background: '#0D0B08', borderRadius: '9999px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>

        <div
          data-reveal
          aria-hidden="true"
          className="hidden md:flex md:col-span-5 items-end gap-5 rounded-2xl p-8 lg:p-10"
          style={{ border: '1px solid rgba(201,168,76,0.25)', background: 'rgba(248,245,238,0.03)' }}
        >
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(5rem, 9vw, 8.5rem)', fontWeight: 500, letterSpacing: '-0.04em', color: '#C9A84C', lineHeight: 0.8 }}>
            {GRANT_COUNT}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(248,245,238,0.6)', textTransform: 'uppercase', lineHeight: 1.8, paddingBottom: '0.25rem' }}>
            Grants<br />Nigerian-eligible<br />Links included
          </span>
        </div>
      </div>
    </section>
  )
}

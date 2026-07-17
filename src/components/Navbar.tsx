import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav
      id="main-nav"
      className="absolute top-0 left-0 right-0 z-20 px-6 py-6 transition-all duration-300"
    >
      <div className="max-w-[88rem] mx-auto flex items-center justify-between">

        {/* Logo */}
        <img
          src={scrolled ? '/tf-icon-green.png' : '/tf-icon-white.png'}
          alt="Tito Finance"
          style={{
            height: '38px',
            width: 'auto',
            transition: 'opacity 0.3s ease'
          }}
          draggable={false}
        />

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'About', href: '#story' },
            { label: 'Approach', href: '#differentiators' },
            { label: 'Services', href: '#services' },
            { label: 'Results', href: '#who' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: scrolled ? '#6B6B6B' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? '#0D0D0D' : 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#6B6B6B' : 'rgba(255,255,255,0.75)')}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* CTA — hidden on mobile; the hamburger overlay carries the booking CTA there */}
          <a
            href="https://wa.me/2348184750870"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-3 rounded-full transition-colors duration-200 md:mr-6"
            style={{
              background: scrolled ? '#2D5A27' : 'white',
              color: scrolled ? 'white' : '#0D0D0D',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              paddingLeft: '1.5rem',
              paddingRight: '0.375rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = scrolled ? '#1A3A16' : '#F8F5EE')}
            onMouseLeave={e => (e.currentTarget.style.background = scrolled ? '#2D5A27' : 'white')}
          >
            Book a Call
            <span style={{
              background: scrolled ? 'white' : '#2D5A27',
              borderRadius: '9999px',
              padding: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={scrolled ? '#0D0D0D' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col items-center justify-center"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(open => !open)}
            style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', gap: '4px' }}
          >
            <div className="w-5 h-[1.5px]" style={{ background: scrolled ? '#0D0D0D' : 'white', transition: 'background 0.3s ease' }} />
            <div className="w-5 h-[1.5px]" style={{ background: scrolled ? '#0D0D0D' : 'white', transition: 'background 0.3s ease' }} />
            <div className="w-5 h-[1.5px]" style={{ background: scrolled ? '#0D0D0D' : 'white', transition: 'background 0.3s ease' }} />
          </button>
        </div>

      </div>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
        style={{
          background: '#F8F5EE',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
        >
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '24px', height: '1.5px', background: '#6B6B6B', transform: 'rotate(45deg)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '24px', height: '1.5px', background: '#6B6B6B', transform: 'rotate(-45deg)' }} />
          </div>
        </button>

        {[
          { label: 'About', href: '#story' },
          { label: 'Approach', href: '#differentiators' },
          { label: 'Services', href: '#services' },
          { label: 'Results', href: '#who' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              color: '#0D0D0D',
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            {label}
          </a>
        ))}

        <a
          href="https://wa.me/2348184750870"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          className="inline-flex items-center justify-center gap-3 rounded-full transition-colors duration-200 w-full max-w-xs"
          style={{
            background: '#2D5A27',
            color: 'white',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            paddingLeft: '2rem',
            paddingRight: '0.5rem',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            textDecoration: 'none',
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
        </a>
      </div>
    </nav>
  )
}

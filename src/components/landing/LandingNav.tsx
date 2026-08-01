import { useEffect, useState } from 'react'

const centerLinks = [
  { label: 'About', href: '#about' },
  { label: 'The Session', href: '#modules' },
  { label: "Who It's For", href: '#who' },
  { label: 'Register', href: '#register' },
]

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkColor = scrolled ? 'rgba(26,58,22,0.65)' : 'rgba(255,255,255,0.75)'
  const linkHover = scrolled ? '#1A3A16' : '#FFFFFF'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem clamp(1.5rem, 4vw, 3.5rem)',
        background: scrolled ? 'rgba(248,245,238,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,58,22,0.1)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Logo (swaps to green when the bar turns cream, so it stays legible) */}
      <a href="https://titofinance.com" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img
          src={scrolled ? '/tf-icon-green.png' : '/tf-icon-white.png'}
          alt="Tito Finance"
          style={{ height: '30px', width: 'auto' }}
        />
      </a>

      {/* Center navigation (hidden on mobile) */}
      <nav className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {centerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: linkColor,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = linkHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = linkColor
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <a
        href="#register"
        className="landing-nav-cta"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          background: '#C9A84C',
          color: '#1A3A16',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: '999px',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#B8972B'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#C9A84C'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Book Free Session →
      </a>
    </header>
  )
}

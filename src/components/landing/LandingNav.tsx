import { useEffect, useState } from 'react'

interface LandingNavProps {
  theme?: 'dark' | 'green'
}

export default function LandingNav({ theme = 'dark' }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrolledBg = theme === 'green' ? 'rgba(26,58,22,0.9)' : 'rgba(13,11,8,0.9)'

  return (
    <nav
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
        background: scrolled ? scrolledBg : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
      }}
    >
      <a href="https://titofinance.com" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/tf-icon-white.png" alt="Tito Finance" style={{ height: '30px', width: 'auto' }} />
      </a>

      <a
        href="https://wa.me/2348184750870"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#C9A84C',
          color: '#0D0B08',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          padding: '0.6rem 1.5rem',
          borderRadius: '999px',
          textDecoration: 'none',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Book a Call
      </a>
    </nav>
  )
}

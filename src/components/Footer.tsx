import { useEffect } from 'react'
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/teetobee', Icon: FaInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@teetobee', Icon: FaYoutube },
  { label: 'Twitter', href: 'https://x.com/titofinance?s=21', Icon: FaXTwitter },
  { label: 'Facebook', href: 'https://www.facebook.com/Titobifinance', Icon: FaFacebook },
]

const navigateLinks = [
  { label: 'About', href: '#story' },
  { label: 'Services', href: '#services' },
  { label: 'The GDR Method', href: '#gdr' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Results', href: '#who' },
]

const connectLinks: { label: string; href: string; external?: boolean }[] = [
  { label: 'Book a Call', href: 'https://wa.me/2348184750870', external: true },
  { label: 'Stock 101', href: '/stock-101' },
  { label: 'Retirement', href: '/retirement' },
  { label: 'Instagram', href: 'https://www.instagram.com/teetobee', external: true },
  { label: 'YouTube', href: 'https://www.youtube.com/@teetobee', external: true },
]

const colTitle: React.CSSProperties = {
  fontFamily: 'Cormorant Garamond, serif',
  fontStyle: 'italic',
  fontSize: '20px',
  color: '#9CA3AF',
  marginBottom: '16px',
}

const navLink: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: '#111827',
  textDecoration: 'none',
  marginBottom: '12px',
  transition: 'color 0.2s ease',
  width: 'fit-content',
}

export default function Footer() {
  useEffect(() => {
    const fitWatermark = () => {
      const svg = document.getElementById('tfWatermarkSvg')
      const text = document.getElementById('tfWatermarkText')
      if (!svg || !text) return
      try {
        const bbox = (text as unknown as SVGTextElement).getBBox()
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      } catch {
        /* getBBox can throw if the node isn't rendered yet */
      }
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(fitWatermark)
    } else {
      window.addEventListener('load', fitWatermark)
    }
    window.addEventListener('resize', fitWatermark)
    return () => window.removeEventListener('resize', fitWatermark)
  }, [])

  return (
    <footer style={{ background: '#0D0D0D', padding: '5rem 1.5rem 3rem' }}>
      <div
        className="tf-footer-grid"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '16px',
        }}
      >
        {/* ─── LEFT CARD ─── */}
        <div
          className="tf-footer-left"
          style={{
            background: '#1A3A16',
            borderRadius: '24px',
            padding: '32px',
            minHeight: '360px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 40px rgba(26,58,22,0.3)',
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: 0.18,
              pointerEvents: 'none',
            }}
          >
            <source src="/videos/stock101-hero.mp4" type="video/mp4" />
          </video>

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <img src="/tf-icon-white.png" alt="Tito Finance" style={{ height: 32, width: 'auto' }} draggable={false} />
          </div>

          {/* Tagline */}
          <p
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 'auto',
              marginBottom: '28px',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '26px',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.4,
            }}
          >
            Building Wealth.
            <br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Building Lives.</span>
          </p>

          {/* Bottom row */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>
              Stay connected →
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <s.Icon size={14} color="white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT CARD ─── */}
        <div
          className="tf-footer-right"
          style={{
            background: '#F8F5EE',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            overflow: 'visible',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Floating badge */}
          <div
            className="tf-footer-badge"
            style={{ position: 'absolute', top: '-32px', right: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '20px',
                transform: 'rotate(-8deg)',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A07820 100%)',
                boxShadow:
                  '8px 14px 28px rgba(201,168,76,0.35), inset 3px 3px 8px rgba(255,255,255,0.25), inset -3px -3px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.04em',
                  transform: 'rotate(8deg)',
                }}
              >
                TF
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '6px',
                transform: 'rotate(-3deg)',
                marginTop: '8px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                color: '#9CA3AF',
              }}
            >
              wealth starts here
            </div>
          </div>

          {/* Nav columns */}
          <div className="tf-footer-nav-cols" style={{ display: 'flex', gap: '64px', paddingTop: '8px' }}>
            <div>
              <p style={colTitle}>Navigate</p>
              {navigateLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  style={navLink}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div>
              <p style={colTitle}>Connect</p>
              {connectLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={navLink}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div
            className="tf-footer-bottom"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}
          >
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
                © 2026 Tito Finance. All rights reserved.
              </p>
              <p
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  color: '#C9A84C',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Built by Samphics Digital
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
                Money never sleeps.
                <br />
                <strong style={{ fontSize: '16px', color: '#111827', fontWeight: 700, display: 'block' }}>
                  Stay ahead with Tito.
                </strong>
              </p>

              <div
                className="tf-footer-subscribe"
                style={{
                  display: 'flex',
                  width: '300px',
                  background: 'white',
                  border: '1px solid rgba(26,58,22,0.12)',
                  borderRadius: '12px',
                  padding: '5px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('.tf-footer-subscribe input') as HTMLInputElement
                    const email = input?.value?.trim()
                    if (email) {
                      window.open(
                        `https://wa.me/2348184750870?text=Hi%20Tito%2C%20I%27d%20like%20to%20stay%20updated.%20My%20email%3A%20${encodeURIComponent(email)}`,
                        '_blank'
                      )
                    } else {
                      window.open('https://wa.me/2348184750870', '_blank')
                    }
                  }}
                  style={{
                    padding: '11px 20px',
                    background: '#1A3A16',
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(26,58,22,0.3)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2D5A27'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1A3A16'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Stay Updated →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── WATERMARK ─── */}
      <div
        aria-hidden="true"
        style={{
          maxWidth: '1100px',
          margin: '-50px auto 0',
          pointerEvents: 'none',
          userSelect: 'none',
          position: 'relative',
          zIndex: 0,
          lineHeight: 0,
        }}
      >
        <svg
          id="tfWatermarkSvg"
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <text
            id="tfWatermarkText"
            x="500"
            y="240"
            textAnchor="middle"
            fontSize="320"
            fontFamily="Cormorant Garamond, serif"
            fontWeight="700"
            letterSpacing="-0.03em"
            fill="rgba(26,58,22,0.05)"
          >
            Tito Finance
          </text>
        </svg>
      </div>
    </footer>
  )
}

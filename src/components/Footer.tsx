import { useState } from 'react'

// Kit (ConvertKit) form — numeric ID extracted from the tito-finance.kit.com
// embed (uid 07bef1d1ba)
const KIT_FORM_ID = '9676481'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const data = new FormData()
      data.append('email_address', email)
      const res = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(`Kit responded ${res.status}`)
      // Kit returns 200 with an HTML page for unknown form IDs — only a JSON
      // body with status "success" means the subscription was actually created
      const json = await res.json()
      if (json.status !== 'success') throw new Error('Kit rejected the subscription')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer style={{ background: '#0D0D0D', padding: '3rem 1.5rem' }}>
      {/* Newsletter strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 0 3rem' }}>
        <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 500,
              color: 'white',
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem'
            }}>
              Stay ahead of your money.
            </p>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5
            }}>
              Monthly insights, strategies, and updates from Titobi.
            </p>
          </div>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            {status === 'success' ? (
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
                color: '#C9A84C',
                lineHeight: 1.5
              }}>
                Almost there — check your inbox to confirm your subscription.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '9999px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.875rem',
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                    minWidth: 0
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(45,90,39,0.6)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 rounded-full shrink-0 transition-colors duration-200"
                  style={{
                    background: '#2D5A27',
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    paddingLeft: '1.25rem',
                    paddingRight: '0.375rem',
                    paddingTop: '0.45rem',
                    paddingBottom: '0.45rem',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#4A8C42')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                  <span style={{
                    background: 'white',
                    borderRadius: '9999px',
                    padding: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>
              </form>
            )}
            {status === 'error' && (
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(255,140,120,0.9)',
                marginTop: '0.5rem'
              }}>
                Something went wrong — please try again in a moment.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[88rem] mx-auto">
        <div className="flex justify-between items-center flex-wrap gap-6 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <img
              src="/tf-icon-green.png"
              alt="Tito Finance"
              style={{ height: '30px', width: 'auto', opacity: 0.75 }}
              draggable={false}
            />
          </div>
          <div className="flex gap-8 flex-wrap">
            {[
              { label: 'About', href: '#story' },
              { label: 'Services', href: '#services' },
              { label: 'Approach', href: '#gdr' },
              { label: 'Book a Call', href: 'https://wa.me/2348184750870', external: true },
            ].map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4 mt-8">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            © 2025 Tito Finance. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {[
              {
                href: 'https://www.instagram.com/teetobee',
                label: 'Instagram',
                path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'
              },
              {
                href: 'https://www.youtube.com/@teetobee',
                label: 'YouTube',
                path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
              },
              {
                href: 'https://www.tiktok.com/@titofinance',
                label: 'TikTok',
                path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
              },
              {
                href: 'https://x.com/titofinance?s=21',
                label: 'X',
                path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
              },
              {
                href: 'https://www.facebook.com/Titobifinance',
                label: 'Facebook',
                path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                  e.currentTarget.style.color = '#C9A84C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>
            Building Wealth. Building Lives.
          </p>
        </div>
      </div>
    </footer>
  )
}

import { ArrowRight } from 'lucide-react'
import { TITO_PERSONAL_WHATSAPP } from '@/lib/forms'

export default function HeroSection() {
  // No h-screen wrapper: the card sets its own height, and a 100vh box around
  // a (100vh - 88px) card left a dead strip of ivory under the hero.
  return (
    <div className="overflow-hidden">
      <div className="px-6 pt-5 pb-6">
        <div
          // svh where supported: on phones 100vh is the viewport with the URL
          // bar hidden, so the card's foot (and now its copy) sat under the bar.
          className="relative w-full rounded-2xl overflow-hidden h-[calc(100vh-88px)] supports-[height:100svh]:h-[calc(100svh-88px)]"
        >
          {/* Background image */}
          <picture>
            <source
              srcSet="/images/titobi-hero-new-xs.webp 640w, /images/titobi-hero-new-sm.webp 1024w, /images/titobi-hero-new-md.webp 1920w, /images/titobi-hero-new.webp 2560w"
              sizes="100vw"
              type="image/webp"
            />
            <img
              src="/images/titobi-hero-new.jpeg"
              alt="Titobi Oreolorun"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center 20%'
              }}
              fetchPriority="high"
              loading="eager"
              draggable={false}
            />
          </picture>

          {/* Gradient overlay — dark studio bg means lighter overlay needed */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 100%)'
            }}
          />
          {/* Below md the copy runs full width along the foot of the card,
              where the diagonal overlay has thinned out on the right */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 75%)' }}
          />

          {/* Content */}
          {/* Below md the copy sits at the foot of the card, over the dark
              shirt, and leaves his face clear at the top. Top-aligned, it left
              an empty band between the subtext and the bottom-pinned CTA. */}
          <div className="relative z-10 flex flex-col justify-end md:justify-start h-full p-8 pb-10 md:p-14 md:pt-32">

            {/* Eyebrow */}
            <p style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: '1.75rem'
            }}>
              Personal Finance · Investment Strategy · Wealth Building
            </p>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-[clamp(3.2rem,6vw,7rem)]" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'white',
              maxWidth: '700px',
              marginBottom: '1.75rem'
            }}>
              Your Money Should<br />Work Harder<br />Than You Do.
            </h1>

            {/* Subtext */}
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.68)',
              maxWidth: '460px',
              lineHeight: 1.65,
              marginBottom: '2.5rem'
            }}>
              From a living room floor in Nigeria to an MBA from WashU and 15 countries — Titobi Oreolorun exists to make sure your financial story ends differently.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={TITO_PERSONAL_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-3 rounded-full transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                style={{
                  background: '#2D5A27',
                  color: 'white',
                  fontFamily: 'DM Sans, sans-serif',
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
                Book a Call
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

              <a href="#story" className="flex items-center gap-3 cursor-pointer"
                style={{ textDecoration: 'none' }}>

                <span style={{
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}>
                  Watch My Story
                </span>

                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#C9A84C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ArrowRight size={18} color="#1A3A16" strokeWidth={2} />
                </div>
              </a>
            </div>

          </div>

          {/* Scroll indicator — hidden on mobile where it collides with the bottom-pinned CTA */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1">
            <div style={{ width: '1px', height: '2.5rem', background: 'rgba(255,255,255,0.25)' }} />
            <div className="scroll-dot" style={{ width: '4px', height: '4px', borderRadius: '9999px', background: '#C9A84C' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

import { GraduationCap, Landmark } from 'lucide-react'

export default function StorySection() {
  return (
    <section id="story" style={{ background: '#F8F5EE', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Left */}
        <div style={{ paddingRight: 'clamp(0rem, 4vw, 4rem)' }}>
          <span data-reveal style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '1.25rem'
          }}>
            The Origin
          </span>

          <blockquote data-reveal style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#1A3A16',
            lineHeight: 1.2,
            marginBottom: '1.75rem'
          }}>
            "My father spent his entire life solving a problem that was quietly plaguing him at home."
          </blockquote>

          <div data-line style={{
            width: '3rem',
            height: '2px',
            background: '#C9A84C',
            marginBottom: '1.75rem'
          }} />

          <p data-reveal style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1rem',
            color: '#6B6B6B',
            lineHeight: 1.75,
            maxWidth: '440px',
            marginBottom: '2rem'
          }}>
            My father was a daily contribution collector. I grew up counting people's money on our living room floor — watching how desperately people wanted to save, but didn't know how to multiply it.
            <br /><br />
            When he retired, his pension was painfully small. That broke my heart. It sparked my obsession that led me to Zenith Bank, GTBank, and eventually a $300,000 MBA from Washington University in St. Louis.
          </p>

          <div data-reveal className="flex flex-wrap gap-3">
            {[
              { Icon: Landmark, label: 'Zenith Bank · GTBank Veteran' },
              { Icon: GraduationCap, label: 'WashU MBA · Olin Business School' },
            ].map(({ Icon, label }) => (
              <span key={label} style={{
                border: '1px solid rgba(45,90,39,0.2)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                color: '#2D5A27',
                background: 'rgba(45,90,39,0.06)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <Icon size={15} strokeWidth={2} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — video + quote card */}
        <div data-reveal className="flex flex-col gap-6">

          {/* Video embed */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            width: '100%',
            boxShadow: '0 24px 64px rgba(26,58,22,0.15)'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/ncmbprbufDo"
              title="Meet Titobi Oreolorun — Tito Finance"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          </div>

          {/* Quote card below video */}
          <div style={{
            background: '#1A3A16',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Grain texture */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
              opacity: 0.04,
              pointerEvents: 'none'
            }} />
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              color: '#F8F5EE',
              letterSpacing: '-0.02em',
              lineHeight: 1.35,
              marginBottom: '0.75rem',
              position: 'relative',
              zIndex: 1
            }}>
              "I made it my life's mission to ensure no one else would face that same reality."
            </p>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#C9A84C',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              position: 'relative',
              zIndex: 1
            }}>
              — Titobi Oreolorun
            </span>
          </div>

        </div>

      </div>
    </section>
  )
}

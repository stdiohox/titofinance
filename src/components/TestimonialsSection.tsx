const dmCards = [
  {
    time: '5:33 PM',
    message: 'Hello Mr Titobi, Thank you so much for the session yesterday, I am a civil servant and earn minimum wage. I want to start investing for retirement. Please help me, I need to get my finances right.',
    label: 'Civil Servant',
  },
  {
    time: '5:34 PM',
    message: "Hello Mr Tobi, I am a mother of two and I work with Lagos state government. I want to start saving and investing for my two children and also want to start investing for retirement. I don't know what to do pls help a sister. Thank you for all you do.",
    label: 'Lagos State Government Worker · Mother of 2',
  },
  {
    time: '5:37 PM',
    message: "Mr Tobi thank you for the stock 101 session, the fact that you make that power packed session free is such a blessing. I just moved to the US and I don't even know how to invest, my husband and I are really confused where to invest and how to. We have heard a lot of Nigerian and American stocks pls help us.",
    label: 'Recently Relocated to the US',
  },
]

export default function TestimonialsSection() {
  return (
    <section style={{ background: '#1A3A16', padding: 'clamp(64px, 8vw, 96px) clamp(16px, 3vw, 24px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <p data-reveal className="tracking-widest" style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: '#C9A84C',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          What People Are Saying
        </p>

        <h2 data-reveal style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(36px, 4vw, 48px)',
          fontWeight: 500,
          color: 'white',
          marginBottom: '16px',
          lineHeight: 1.1
        }}>
          Real People. Real Results.
        </h2>

        <p data-reveal style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '16px',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '64px'
        }}>
          These aren't ads. They're the messages Tito wakes up to.
        </p>

        {/* WhatsApp DM cards */}
        <div data-cards className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dmCards.map((card) => (
            <div
              key={card.time}
              data-card
              style={{
                background: '#111',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#25D366', flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                  WhatsApp Message
                </span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
                  {card.time}
                </span>
              </div>

              {/* Message */}
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'white', lineHeight: 1.7, flex: 1 }}>
                {card.message}
              </p>

              {/* Bottom label */}
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Video testimonials */}
        <p data-reveal style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: '#C9A84C',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginTop: '80px',
          marginBottom: '24px'
        }}>
          Video Testimonials
        </p>

        <div
          className="testimonial-video-row flex gap-4"
          style={{ overflowX: 'auto', paddingBottom: '16px' }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                width: '280px',
                flexShrink: 0,
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0D0D0D',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <video
                src={`/videos/testimonial-${n}.mp4`}
                controls
                playsInline
                preload="metadata"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

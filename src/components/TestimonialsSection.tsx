import { useState, useEffect } from 'react'

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

const testimonials = [
  { src: '/videos/testimonial-1.mp4' },
  { src: '/videos/testimonial-2.mp4' },
  { src: '/videos/testimonial-3.mp4' },
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const len = testimonials.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const videoStyle = (index: number): React.CSSProperties => {
    const offset = isMobile ? 45 : 80
    const scaleBack = isMobile ? 0.78 : 0.85
    const liftUp = isMobile ? 30 : 60

    const base: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      borderRadius: '20px',
      border: '1px solid rgba(45,90,39,0.12)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      cursor: 'pointer',
    }
    if (index === activeIndex) {
      return { ...base, transform: 'translateX(0) translateY(0) scale(1) rotateY(0deg)', zIndex: 3, opacity: 1 }
    }
    if (index === (activeIndex - 1 + len) % len) {
      return { ...base, transform: `translateX(-${offset}px) translateY(-${liftUp}px) scale(${scaleBack}) rotateY(15deg)`, zIndex: 2, opacity: 1 }
    }
    if (index === (activeIndex + 1) % len) {
      return { ...base, transform: `translateX(${offset}px) translateY(-${liftUp}px) scale(${scaleBack}) rotateY(-15deg)`, zIndex: 2, opacity: 1 }
    }
    return { ...base, transform: 'scale(0.8)', zIndex: 1, opacity: 0 }
  }

  return (
    <section style={{
      background: '#EDE8DC',
      padding: 'clamp(64px, 8vw, 96px) clamp(16px, 3vw, 24px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Faded TF logo watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        backgroundImage: 'url(/tf-icon-black.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Gold top border line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
        zIndex: 0
      }} />

      {/* Gold bottom border line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(45,90,39,0.2), transparent)',
          marginBottom: '80px'
        }} />

        <p data-reveal style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.15em',
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
          color: '#1A3A16',
          marginBottom: '12px',
          lineHeight: 1.1
        }}>
          Real People. Real Results.
        </h2>

        <p data-reveal style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '16px',
          color: 'rgba(26,58,22,0.6)',
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
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(45,90,39,0.1)',
                boxShadow: '0 4px 32px rgba(45,90,39,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Message */}
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#2A2A2A', lineHeight: 1.7, flex: 1 }}>
                {card.message}
              </p>

              {/* Bottom label */}
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#2D5A27', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Video carousel — full width, centered */}
        <div className="px-4 md:px-0">
        <div
          className="testimonial-video-container relative w-full mx-auto"
          style={{ perspective: '1000px', maxWidth: '700px', marginTop: '80px' }}
        >
          {testimonials.map((t, index) => (
            <video
              key={t.src}
              src={t.src}
              poster="/images/video-poster.svg"
              className="testimonial-image"
              style={videoStyle(index)}
              playsInline
              controls
              preload="metadata"
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        </div>

      </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import '../components/landing/landing.css'
import LandingNav from '../components/landing/LandingNav'
import LandingForm from '../components/landing/LandingForm'
import RetirementShaderCards from '@/components/ui/RetirementShaderCards'
import PullText from '../components/landing/PullText'
import { useReveal } from '../components/landing/useReveal'

const IVORY = '#F5F0E8'
const INK = '#0D0B08'
const FOREST = '#1A3A16'
const GOLD = '#C9A84C'
const CREAM = '#EDE8DC'

const eyebrow: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: GOLD,
  marginBottom: '1rem',
}

const sectionPad = 'clamp(5rem, 9vw, 7.5rem) clamp(1.5rem, 5vw, 4rem)'
const maxW = '1200px'

const PlusIcon = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={20}
    height={20}
    strokeWidth="1"
    stroke="currentColor"
    style={{ color: 'rgba(26,58,22,0.25)', ...style }}
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

const BentoCard = ({
  title,
  description,
  icon,
  dark = false,
  style = {},
}: {
  title: string
  description: string
  icon?: React.ReactNode
  dark?: boolean
  style?: React.CSSProperties
}) => (
  <div
    style={{
      position: 'relative',
      border: dark ? '1px dashed rgba(201,168,76,0.3)' : '1px dashed rgba(26,58,22,0.2)',
      borderRadius: '16px',
      padding: '28px',
      background: dark ? '#1A3A16' : '#FFFFFF',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = dark ? '0 8px 32px rgba(26,58,22,0.2)' : '0 8px 32px rgba(0,0,0,0.06)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
  >
    {/* Corner plus icons */}
    <PlusIcon style={{ position: 'absolute', top: -10, left: -10 }} />
    <PlusIcon style={{ position: 'absolute', top: -10, right: -10 }} />
    <PlusIcon style={{ position: 'absolute', bottom: -10, left: -10 }} />
    <PlusIcon style={{ position: 'absolute', bottom: -10, right: -10 }} />

    {/* Content */}
    <div style={{ position: 'relative', zIndex: 1 }}>
      {icon && <div style={{ marginBottom: '16px' }}>{icon}</div>}
      <h3
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '20px',
          fontWeight: 500,
          color: dark ? '#FFFFFF' : '#0D0B08',
          lineHeight: 1.3,
          marginBottom: '10px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(13,11,8,0.6)',
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </div>
  </div>
)

// Simple looping video background for the hero.
const BoomerangVideoBg = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, transform: 'scale(1.05)', transformOrigin: 'top', overflow: 'hidden' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      >
        <source src="/videos/retirement-hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(26,58,22,0.88) 0%, rgba(26,58,22,0.65) 50%, rgba(26,58,22,0.80) 100%)',
        }}
      />

      {/* Film grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  )
}

const FaqItem = ({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) => {
  const [open, setOpen] = useState(false)
  const panelId = `faq-panel-${index}`

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(26,58,22,0.12)',
        padding: '20px 0',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen((v) => !v)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-controls={panelId}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <h3 style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          color: '#0D0B08',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {question}
        </h3>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            flexShrink: 0,
            color: '#C9A84C',
          }}
        >
          <path
            d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        id={panelId}
        style={{
          overflow: 'hidden',
          maxHeight: open ? '300px' : '0',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'all 0.4s ease',
          paddingTop: open ? '12px' : '0',
        }}
      >
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: 'rgba(13,11,8,0.6)',
          lineHeight: 1.75,
          margin: 0,
        }}>
          {answer}
        </p>
      </div>
    </div>
  )
}

export default function RetirementPage() {
  useReveal()

  const shouldReduce = useReducedMotion()
  const [shown3x, setShown3x] = useState(false)
  const card1Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown3x(true)
      },
      { threshold: 0.5 }
    )
    if (card1Ref.current) observer.observe(card1Ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: IVORY, color: INK, overflowX: 'hidden' }}>
      <LandingNav />

      {/* ============ SECTION 1 — HERO ============ */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>

        {/* Boomerang video background */}
        <BoomerangVideoBg />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 'clamp(100px, 15vh, 160px)',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {/* Eyebrow */}
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '24px' }}>
            Free Strategy Session · Retirement Planning
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 300,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              maxWidth: '800px',
            }}
          >
            Retirement Is Coming Whether You're Ready
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}> or Not.</em>
          </h1>

          {/* Subline */}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '40px' }}>
            Most Nigerians will reach retirement age with nothing but a pension that barely covers the basics. This free session changes that.
          </p>

          {/* CTA */}
          <a
            href="#register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: '#C9A84C',
              color: '#1A3A16',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '999px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
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
            Book My Free Strategy Session →
          </a>

          {/* Trust bar */}
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '20px' }}>
            FREE · 1-ON-1 WITH TITO · NIGERIANS AT HOME & ABROAD
          </p>
        </div>

      </section>

      {/* ============ SECTION 2 — REALITY CHECK ============ */}
      <section id="section-2" className="retirement-section-pad" style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(110px, 16vw, 160px)" color="rgba(26,58,22,0.04)" position={{ top: '2rem', right: '2rem' }}>
          TRUTH
        </PullText>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div data-reveal>
            <p style={eyebrow}>The Retirement Reality</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 400,
                color: INK,
                marginBottom: '1rem',
                maxWidth: '20ch',
              }}
            >
              The Uncomfortable Truth About Retirement in Nigeria
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: '#4A4A4A', lineHeight: 1.8, maxWidth: '42rem', marginBottom: '4rem' }}>
              Government pensions weren't designed to fund your lifestyle. Inflation will eat your savings faster than
              they grow. And the longer you wait, the harder it becomes to catch up.
            </p>
          </div>

          <div className="reality-grid" data-reveal>
            {/* Card 1 — larger */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: FOREST, borderRadius: '16px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
            >
              {/* Pulse ring */}
              <motion.div
                style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)' }}
                animate={shouldReduce ? undefined : { boxShadow: ['0 0 0 0 rgba(201,168,76,0.3)', '0 0 0 20px rgba(201,168,76,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <div ref={card1Ref} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '80px', fontWeight: 300, color: GOLD, lineHeight: 0.9 }}>
                <motion.span
                  style={{ display: 'inline-block' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={shown3x ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                >
                  3×
                </motion.span>
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 500, color: 'white', marginTop: '0.5rem' }}>
                More you need to invest
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Every 10 years you delay retirement investing, you need to invest roughly 3× as much to reach the same outcome.
              </div>
            </motion.div>
            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'white', border: '1px solid rgba(26,58,22,0.1)', borderRadius: '16px', padding: '2rem' }}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, color: GOLD, lineHeight: 0.9 }}>15–20%</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 500, color: INK, marginTop: '0.5rem' }}>
                Annual inflation in Nigeria
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B6B6B', marginTop: '0.5rem', lineHeight: 1.6 }}>
                A savings account at 5% interest is losing you money in real terms every year.
              </div>

              {/* Animated inflation-trend bars */}
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-end', gap: '6px', height: '48px' }}>
                {[30, 55, 45, 70, 60, 85, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: `${h}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5, type: 'spring' }}
                    style={{ flex: 1, borderRadius: '3px', background: i === 6 ? '#C9A84C' : 'rgba(201,168,76,0.2)' }}
                  />
                ))}
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(13,11,8,0.35)', textTransform: 'uppercase', marginTop: '8px' }}>
                Inflation trend
              </p>
            </motion.div>
            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: CREAM, borderRadius: '16px', padding: '2rem' }}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, color: FOREST, lineHeight: 0.9 }}>0</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 500, color: INK, marginTop: '0.5rem' }}>
                Diaspora Nigerians using their Roth IRA
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B6B6B', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Most Nigerians abroad have access to tax-advantaged retirement accounts — and never use them.
              </div>

              {/* Rotating globe */}
              <motion.svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ marginTop: '16px', opacity: 0.15 }}
                animate={shouldReduce ? undefined : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="40" cy="40" r="36" stroke="#1A3A16" strokeWidth="1.5" />
                <ellipse cx="40" cy="40" rx="36" ry="14" stroke="#1A3A16" strokeWidth="1.5" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="#1A3A16" strokeWidth="1.5" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="#1A3A16" strokeWidth="1.5" />
              </motion.svg>
            </motion.div>
          </div>

          <p
            data-reveal
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '28px',
              fontStyle: 'italic',
              color: FOREST,
              textAlign: 'center',
              marginTop: '4rem',
              maxWidth: '32ch',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.4,
            }}
          >
            The best time to start was yesterday. The second best time is this session.
          </p>
        </div>
      </section>

      {/* ============ SECTION 3 — WHAT YOU'LL LEARN ============ */}
      <section
        id="modules"
        className="retirement-section-pad"
        style={{
          background: '#F8F5EE',
          padding: sectionPad,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PullText size="clamp(180px, 30vw, 300px)" color="rgba(255,255,255,0.03)" position={{ bottom: '-2rem', right: '1rem' }}>
            6
          </PullText>
          <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div data-reveal>
              <p style={eyebrow}>Session Breakdown</p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 400,
                  color: '#0D0B08',
                  marginBottom: '1rem',
                }}
              >
                What Tito Will Walk You Through
              </h2>
            </div>
            <RetirementShaderCards />
          </div>
        </div>
      </section>

      {/* ============ SECTION 4 — OUTCOMES ============ */}
      <section className="retirement-section-pad" style={{ background: CREAM, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div data-reveal>
            <p style={eyebrow}>What You Leave With</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 400,
                color: INK,
                maxWidth: '14ch',
              }}
            >
              After This Session, You Will Have:
            </h2>
          </div>

          <div
            data-reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginTop: '48px',
            }}
            className="retirement-bento-grid"
          >
            <BentoCard
              title="Clarity on retirement planning"
              description="A clear understanding of how retirement planning actually works — in plain language, not financial jargon."
            />
            <BentoCard
              title="Knowledge of retirement accounts"
              description="Roth IRA, Traditional IRA, 401(k) — which accounts are available to you and how to use them."
            />
            <BentoCard
              title="A portfolio framework"
              description="A practical framework for building your own retirement portfolio that matches your timeline and risk tolerance."
              dark
            />
            <BentoCard
              title="Confidence in your next steps"
              description="Confidence in the specific next steps for your situation — not generic advice, but a plan built for you."
              dark
            />
            <BentoCard
              title="Direct access to Tito"
              description="Direct access to Tito for follow-up questions after the session. You're not on your own."
              style={{ gridColumn: 'span 2' }}
              icon={
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(26,58,22,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>✓</span>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ============ SECTION 5 — WHO IT'S FOR ============ */}
      <section id="who" className="retirement-section-pad" style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div data-reveal>
            <p style={eyebrow}>Who This Is For</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 400,
                color: INK,
                maxWidth: '14ch',
              }}
            >
              This Session Is Built For You If...
            </h2>
          </div>

          <div
            data-reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginTop: '48px',
            }}
            className="retirement-bento-grid"
          >
            <BentoCard
              title="Salary earners"
              description="You earn a salary and want to retire with dignity — not dependency on family or the government."
            />
            <BentoCard
              title="Self-employed professionals"
              description="No employer pension. You know you need to act — you just need a clear plan."
              dark
            />
            <BentoCard
              title="Business owners"
              description="You want assets outside your business. Smart wealth means not having all your eggs in one basket."
            />
            <BentoCard
              title="Nigerians in the diaspora"
              description="US, UK, Canada — you haven't touched your Roth IRA or 401(k). This session will change that."
              dark
            />
            <BentoCard
              title="Nigerians at home"
              description="You want to build wealth completely outside the government pension system. There's a way."
            />
            <BentoCard
              title="Ages 25 to 55"
              description="It's never too early and never too late. A plan built for where you are right now."
              dark
            />
          </div>
        </div>
      </section>

      {/* ============ SECTION 6 — ABOUT TITO ============ */}
      <section id="about" className="retirement-section-pad" style={{ background: IVORY, padding: sectionPad }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          {/* Desktop layout — overlapping card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
            className="about-desktop-layout"
          >
            {/* Photo — square, rounded */}
            <div
              style={{
                width: '440px',
                height: '500px',
                borderRadius: '24px',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#EDE8DC',
              }}
              className="about-photo-wrapper"
            >
              <img
                src="/images/titobi-services.jpg"
                alt="Titobi Oreolorun"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  display: 'block',
                }}
              />
            </div>

            {/* Overlapping card — slides over the photo */}
            <motion.div
              className="about-card-overlay"
              initial={shouldReduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
                padding: '48px',
                marginLeft: '-80px',
                zIndex: 10,
                flex: 1,
                position: 'relative',
              }}
            >
              {/* Eyebrow */}
              <p style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                Your Strategist
              </p>

              {/* Name */}
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 400,
                color: '#0D0B08',
                lineHeight: 1.2,
                marginBottom: '8px',
              }}>
                Titobi Oreolorun
              </h2>

              {/* Title */}
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#6B6B6B',
                marginBottom: '24px',
              }}>
                "Teetobee" — Personal Finance Coach & Financial Instructor
              </p>

              {/* Bio paragraphs */}
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                color: 'rgba(13,11,8,0.7)',
                lineHeight: 1.75,
                marginBottom: '16px',
              }}>
                Before Titobi became a financial educator, he spent years inside
                GTBank and Zenith Bank — watching how money actually moves and
                where most people's retirement plans fall apart.
              </p>

              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                color: 'rgba(13,11,8,0.7)',
                lineHeight: 1.75,
                marginBottom: '32px',
              }}>
                He went on to earn an MBA from WashU Olin, study financial systems
                across 15+ countries, and build an audience of 100,000+ people.
                He built Tito's GDR Strategy — Growth, Dividend, Retirement — as
                a complete wealth system that works whether you're earning in
                naira or dollars.
              </p>

              {/* Stats row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(26,58,22,0.08)',
                marginBottom: '32px',
              }}>
                {[
                  { value: '15+', label: 'Countries' },
                  { value: '2', label: 'Major Banks' },
                  { value: '$300K+', label: 'Education' },
                  { value: '100K+', label: 'Followers' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '28px',
                      fontWeight: 500,
                      color: '#1A3A16',
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      color: '#9A9A9A',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  {
                    label: 'Instagram',
                    href: 'https://www.instagram.com/teetobee',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'YouTube',
                    href: 'https://www.youtube.com/@teetobee',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'X',
                    href: 'https://x.com/titofinance?s=21',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'WhatsApp',
                    href: 'https://wa.me/2348184750870',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: '#1A3A16',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#C9A84C'
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1A3A16'
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mobile layout — stacked */}
          <div className="about-mobile-layout" style={{ display: 'none' }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}>
              <img
                src="/images/titobi-services.jpg"
                alt="Titobi Oreolorun"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>Your Strategist</p>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#0D0B08',
                marginBottom: '8px',
              }}>Titobi Oreolorun</h2>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#6B6B6B',
                marginBottom: '20px',
              }}>"Teetobee" — Personal Finance Coach</p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: 'rgba(13,11,8,0.7)',
                lineHeight: 1.75,
                marginBottom: '16px',
                textAlign: 'left',
              }}>
                Before Titobi became a financial educator, he spent years inside
                GTBank and Zenith Bank. He holds an MBA from WashU Olin, has
                visited 15+ countries, and has built an audience of 100,000+
                people who trust him to make finance simple and actionable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 7 — REGISTER FORM ============ */}
      <section id="register" className="retirement-section-pad" style={{ background: FOREST, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(120px, 20vw, 200px)" color="rgba(255,255,255,0.03)" position={{ top: '2rem', right: '1.5rem' }}>
          FREE
        </PullText>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="two-col">
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={eyebrow}>Save Your Spot</p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 400,
                  color: 'white',
                  marginBottom: '1rem',
                  lineHeight: 1.15,
                }}
              >
                Your Retirement Strategy Session Is Free. Your Future Depends on What You Do With It.
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                Fill in your details and Tito's team will reach out to schedule your session.
              </p>

              <div style={{
                marginTop: '40px',
                padding: '24px',
                borderLeft: '2px solid rgba(201,168,76,0.4)',
                background: 'rgba(201,168,76,0.05)',
                borderRadius: '0 12px 12px 0',
              }}>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.5,
                  marginBottom: '8px',
                }}>
                  "The best time to start was yesterday. The second best time is right now."
                </p>
                <p style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: '#C9A84C',
                  textTransform: 'uppercase',
                }}>
                  — Titobi Oreolorun
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingForm
                webhookUrl="https://n8n.srv1759554.hstgr.cloud/webhook/retirement-intake"
                submitLabel="Book My Free Strategy Session →"
                fields={[
                  { name: 'fullName', label: 'Full Name', type: 'text' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                  { name: 'phone', label: 'Phone Number (WhatsApp)', type: 'tel' },
                  { name: 'ageRange', label: 'Age Range', type: 'select', options: ['25–35', '36–45', '46–55', '55+'] },
                  {
                    name: 'location',
                    label: 'Where are you based?',
                    type: 'select',
                    options: ['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Other'],
                  },
                  {
                    name: 'retirementSavings',
                    label: 'Current retirement savings?',
                    type: 'select',
                    options: ['None yet', 'Just started', 'Have some', 'Well invested'],
                  },
                  {
                    name: 'source',
                    label: 'How did you hear about this?',
                    type: 'select',
                    options: ['Instagram', 'WhatsApp', 'YouTube', 'TikTok', 'Friend', 'Other'],
                  },
                ]}
              />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '1.5rem' }}>
                Prefer WhatsApp?{' '}
                <a href="https://wa.me/2348184750870" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: 'none' }}>
                  Chat with Tito directly →
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 8 — FAQ ============ */}
      <section className="faq-section-wrapper" style={{ background: IVORY, padding: sectionPad }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div className="faq-section-header" style={{ marginBottom: '64px' }}>
            <p style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>FAQ</p>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 400,
              color: '#0D0B08',
              lineHeight: 1.15,
            }}>Quick Answers</h2>
          </div>

          {/* 2-col layout: image left, accordion right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'start',
            }}
            className="faq-two-col"
          >
            {/* Left — Titobi photo */}
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'sticky',
                top: '100px',
                aspectRatio: '3/4',
              }}
              className="faq-image-col"
            >
              <img
                src="/images/titobi-authority.jpg"
                alt="Titobi Oreolorun"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  display: 'block',
                }}
              />
              {/* Overlay with quote */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px',
                background: 'linear-gradient(to top, rgba(26,58,22,0.92) 0%, transparent 100%)',
              }}>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  color: 'white',
                  lineHeight: 1.5,
                  marginBottom: '8px',
                }}>
                  "No question is too basic. Every expert was once a beginner."
                </p>
                <p style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: '#C9A84C',
                  textTransform: 'uppercase',
                }}>
                  — Titobi Oreolorun
                </p>
              </div>
            </div>

            {/* Right — FAQ accordion */}
            <div className="faq-accordion-col">
              {[
                {
                  q: 'Is this actually free?',
                  a: 'Yes. Tito offers this session free because he believes retirement planning advice should not be locked behind a paywall. No hidden fees, no credit card required.',
                },
                {
                  q: "I'm based in Nigeria — not the diaspora. Is this still relevant?",
                  a: 'Completely. Tito specifically covers retirement strategies for people earning in naira and building wealth outside Western financial systems.',
                },
                {
                  q: "I'm in my 50s. Is it too late?",
                  a: 'No. A session tailored to where you are right now is more valuable than a generic plan. Tito will work with your actual situation, not a template.',
                },
                {
                  q: 'What happens after the session?',
                  a: "You'll have a clear picture of your next steps. If you want to continue working with Tito, he'll tell you what that looks like. There's no pressure.",
                },
                {
                  q: 'I already have a 401(k) or pension. Do I still need this?',
                  a: 'Probably yes. Most people with pension plans are significantly under-invested for the retirement lifestyle they want. Tito will help you see the gap clearly.',
                },
              ].map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.q}
                  answer={item.a}
                  index={index}
                />
              ))}

              {/* CTA below FAQ */}
              <div style={{ marginTop: '40px' }}>
                <a
                  href="#register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    background: '#1A3A16',
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '999px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
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
                  Still have questions? Book a free session →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 9 — FINAL CTA ============ */}
      <section style={{ background: FOREST, padding: '8rem clamp(1.5rem, 5vw, 4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }} data-reveal>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            The People Who Are Comfortable in Retirement Started Planning Before It Felt Urgent.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>
            One free session. One honest conversation about where you are and where you need to be.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="#register"
              style={{
                background: GOLD,
                color: FOREST,
                borderRadius: '999px',
                padding: '1rem 2.25rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Book My Free Strategy Session →
            </a>
            <a
              href="https://wa.me/2348184750870"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-underline"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
            >
              Message Tito on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{
        background: '#0D0B08',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '72px 24px 48px',
        }}>
          {/* 4-col grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '48px',
              marginBottom: '64px',
            }}
            className="retirement-footer-grid"
          >
            {/* Col 1 — Brand + newsletter */}
            <div style={{ gridColumn: 'span 1' }} className="retirement-footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/tf-icon-white.png" style={{ height: '28px', width: 'auto' }} alt="Tito Finance" />
                <span style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'white',
                  letterSpacing: '-0.01em',
                }}>
                  Tito Finance
                </span>
              </div>

              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
                marginBottom: '24px',
              }}>
                Building wealth with structure, discipline, and confidence — for Nigerians at home and abroad.
              </p>

              {/* Newsletter input */}
              <p style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Stay ahead
              </p>
              <div style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '10px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: 'white',
                  }}
                  className="retirement-footer-input"
                />
                <button
                  onClick={() => window.open('https://wa.me/2348184750870', '_blank')}
                  aria-label="Subscribe via WhatsApp"
                  style={{
                    padding: '10px 16px',
                    background: '#C9A84C',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#B8972B')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#C9A84C')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A3A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Col 2 + 3 — Navigate & Explore (side by side on mobile) */}
            <div className="retirement-footer-nav-cols">
            {/* Col 2 — Navigate */}
            <div>
              <h3 style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Navigate
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'The Session', href: '#modules' },
                  { label: 'What You Get', href: '#outcomes' },
                  { label: "Who It's For", href: '#who' },
                  { label: 'About Tito', href: '#about' },
                  { label: 'Register', href: '#register' },
                  { label: 'FAQ', href: '#faq' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Col 3 — Other pages */}
            <div>
              <h3 style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Explore
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Tito Finance Home', href: '/' },
                  { label: 'Stock 101', href: '/stock-101' },
                  { label: 'Book a Call', href: 'https://wa.me/2348184750870' },
                  { label: 'Free Resources', href: '/#services' },
                  { label: 'The GDR Method', href: '/#gdr' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
            </div>

            {/* Col 4 — Contact + socials */}
            <div>
              <h3 style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Connect
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <a
                  href="mailto:hello@titofinance.com"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  hello@titofinance.com
                </a>
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/2348184750870"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#25D366',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                    e.currentTarget.style.color = '#C9A84C'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#25D366'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                {[
                  {
                    label: 'Instagram',
                    href: 'https://www.instagram.com/teetobee',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
                  },
                  {
                    label: 'YouTube',
                    href: 'https://www.youtube.com/@teetobee',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
                  },
                  {
                    label: 'TikTok',
                    href: 'https://www.tiktok.com/@titofinance',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.84 1.56V6.81a4.85 4.85 0 01-1.07-.12z" /></svg>,
                  },
                  {
                    label: 'X',
                    href: 'https://x.com/titofinance?s=21',
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                  },
                  {
                    label: 'Facebook',
                    href: 'https://www.facebook.com/Titobifinance',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    aria-label={social.label}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201,168,76,0.15)'
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                      e.currentTarget.style.color = '#C9A84C'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
            className="retirement-footer-bottom"
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Tito Finance. All rights reserved.
            </p>

            <nav style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

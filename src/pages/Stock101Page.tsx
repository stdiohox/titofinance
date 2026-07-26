import '../components/landing/landing.css'
import LandingNav from '../components/landing/LandingNav'
import LandingFaq from '../components/landing/LandingFaq'
import LandingForm from '../components/landing/LandingForm'
import ModuleRows from '../components/landing/ModuleRows'
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

const modules = [
  {
    num: '01',
    title: 'Why Invest at All?',
    body: 'The difference between saving and investing. What inflation quietly does to your money. Why starting now — even small — matters more than starting big later.',
  },
  {
    num: '02',
    title: 'What Is the Stock Market?',
    body: 'What a stock actually is. Why companies sell shares. How exchanges like NYSE, NASDAQ, and Nigeria\'s NGX work — and what brokers and investment apps actually do.',
  },
  {
    num: '03',
    title: 'How People Make Money in Stocks',
    body: 'Capital appreciation. Dividends. The magic of compounding. Why long-term investors consistently outperform traders.',
  },
  {
    num: '04',
    title: 'Types of Investments',
    body: 'Stocks, ETFs, REITs, Bonds, Money Market Funds, Mutual Funds — what each one is and when it makes sense to use it.',
  },
  {
    num: '05',
    title: 'Investment Myths, Debunked',
    body: 'Stocks are gambling. You need millions. Only experts profit. We\'ll dismantle every excuse that\'s kept you on the sidelines.',
  },
  {
    num: '06',
    title: 'What Comes Next',
    body: 'After this session, you\'ll know exactly what to study next and how to build your first real portfolio — with Tito\'s guided learning path.',
  },
]

const faqItems = [
  {
    q: 'Is this really free?',
    a: 'Yes. Stock 101 is Tito\'s way of making financial education accessible to everyone — regardless of where you\'re starting from.',
  },
  {
    q: 'Do I need any experience?',
    a: 'None at all. This session is designed specifically for beginners. If you can use a smartphone, you can attend.',
  },
  {
    q: 'I\'m in the US/UK — is this relevant to me?',
    a: 'Absolutely. Whether you\'re investing in Nigerian stocks, US markets, or both, the fundamentals are the same. Tito covers both landscapes.',
  },
  {
    q: 'What happens after I register?',
    a: 'You\'ll receive a WhatsApp message with the session details, date, and link to join.',
  },
  {
    q: 'I missed a previous session. Can I still join?',
    a: 'Yes — register and you\'ll be added to the next available date.',
  },
]

export default function Stock101Page() {
  useReveal()

  return (
    <div style={{ background: IVORY, color: INK, overflowX: 'hidden' }}>
      <LandingNav theme="dark" />

      {/* ============ SECTION 1 — HERO ============ */}
      <section
        style={{
          background: INK,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '7rem clamp(1.5rem, 5vw, 4rem) 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.3,
          }}
        >
          <source src="/videos/stock101-hero.mp4" type="video/mp4" />
        </video>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(13,11,8,0.92) 0%, rgba(13,11,8,0.72) 50%, rgba(13,11,8,0.88) 100%)',
            zIndex: 1,
          }}
        />

        {/* All hero content — layered above the video */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            width: '100%',
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
        <div
          style={{ maxWidth: maxW, margin: '0 auto', width: '100%' }}
          className="hero-grid"
        >
          <div data-reveal style={{ position: 'relative', zIndex: 2 }}>
            <p style={eyebrow}>Free Online Session · Limited Spots</p>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'white',
                marginBottom: '1.5rem',
                maxWidth: '13ch',
              }}
            >
              The Stock Market Isn't as Complicated as They Made You Think.
            </h1>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '32rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Most people avoid investing because no one ever explained it clearly.
              Stock 101 changes that — in one free session with Titobi Oreolorun.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginTop: '2rem' }}>
              <a
                href="#register"
                style={{
                  background: GOLD,
                  color: INK,
                  borderRadius: '999px',
                  padding: '1rem 2rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Reserve My Free Spot →
              </a>
              <a
                href="https://wa.me/2348184750870"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-underline"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                }}
              >
                Or chat on WhatsApp →
              </a>
            </div>

            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.12em',
                marginTop: '2rem',
              }}
            >
              FREE · ONLINE · OPEN TO ALL LEVELS · NIGERIA & DIASPORA
            </p>
          </div>

          {/* Right col — the oversized 101 IS the hero visual */}
          <div style={{ position: 'relative', minHeight: '200px' }} className="hero-visual">
            <div
              aria-hidden
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: 'clamp(160px, 26vw, 320px)',
                color: 'rgba(201,168,76,0.12)',
                lineHeight: 0.8,
                textAlign: 'right',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              101
            </div>
          </div>
        </div>

          {/* Scroll indicator */}
          <div
            onClick={() => document.getElementById('section-2')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.55,
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              Scroll Down
            </span>
            <div
              style={{
                width: '1px',
                height: '48px',
                background: 'linear-gradient(to bottom, white, transparent)',
                animation: 'scrollLine 1.5s ease-in-out infinite',
              }}
            />
            <span style={{ color: 'white', fontSize: '16px', animation: 'scrollArrow 1.5s ease-in-out infinite' }}>↓</span>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2 — PAIN ============ */}
      <section id="section-2" style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(120px, 20vw, 200px)" color="rgba(26,58,22,0.04)" position={{ top: '2rem', right: '2rem' }}>
          WHY?
        </PullText>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} data-reveal>
          <p style={eyebrow}>Sound Familiar?</p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 400,
              color: INK,
              marginBottom: '2rem',
              lineHeight: 1.15,
            }}
          >
            You Know You Should Be Investing.
            <br />
            You Just Don't Know Where to Start.
          </h2>

          <div className="pain-grid" style={{ marginTop: '3rem', textAlign: 'left' }}>
            {[
              'I hear about stocks every day but I don\'t actually understand how any of it works.',
              'I\'m scared of losing money. What if I make the wrong move?',
              'I don\'t have millions to invest. Is it even worth it for someone like me?',
            ].map((quote) => (
              <div
                key={quote}
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,58,22,0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '80px',
                    color: GOLD,
                    opacity: 0.2,
                    lineHeight: 0.6,
                    height: '46px',
                  }}
                >
                  “
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#2A2A2A', lineHeight: 1.7 }}>
                  {quote}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '24px',
              fontStyle: 'italic',
              color: FOREST,
              marginTop: '3rem',
              maxWidth: '40ch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            If any of those thoughts have crossed your mind — this session was built for you.
          </p>
        </div>
      </section>

      {/* ============ SECTION 3 — MODULES ============ */}
      <section style={{ background: FOREST, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(180px, 30vw, 300px)" color="rgba(255,255,255,0.03)" position={{ bottom: '-2rem', right: '1rem' }}>
          6
        </PullText>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div data-reveal>
            <p style={eyebrow}>What's Covered</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 400,
                color: 'white',
                marginBottom: '1rem',
                maxWidth: '18ch',
              }}
            >
              Six Things You'll Understand After This Session
            </h2>
          </div>
          <ModuleRows modules={modules} />
        </div>
      </section>

      {/* ============ SECTION 4 — LEARNING PATH ============ */}
      <section style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText
          size="clamp(120px, 18vw, 180px)"
          color="rgba(26,58,22,0.04)"
          position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          PATH
        </PullText>
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div data-reveal>
            <p style={eyebrow}>The Roadmap</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 400,
                color: INK,
                marginBottom: '4rem',
              }}
            >
              One Session Becomes a Clear Path Forward
            </h2>
          </div>

          {[
            {
              num: '01',
              active: true,
              hereLabel: 'You Are Here',
              title: 'Stock 101',
              desc: 'I understand how the market works.',
              topics: null,
            },
            {
              num: '02',
              active: false,
              hereLabel: null,
              title: 'Beginner Portfolio',
              desc: 'I know what to invest in and why.',
              topics: 'Building a portfolio · Choosing ETFs · Dividend investing · Growth vs income · Risk management',
            },
            {
              num: '03',
              active: false,
              hereLabel: null,
              title: 'Company Analysis & Fundamentals',
              desc: 'I can pick great companies myself.',
              topics: 'Financial statements · P/E ratios · Cash flow · Valuation · Competitive advantage',
            },
          ].map((step, i, arr) => (
            <div key={step.num} data-reveal style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '1.5rem' }}>
              {/* left: number + connecting line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: step.active ? GOLD : 'transparent',
                    border: step.active ? 'none' : '2px solid rgba(26,58,22,0.3)',
                    color: step.active ? INK : 'rgba(26,58,22,0.5)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  {step.num}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: '1px', flex: 1, minHeight: '2rem', background: 'rgba(26,58,22,0.2)', margin: '0.5rem 0' }} />
                )}
              </div>

              {/* right: content */}
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: step.active ? '1.5rem' : '0.25rem 0 1.5rem',
                  background: step.active ? 'white' : 'transparent',
                  border: step.active ? `2px solid ${GOLD}` : 'none',
                  borderRadius: step.active ? '12px' : '0',
                }}
              >
                {step.hereLabel && (
                  <p
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: GOLD,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {step.hereLabel}
                  </p>
                )}
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 500, color: INK, marginBottom: '0.25rem' }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#6B6B6B' }}>{step.desc}</div>
                {step.topics && (
                  <div
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      color: 'rgba(0,0,0,0.4)',
                      marginTop: '0.75rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {step.topics}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION 5 — WHO IT'S FOR ============ */}
      <section style={{ background: CREAM, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="two-col" data-reveal>
            <div>
              <p style={eyebrow}>Is This For You?</p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 400,
                  color: INK,
                  maxWidth: '12ch',
                }}
              >
                You're in the Right Place If...
              </h2>
            </div>
            <div>
              {[
                'You earn a salary and want your money to do more than sit in a bank account',
                'You\'re self-employed and building income outside your business',
                'You\'re Nigerian in the diaspora and don\'t know how to invest in US or UK markets',
                'You\'ve tried to learn investing before but gave up because it felt too technical',
                'You\'re starting from zero — no portfolio, no broker, no prior knowledge',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: FOREST,
                      flexShrink: 0,
                      marginTop: '0.7rem',
                    }}
                  />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#2A2A2A', lineHeight: 1.7 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            data-reveal
            style={{ background: FOREST, borderRadius: '20px', padding: 'clamp(2rem, 4vw, 2.5rem)', marginTop: '3rem' }}
          >
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontStyle: 'italic', color: 'white', lineHeight: 1.4 }}>
              You don't need to understand everything before you start. You just need one session that finally makes it click.
            </p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: GOLD, marginTop: '1rem', letterSpacing: '0.08em' }}>
              — Titobi Oreolorun
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 6 — ABOUT TITO ============ */}
      <section style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div className="two-col about-col" data-reveal>
            <div
              style={{
                background: CREAM,
                borderRadius: '20px',
                aspectRatio: '3 / 4',
                overflow: 'hidden',
              }}
            >
              <img
                src="/images/titobi-authority.jpg"
                alt="Titobi Oreolorun"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div>
              <p style={eyebrow}>Your Instructor</p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(34px, 4.5vw, 48px)',
                  fontWeight: 400,
                  color: INK,
                  marginBottom: '1.5rem',
                  lineHeight: 1.15,
                }}
              >
                Taught by Someone Who Learned It the Hard Way First.
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8, marginBottom: '1rem' }}>
                Titobi Oreolorun — known as Teetobee — built his financial foundation inside GTBank and Zenith Bank.
                He didn't inherit wealth. He studied money from the inside out.
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8, marginBottom: '2rem' }}>
                He holds an MBA from Washington University's Olin Business School and has visited 15+ countries studying
                how people in different economies build wealth. Today he teaches everyday Nigerians to invest with structure,
                discipline, and confidence.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
                {[
                  { n: '15+', l: 'Countries Visited' },
                  { n: '2', l: 'Major Banks' },
                  { n: '$300K+', l: 'Education Invested' },
                  { n: '100K+', l: 'Followers' },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 500, color: FOREST, lineHeight: 1 }}>
                      {s.n}
                    </div>
                    <div
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        color: '#6B6B6B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginTop: '0.4rem',
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 7 — REGISTER FORM ============ */}
      <section id="register" style={{ background: FOREST, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <PullText size="clamp(120px, 20vw, 200px)" color="rgba(255,255,255,0.03)" position={{ top: '2rem', right: '1.5rem' }}>
          FREE
        </PullText>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="two-col form-col" data-reveal>
            <div>
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
                This Session Is Free. Your Future Isn't Free to Waste.
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                Fill in your details below and we'll send you everything you need to join.
              </p>
            </div>

            <div>
              <LandingForm
                webhookUrl="https://n8n.srv1759554.hstgr.cloud/webhook/stock101-intake"
                submitLabel="Reserve My Free Spot →"
                fields={[
                  { name: 'fullName', label: 'Full Name', type: 'text' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                  { name: 'phone', label: 'Phone Number / WhatsApp', type: 'tel' },
                  {
                    name: 'location',
                    label: 'Where are you based?',
                    type: 'select',
                    options: ['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Other'],
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
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 8 — FAQ ============ */}
      <section style={{ background: IVORY, padding: sectionPad }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }} data-reveal>
          <p style={eyebrow}>Questions</p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 400,
              color: INK,
              marginBottom: '2.5rem',
            }}
          >
            Before You Register
          </h2>
          <LandingFaq items={faqItems} />
        </div>
      </section>

      {/* ============ SECTION 9 — FINAL CTA ============ */}
      <section style={{ background: INK, padding: '8rem clamp(1.5rem, 5vw, 4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }} data-reveal>
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
            The Market Has Been Running Without You. Start Catching Up — For Free.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>
            One session. One hour. Everything changes about how you see money.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="#register"
              style={{
                background: GOLD,
                color: INK,
                borderRadius: '999px',
                padding: '1rem 2.25rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Reserve My Free Spot →
            </a>
            <a
              href="https://wa.me/2348184750870"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-underline"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
            >
              Still have questions? Chat with Tito →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

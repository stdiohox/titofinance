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
    title: 'The Retirement Reality',
    body: 'Why retirement planning cannot wait. The real cost of delay. How inflation destroys retirement income — and how to protect against it.',
  },
  {
    num: '02',
    title: 'Retirement Investment Accounts',
    body: 'Roth IRA. Traditional IRA. 401(k). Employer-sponsored plans. Matching contributions. Which account suits your situation — whether you\'re in Nigeria or abroad.',
  },
  {
    num: '03',
    title: 'Building Your Retirement Portfolio',
    body: 'Diversification. ETFs. Dividend-paying investments. REITs. Bonds and fixed-income assets. Growth versus income — how to balance both over time.',
  },
  {
    num: '04',
    title: 'Retirement Income Strategy',
    body: 'Creating passive income that replaces your salary. Dividend income. Withdrawal strategies. Managing risk as you get closer to retirement age.',
  },
  {
    num: '05',
    title: 'For Nigerians Specifically',
    body: 'Investment opportunities for Nigerians in the diaspora. Retirement planning alternatives for those in Nigeria. Building wealth entirely outside government pensions.',
  },
  {
    num: '06',
    title: 'Common Retirement Mistakes',
    body: 'Starting too late. Ignoring inflation. Depending only on pensions. Lack of diversification. Emotional investing. How to avoid every one of them.',
  },
]

const faqItems = [
  {
    q: 'Is this actually free?',
    a: 'Yes. Tito offers this session free because he believes retirement planning advice shouldn\'t be locked behind a paywall.',
  },
  {
    q: 'I\'m based in Nigeria — not the diaspora. Is this still relevant?',
    a: 'Completely. Tito specifically covers retirement strategies for people earning in naira and building wealth outside Western financial systems.',
  },
  {
    q: 'I\'m in my 50s. Is it too late?',
    a: 'No. A session tailored to where you are right now is more valuable than a generic plan. Tito will work with your actual situation.',
  },
  {
    q: 'What happens after the session?',
    a: 'You\'ll have a clear picture of your next steps. If you want to continue working with Tito, he\'ll tell you what that looks like. There\'s no pressure.',
  },
  {
    q: 'I already have a 401(k)/pension. Do I still need this?',
    a: 'Probably yes. Most people with pension plans are significantly under-invested for the retirement lifestyle they want. Tito will help you see the gap.',
  },
]

function CheckItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
      <span
        aria-hidden
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: FOREST,
          color: 'white',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          marginTop: '0.25rem',
        }}
      >
        ✓
      </span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#2A2A2A', lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

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

export default function RetirementPage() {
  useReveal()

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

        {/* Bottom info panel — anchored to hero bottom */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', width: '100%', maxWidth: '1000px', padding: '0 24px' }}>
          <div
            className="retirement-panel-inner"
            style={{
              background: 'rgba(248,245,238,0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(26,58,22,0.12)',
              borderBottom: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '40px 48px 0 48px',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Row 1 — 2 cols */}
            <div className="retirement-panel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '32px' }}>
              <div>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(13,11,8,0.45)', textTransform: 'uppercase', fontWeight: 500, marginBottom: '12px' }}>
                  WHAT IS THIS SESSION?
                </p>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, color: '#0D0B08', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  A plan built for your<br />
                  retirement reality.
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(13,11,8,0.6)', lineHeight: 1.75 }}>
                  Retirement planning built for Nigerians — at home and in the diaspora. Tito shows you the accounts, assets, and strategies that actually work for your situation.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(26,58,22,0.1)', width: '100%' }} />

            {/* Row 2 — 3 feature rows */}
            <div className="retirement-feature-rows" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px 0 0 0' }}>
              {[
                { num: '01', label: 'Tax-Advantaged Accounts' },
                { num: '02', label: 'Portfolio Building' },
                { num: '03', label: 'Income in Retirement' },
              ].map((item) => (
                <a
                  key={item.num}
                  href="#register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: 'rgba(26,58,22,0.04)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(26,58,22,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26,58,22,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(13,11,8,0.35)' }}>{item.num}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0D0B08' }}>{item.label}</span>
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(13,11,8,0.3)' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ============ SECTION 2 — REALITY CHECK ============ */}
      <section id="section-2" style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
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
            <div style={{ background: FOREST, borderRadius: '16px', padding: '2.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '80px', fontWeight: 300, color: GOLD, lineHeight: 0.9 }}>3×</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 500, color: 'white', marginTop: '0.5rem' }}>
                More you need to invest
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Every 10 years you delay retirement investing, you need to invest roughly 3× as much to reach the same outcome.
              </div>
            </div>
            {/* Card 2 */}
            <div style={{ background: 'white', border: '1px solid rgba(26,58,22,0.1)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, color: GOLD, lineHeight: 0.9 }}>15–20%</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 500, color: INK, marginTop: '0.5rem' }}>
                Annual inflation in Nigeria
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B6B6B', marginTop: '0.5rem', lineHeight: 1.6 }}>
                A savings account at 5% interest is losing you money in real terms every year.
              </div>
            </div>
            {/* Card 3 */}
            <div style={{ background: CREAM, borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, color: FOREST, lineHeight: 0.9 }}>0</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 500, color: INK, marginTop: '0.5rem' }}>
                Diaspora Nigerians using their Roth IRA
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B6B6B', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Most Nigerians abroad have access to tax-advantaged retirement accounts — and never use them.
              </div>
            </div>
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
      <section id="modules" style={{ background: INK, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
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
                color: 'white',
                marginBottom: '1rem',
              }}
            >
              What Tito Will Walk You Through
            </h2>
          </div>
          <ModuleRows modules={modules} />
        </div>
      </section>

      {/* ============ SECTION 4 — OUTCOMES ============ */}
      <section style={{ background: CREAM, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div className="two-col" data-reveal>
            <div>
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
            <div>
              <CheckItem text="A clear understanding of how retirement planning actually works" />
              <CheckItem text="Knowledge of the retirement investment accounts available to you" />
              <CheckItem text="A practical framework for building your own retirement portfolio" />
              <CheckItem text="Confidence in the specific next steps for your situation" />
              <CheckItem text="Direct access to Tito for follow-up questions" />
            </div>
          </div>

          <div data-reveal style={{ background: FOREST, borderRadius: '20px', padding: 'clamp(2rem, 4vw, 2.5rem)', marginTop: '3rem' }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.75rem' }}>
              Important
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontStyle: 'italic', color: 'white', marginBottom: '0.5rem', lineHeight: 1.35 }}>
              This isn't a lecture. It's a strategy session.
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              Tito will look at your specific situation and help you understand what to do — not just what's possible in theory.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 5 — WHO IT'S FOR ============ */}
      <section id="who" style={{ background: IVORY, padding: sectionPad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div className="two-col" data-reveal>
            <div>
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
            <div>
              {[
                'You\'re a salary earner who wants to retire with dignity — not dependency',
                'You\'re self-employed with no employer pension and you know you need to act',
                'You\'re a business owner who wants assets outside your business',
                'You\'re Nigerian in the diaspora — US, UK, Canada — and haven\'t touched your Roth IRA or 401(k)',
                'You\'re in Nigeria and want to build wealth completely outside the pension system',
                'You\'re 25 or 55 — it\'s never too early and never too late to build a plan',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: FOREST, flexShrink: 0, marginTop: '0.7rem' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#2A2A2A', lineHeight: 1.7 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 6 — ABOUT TITO ============ */}
      <section id="about" style={{ background: IVORY, padding: sectionPad }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div className="two-col" data-reveal>
            <div style={{ background: CREAM, borderRadius: '20px', aspectRatio: '3 / 4', overflow: 'hidden' }}>
              <img
                src="/images/titobi-services.jpg"
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
                Before Titobi became a financial educator, he spent years inside GTBank and Zenith Bank — watching how
                money actually moves and where most people's retirement plans fall apart.
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8, marginBottom: '1rem' }}>
                He went on to earn an MBA from WashU Olin, study financial systems across 15+ countries, and build an
                audience of 100,000+ people who trust him to make complex financial concepts simple and actionable.
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#4A4A4A', lineHeight: 1.8 }}>
                He built Tito's GDR Strategy — Growth, Dividend, Retirement — as a complete wealth system that works
                whether you're earning in naira or dollars.
              </p>
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
          <div className="two-col" data-reveal>
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
                Your Retirement Strategy Session Is Free. Your Future Depends on What You Do With It.
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                Fill in your details and Tito's team will reach out to schedule your session.
              </p>
            </div>

            <div>
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
    </div>
  )
}

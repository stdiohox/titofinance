import { BookOpen, Calculator, Users } from 'lucide-react'

export default function FreeResources() {
  return (
    <section className="bg-[#EDE8DC] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span data-reveal style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: '#C9A84C',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            display: 'block',
            marginBottom: '0.75rem'
          }}>
            Free Resources
          </span>
          <h2 data-reveal style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#0D0D0D',
            lineHeight: 1.05
          }}>
            Tools to Start Your Journey Today
          </h2>
        </div>

        {/* Card grid */}
        <div data-cards className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 — Free Ebook */}
          <div
            data-card
            className="bg-[#F8F5EE] rounded-2xl p-8 flex flex-col gap-4"
            style={{ borderTop: '3px solid #C9A84C' }}
          >
            <BookOpen size={28} color="#2D5A27" />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#0D0D0D', fontWeight: 500 }}>
              Free Ebook: Stock 101
            </h3>
            <p className="flex-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#6B6B6B', lineHeight: 1.65 }}>
              Your beginner's guide to the stock market. Understand how to pick, buy, and grow your first investments — no jargon, no fluff.
            </p>
            <a
              href="https://docs.google.com/forms/u/1/d/e/1FAIpQLSdpZapygfQvHP3ussFt4rtYkhgPTQRa_25tMewiCJJcvd_rmg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full transition-colors duration-200 mt-auto self-start"
              style={{
                background: '#2D5A27',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                paddingLeft: '1.5rem',
                paddingRight: '0.375rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                textDecoration: 'none'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
            >
              Download Free
              <span style={{ background: 'white', borderRadius: '9999px', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
          </div>

          {/* Card 2 — Expense Tracker */}
          <div
            data-card
            className="bg-[#F8F5EE] rounded-2xl p-8 flex flex-col gap-4"
            style={{ borderTop: '3px solid #2D5A27' }}
          >
            <Calculator size={28} color="#2D5A27" />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#0D0D0D', fontWeight: 500 }}>
              Expense Tracker
            </h3>
            <p className="flex-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#6B6B6B', lineHeight: 1.65 }}>
              Take control of where your money goes every month. A simple, powerful tool built specifically for Tito Finance clients.
            </p>
            <a
              href="https://expenses.titofinance.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full transition-colors duration-200 mt-auto self-start"
              style={{
                background: '#2D5A27',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                paddingLeft: '1.5rem',
                paddingRight: '0.375rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                textDecoration: 'none'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1A3A16')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2D5A27')}
            >
              Open Tracker
              <span style={{ background: 'white', borderRadius: '9999px', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
          </div>

          {/* Card 3 — Finance 101 Monthly */}
          <div
            data-card
            className="bg-[#F8F5EE] rounded-2xl p-8 flex flex-col gap-4"
            style={{ borderTop: '3px solid #C9A84C' }}
          >
            <Users size={28} color="#2D5A27" />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#0D0D0D', fontWeight: 500 }}>
              Personal Finance 101
            </h3>
            <p className="flex-1" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#6B6B6B', lineHeight: 1.65 }}>
              Join the free monthly session. Every month, Titobi covers a new core topic — live, interactive, and completely free.
            </p>
            <button
              className="inline-flex items-center gap-3 rounded-full transition-colors duration-200 mt-auto self-start"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#C9A84C',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                paddingLeft: '1.5rem',
                paddingRight: '0.375rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#b8943e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}
            >
              Join Free Monthly
              <span style={{ background: 'white', borderRadius: '9999px', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

import ChatBot from './ChatBot'
import { TITO_PERSONAL_WHATSAPP } from '@/lib/forms'

/**
 * The embedded assistant, lifted out of App.tsx. Two columns from lg: the
 * pitch on the left, the chat on the right. As a single 480px column it sat
 * in the middle of a 1440px page with ~480px of empty ivory either side.
 * The sentence under the heading only names what the quick replies already
 * answer (services, GDR, the free group, who Titobi is).
 */
export default function AssistantSection() {
  return (
    <section id="assistant" style={{ background: '#F8F5EE', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

        <div className="lg:col-span-5">
          <p data-reveal style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            Ask Tito's Assistant
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 4vw, 4.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#1A3A16',
            marginBottom: '1.25rem',
            lineHeight: 1.05
          }}>
            Have a question? Start here.
          </h2>
          <p data-reveal style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1rem',
            color: '#6B6B6B',
            lineHeight: 1.7,
            maxWidth: '400px'
          }}>
            Ask about the services, the GDR strategy, the free Stock 101 group or who Titobi is.
            For anything about your own money,{' '}
            <a
              href={TITO_PERSONAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2D5A27', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              book a call
            </a>.
          </p>
        </div>

        <div data-reveal className="lg:col-span-7 w-full max-w-[640px] lg:max-w-none">
          <ChatBot embedded={true} />
        </div>

      </div>
    </section>
  )
}

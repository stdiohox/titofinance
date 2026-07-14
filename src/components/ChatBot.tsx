import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

interface ChatBotProps {
  embedded?: boolean
}

interface Action {
  label: string
  href: string
}

interface Message {
  role: 'bot' | 'user'
  text: string
  action?: Action
}

const QUICK_REPLIES = [
  'Our Services',
  'The GDR Strategy',
  'Book a Call',
  'Join Free Group',
  'Who is Titobi?',
]

const WHATSAPP = 'https://wa.me/2348184750870'
const GROUP = 'https://chat.whatsapp.com/Dya2CxUltpD6ZfUJFd90Ye?mode=gi_t'

const RESPONSES: Record<string, Omit<Message, 'role'>> = {
  'Our Services': {
    text: 'Tito offers 6 services: Personal Finance 101 (free monthly), Beginner\'s Portfolio, Closed Circuit Group, Mentorship, Quick Fire One-on-One, and Retirement Portfolio. Which would you like to know more about?',
  },
  'The GDR Strategy': {
    text: 'GDR stands for Growth · Dividend · Retirement — three purpose-built portfolios with one job each. Growth chases long-term capital appreciation. Dividend generates steady passive income. Retirement preserves capital for the future. Together they form Tito\'s complete wealth system.',
  },
  'Book a Call': {
    text: 'Great! Click below to reach Tito directly on WhatsApp and book your free strategy call. 👇',
    action: { label: 'Chat on WhatsApp →', href: WHATSAPP },
  },
  'Join Free Group': {
    text: 'Tito\'s Personal Finance 101 group is free and runs monthly. Join here 👇',
    action: { label: 'Join WhatsApp Group →', href: GROUP },
  },
  'Who is Titobi?': {
    text: 'Titobi Oreolorun — known as Teetobee — is a Personal Finance Coach and Financial Instructor. He built his foundation inside GTBank and Zenith Bank before founding JustUsedTech and co-founding Aangoo Finance. He holds a WashU Olin MBA and has visited 15+ countries. Today he helps everyday people build wealth on purpose using his GDR strategy.',
  },
}

const FALLBACK: Omit<Message, 'role'> = {
  text: 'I\'m a simple assistant — tap one of the options below or message Tito directly on WhatsApp for anything else.',
  action: { label: 'Message Tito →', href: WHATSAPP },
}

const INITIAL: Message = {
  role: 'bot',
  text: 'Hey 👋 I\'m Tito\'s assistant. What can I help you with today?',
}

function BotAvatar() {
  return (
    <div style={{
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: '#1A3A16',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '13px',
      fontWeight: 600,
      flexShrink: 0,
    }}>
      T
    </div>
  )
}

function ChatWindow({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([INITIAL])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const reply = (userText: string, botMessage: Omit<Message, 'role'>) => {
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', ...botMessage }])
    }, 450)
  }

  const handleQuickReply = (label: string) => reply(label, RESPONSES[label])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    reply(text, FALLBACK)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8F5EE',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: '#1A3A16',
        color: 'white',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>Tito Finance</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4A8C42', display: 'inline-block' }} />
            Online
          </span>
          {onClose && (
            <button
              aria-label="Close chat"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', padding: '2px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          m.role === 'bot' ? (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <BotAvatar />
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  background: 'white',
                  color: '#1A3A16',
                  padding: '10px 14px',
                  borderRadius: '4px 14px 14px 14px',
                  fontSize: '14px',
                  lineHeight: 1.55,
                }}>
                  {m.text}
                </div>
                {m.action && (
                  <a
                    href={m.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      background: '#C9A84C',
                      color: '#1A3A16',
                      borderRadius: '999px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {m.action.label}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: '#2D5A27',
                color: 'white',
                padding: '10px 14px',
                borderRadius: '14px 4px 14px 14px',
                fontSize: '14px',
                lineHeight: 1.55,
                maxWidth: '80%',
              }}>
                {m.text}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Quick replies */}
      <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0 }}>
        {QUICK_REPLIES.map(label => (
          <button
            key={label}
            onClick={() => handleQuickReply(label)}
            style={{
              border: '1.5px solid #2D5A27',
              color: '#2D5A27',
              background: 'white',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#2D5A27'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#2D5A27'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: '8px', flexShrink: 0, borderTop: '1px solid rgba(45,90,39,0.12)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
          placeholder="Type a message…"
          aria-label="Message"
          style={{
            flex: 1,
            minWidth: 0,
            border: '1px solid rgba(45,90,39,0.2)',
            borderRadius: '999px',
            padding: '8px 14px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
            background: 'white',
            color: '#1A3A16',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          aria-label="Send"
          style={{
            background: '#2D5A27',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default function ChatBot({ embedded }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (embedded) {
    return (
      <div style={{ height: '480px', width: '100%', boxShadow: '0 12px 40px rgba(26,58,22,0.12)', borderRadius: '16px' }}>
        <ChatWindow />
      </div>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed z-50 rounded-2xl shadow-2xl w-[calc(100vw-32px)] right-4 bottom-20 md:w-[360px] md:right-6 md:bottom-24"
          style={{ height: '480px' }}
        >
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      <button
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        onClick={() => setIsOpen(open => !open)}
        className="fixed z-50"
        style={{
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#C9A84C',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(26,58,22,0.3)',
        }}
      >
        <MessageCircle size={26} color="#1A3A16" />
      </button>
    </>
  )
}

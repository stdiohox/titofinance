import { useRef, useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

interface LandingFaqProps {
  items: FaqItem[]
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        borderBottom: '1px solid rgba(26,58,22,0.1)',
        padding: '1.5rem 0',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
        <span
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '17px',
            fontWeight: 500,
            color: '#0D0B08',
            lineHeight: 1.4,
          }}
        >
          {item.q}
        </span>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '22px',
            color: '#C9A84C',
            lineHeight: 1,
            marginTop: '2px',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          +
        </span>
      </div>

      <div
        style={{
          maxHeight: open ? `${answerRef.current?.scrollHeight ?? 0}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <div
          ref={answerRef}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '15px',
            color: '#6B6B6B',
            lineHeight: 1.7,
            paddingTop: '0.75rem',
            maxWidth: '640px',
          }}
        >
          {item.a}
        </div>
      </div>
    </div>
  )
}

export default function LandingFaq({ items }: LandingFaqProps) {
  return (
    <div>
      {items.map((item) => (
        <FaqRow key={item.q} item={item} />
      ))}
    </div>
  )
}

import * as React from 'react'
import { motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import { Minus, Plus } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface ScrollFAQAccordionProps {
  data: FAQItem[]
}

export default function ScrollFAQAccordion({
  data = [],
}: ScrollFAQAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const contentRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  useGSAP(() => {
    if (!containerRef.current || data.length === 0) return

    ScrollTrigger.getAll().forEach((t) => t.kill())

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 64px',
        end: `+=${data.length * 220}`,
        scrub: 0.3,
        pin: true,
        markers: false,
      },
    })

    data.forEach((item, index) => {
      tl.add(() => {
        setOpenItem(item.id.toString())
      }, index * 2)
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '0 24px',
        height: '300vh',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <p
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          FAQ
        </p>
        <h2
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '48px',
            fontWeight: 400,
            color: '#0D0B08',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          Quick Answers
        </h2>
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            color: '#6B6B6B',
            lineHeight: 1.6,
          }}
        >
          Scroll through to find answers to common questions.
        </p>
      </div>

      {/* Accordion */}
      <Accordion.Root type="single" collapsible value={openItem || ''}>
        {data.map((item) => (
          <Accordion.Item
            value={item.id.toString()}
            key={item.id}
            style={{
              marginBottom: '12px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(26,58,22,0.1)',
              background: '#FFFFFF',
            }}
          >
            <Accordion.Header>
              <Accordion.Trigger
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  cursor: 'default',
                  background:
                    openItem === item.id.toString()
                      ? 'rgba(26,58,22,0.03)'
                      : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background 0.3s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    color:
                      openItem === item.id.toString() ? '#1A3A16' : '#0D0B08',
                    lineHeight: 1.5,
                  }}
                >
                  {item.question}
                </span>
                <span
                  style={{
                    color:
                      openItem === item.id.toString() ? '#C9A84C' : '#9A9A9A',
                    flexShrink: 0,
                    marginLeft: '16px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {openItem === item.id.toString() ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content asChild forceMount>
              <motion.div
                ref={(el) => {
                  if (el) contentRefs.current.set(item.id.toString(), el)
                }}
                initial="collapsed"
                animate={openItem === item.id.toString() ? 'open' : 'collapsed'}
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    padding: '0 24px 20px 24px',
                    borderTop: '1px solid rgba(26,58,22,0.06)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '15px',
                      color: '#4A4A4A',
                      lineHeight: 1.75,
                      paddingTop: '16px',
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}

export interface ModuleItem {
  num: string
  title: string
  body: string
}

interface ModuleRowsProps {
  modules: ModuleItem[]
}

// Horizontal numbered rows (NOT cards): left number column, right content
// column, hairline divider between rows. Shared by both landing pages'
// "what's covered" sections.
export default function ModuleRows({ modules }: ModuleRowsProps) {
  return (
    <div style={{ marginTop: '3rem', position: 'relative', zIndex: 1 }}>
      {modules.map((m) => (
        <div
          key={m.num}
          data-reveal
          className="module-row"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '2rem 0',
            display: 'grid',
            gridTemplateColumns: '2fr 10fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              color: 'rgba(201,168,76,0.5)',
              lineHeight: 1,
            }}
          >
            {m.num}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: 'white',
                marginBottom: '0.5rem',
              }}
            >
              {m.title}
            </div>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
                maxWidth: '640px',
              }}
            >
              {m.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import type { CSSProperties } from 'react'

interface PullTextProps {
  children: string
  size: string // e.g. '200px' or 'clamp(120px, 20vw, 200px)'
  color: string
  position: CSSProperties // absolute positioning + any overrides
  italic?: boolean
}

// The signature element: an oversized Cormorant numeral/word bleeding
// behind a section's content. Non-interactive, hidden from a11y tree.
export default function PullText({ children, size, color, position, italic }: PullTextProps) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        fontFamily: 'Cormorant Garamond, serif',
        fontWeight: 300,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        lineHeight: 0.8,
        color,
        letterSpacing: '-0.03em',
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        zIndex: 0,
        ...position,
      }}
    >
      {children}
    </div>
  )
}

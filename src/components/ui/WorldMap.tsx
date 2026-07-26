import { useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DottedMap from 'dotted-map'

interface Dot {
  start: { lat: number; lng: number; label?: string }
  end: { lat: number; lng: number; label?: string }
}

interface WorldMapProps {
  dots?: Dot[]
  lineColor?: string
  animationDuration?: number
  loop?: boolean
}

export function WorldMap({
  dots = [],
  lineColor = '#C9A84C',
  animationDuration = 2,
  loop = true,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  const map = useMemo(
    () => new DottedMap({ height: 100, grid: 'diagonal' }),
    []
  )

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: 'rgba(26,58,22,0.25)',
        shape: 'circle',
        backgroundColor: 'transparent',
      }),
    [map]
  )

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360)
    const y = (90 - lat) * (400 / 180)
    return { x, y }
  }

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2
    const midY = Math.min(start.y, end.y) - 50
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  const staggerDelay = 0.3
  const totalAnimationTime = dots.length * staggerDelay + animationDuration
  const pauseTime = 2
  const fullCycleDuration = totalAnimationTime + pauseTime

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '2/1',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          maskImage:
            'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        alt="world map"
        draggable={false}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="path-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)
          const startTime = (i * staggerDelay) / fullCycleDuration
          const endTime =
            (i * staggerDelay + animationDuration) / fullCycleDuration
          const resetTime = totalAnimationTime / fullCycleDuration

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: 'easeInOut',
                      }
                }
              />

              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: '0%', opacity: 0 }}
                  animate={{
                    offsetDistance: [null, '0%', '100%', '100%', '100%'],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')`,
                  }}
                />
              )}
            </g>
          )
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)

          return (
            <g key={`points-group-${i}`}>
              <g key={`start-${i}`}>
                <motion.g
                  onHoverStart={() =>
                    setHoveredLocation(dot.start.label || '')
                  }
                  onHoverEnd={() => setHoveredLocation(null)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="3"
                    fill={lineColor}
                    filter="url(#glow)"
                  />
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="3"
                    fill={lineColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="3"
                      to="12"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {dot.start.label && (
                  <foreignObject
                    x={startPoint.x - 40}
                    y={startPoint.y - 32}
                    width="80"
                    height="24"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '9px',
                          letterSpacing: '0.05em',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(26,58,22,0.9)',
                          color: '#C9A84C',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dot.start.label}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>

              <g key={`end-${i}`}>
                <motion.g
                  onHoverStart={() =>
                    setHoveredLocation(dot.end.label || '')
                  }
                  onHoverEnd={() => setHoveredLocation(null)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="3"
                    fill={lineColor}
                    filter="url(#glow)"
                  />
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="3"
                    fill={lineColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="3"
                      to="12"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {dot.end.label && (
                  <foreignObject
                    x={endPoint.x - 40}
                    y={endPoint.y - 32}
                    width="80"
                    height="24"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '9px',
                          letterSpacing: '0.05em',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(26,58,22,0.9)',
                          color: '#C9A84C',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dot.end.label}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            </g>
          )
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(26,58,22,0.95)',
              color: '#C9A84C',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.05em',
            }}
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Warp } from '@paper-design/shaders-react'
import { TrendingUp, PiggyBank, Globe, ShieldCheck, BarChart3, AlertTriangle } from 'lucide-react'

interface ModuleCard {
  number: string
  title: string
  description: string
  icon: ReactNode
}

const modules: ModuleCard[] = [
  {
    number: '01',
    title: 'The Retirement Reality',
    description: 'Why retirement planning cannot wait. The real cost of delay. How inflation destroys retirement income — and how to protect against it.',
    icon: <TrendingUp size={32} color="white" strokeWidth={1.5} />,
  },
  {
    number: '02',
    title: 'Retirement Investment Accounts',
    description: 'Roth IRA. Traditional IRA. 401(k). Employer-sponsored plans. Matching contributions. Which account suits your situation.',
    icon: <PiggyBank size={32} color="white" strokeWidth={1.5} />,
  },
  {
    number: '03',
    title: 'Building Your Retirement Portfolio',
    description: 'Diversification. ETFs. Dividend-paying investments. REITs. Bonds and fixed-income assets. Growth versus income.',
    icon: <BarChart3 size={32} color="white" strokeWidth={1.5} />,
  },
  {
    number: '04',
    title: 'Retirement Income Strategy',
    description: 'Creating passive income that replaces your salary. Dividend income. Withdrawal strategies. Managing risk as you approach retirement.',
    icon: <ShieldCheck size={32} color="white" strokeWidth={1.5} />,
  },
  {
    number: '05',
    title: 'For Nigerians Specifically',
    description: 'Investment opportunities for Nigerians in the diaspora. Retirement planning alternatives for those in Nigeria. Building wealth outside government pensions.',
    icon: <Globe size={32} color="white" strokeWidth={1.5} />,
  },
  {
    number: '06',
    title: 'Common Retirement Mistakes',
    description: 'Starting too late. Ignoring inflation. Depending only on pensions. Lack of diversification. Emotional investing. How to avoid every one of them.',
    icon: <AlertTriangle size={32} color="white" strokeWidth={1.5} />,
  },
]

const getShaderConfig = (index: number) => {
  const configs = [
    {
      proportion: 0.35,
      softness: 0.9,
      distortion: 0.14,
      swirl: 0.6,
      swirlIterations: 8,
      shape: 'checks' as const,
      shapeScale: 0.09,
      colors: ['hsl(138, 47%, 10%)', 'hsl(138, 47%, 18%)', 'hsl(43, 56%, 42%)', 'hsl(138, 47%, 22%)'],
    },
    {
      proportion: 0.4,
      softness: 1.1,
      distortion: 0.18,
      swirl: 0.85,
      swirlIterations: 12,
      shape: 'stripes' as const,
      shapeScale: 0.11,
      colors: ['hsl(138, 47%, 8%)', 'hsl(43, 56%, 35%)', 'hsl(138, 47%, 20%)', 'hsl(43, 56%, 48%)'],
    },
    {
      proportion: 0.32,
      softness: 0.85,
      distortion: 0.12,
      swirl: 0.7,
      swirlIterations: 10,
      shape: 'checks' as const,
      shapeScale: 0.08,
      colors: ['hsl(138, 47%, 12%)', 'hsl(138, 47%, 25%)', 'hsl(43, 56%, 38%)', 'hsl(138, 47%, 16%)'],
    },
    {
      proportion: 0.42,
      softness: 1.0,
      distortion: 0.2,
      swirl: 0.75,
      swirlIterations: 9,
      shape: 'stripes' as const,
      shapeScale: 0.12,
      colors: ['hsl(43, 56%, 30%)', 'hsl(138, 47%, 15%)', 'hsl(43, 56%, 45%)', 'hsl(138, 47%, 20%)'],
    },
    {
      proportion: 0.38,
      softness: 0.95,
      distortion: 0.16,
      swirl: 0.8,
      swirlIterations: 11,
      shape: 'checks' as const,
      shapeScale: 0.1,
      colors: ['hsl(138, 47%, 9%)', 'hsl(138, 47%, 22%)', 'hsl(43, 56%, 40%)', 'hsl(138, 47%, 14%)'],
    },
    {
      proportion: 0.36,
      softness: 1.2,
      distortion: 0.15,
      swirl: 0.65,
      swirlIterations: 7,
      shape: 'stripes' as const,
      shapeScale: 0.13,
      colors: ['hsl(43, 56%, 28%)', 'hsl(138, 47%, 18%)', 'hsl(43, 56%, 42%)', 'hsl(138, 47%, 12%)'],
    },
  ]
  return configs[index % configs.length]
}

export default function RetirementShaderCards() {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}
      className="retirement-shader-grid"
    >
      {modules.map((module, index) => {
        const shader = getShaderConfig(index)
        return (
          <div key={module.number} style={{ position: 'relative', height: '300px' }}>
            {/* Shader background */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden' }}>
              <Warp
                style={{ height: '100%', width: '100%' }}
                proportion={shader.proportion}
                softness={shader.softness}
                distortion={shader.distortion}
                swirl={shader.swirl}
                swirlIterations={shader.swirlIterations}
                shape={shader.shape}
                shapeScale={shader.shapeScale}
                scale={1}
                rotation={0}
                speed={0.5}
                colors={shader.colors}
              />
            </div>

            {/* Card content overlay */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                padding: '28px',
                borderRadius: '20px',
                background: 'rgba(13,11,8,0.72)',
                border: '1px solid rgba(201,168,76,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(2px)',
              }}
            >
              {/* Top row: number + icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#C9A84C', opacity: 0.7 }}>
                  {module.number}
                </span>
                <div style={{ opacity: 0.85 }}>{module.icon}</div>
              </div>

              {/* Bottom: title + description */}
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '10px' }}>
                  {module.title}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                  {module.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

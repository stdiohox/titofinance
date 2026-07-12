import { Landmark, Building2, GraduationCap, Globe, BadgeCheck, Sparkles, TrendingUp, Award } from 'lucide-react'

const institutions = [
  { Icon: Landmark, label: 'Zenith Bank' },
  { Icon: Building2, label: 'GTBank' },
  { Icon: GraduationCap, label: 'WashU Olin MBA' },
  { Icon: Globe, label: '15+ Countries' },
  { Icon: BadgeCheck, label: 'Finance Certified' },
  { Icon: Sparkles, label: 'AI Integration' },
  { Icon: TrendingUp, label: 'Sales Mastery' },
  { Icon: Award, label: 'Olin Business School' },
]

const all = [...institutions, ...institutions]

export default function InstitutionsRow() {
  return (
    <section style={{
      background: '#F8F5EE',
      padding: '3rem 1.5rem',
      borderTop: '1px solid rgba(45,90,39,0.1)',
      borderBottom: '1px solid rgba(45,90,39,0.1)'
    }}>
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          color: '#6B6B6B',
          lineHeight: 1.6
        }}>
          Trained and credentialed<br />by world-class institutions.
        </p>
        <div className="md:col-span-3 overflow-hidden">
          <div className="inst-track">
            {all.map(({ Icon, label }, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span
                  className="flex items-center whitespace-nowrap"
                  style={{
                    gap: '0.55rem',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    color: 'rgba(13,13,13,0.5)'
                  }}
                >
                  <Icon size={16} strokeWidth={1.75} style={{ color: 'rgba(45,90,39,0.55)' }} aria-hidden="true" />
                  {label}
                </span>
                <span aria-hidden="true" style={{
                  color: '#C9A84C',
                  opacity: 0.55,
                  fontSize: '9px',
                  margin: '0 1.75rem'
                }}>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

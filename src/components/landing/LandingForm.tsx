import { useState } from 'react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select'
  options?: string[]
  placeholder?: string
}

interface LandingFormProps {
  fields: FormField[]
  submitLabel: string
  webhookUrl: string
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Mono, monospace',
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
  marginBottom: '0.5rem',
}

// Frosted-glass shell that carries the border, blur and focus glow
// (.retirement-glass-wrapper:focus-within lives in landing.css).
const glassWrapperStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: 'border-color 0.2s ease, background 0.2s ease',
  marginBottom: '4px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: '14px 16px',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  color: '#FFFFFF',
  borderRadius: '12px',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: '14px 16px',
  paddingRight: '40px',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  color: 'rgba(255,255,255,0.7)',
  borderRadius: '12px',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  // Custom chevron so the select still reads as a dropdown after appearance:none.
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
}

export default function LandingForm({ fields, submitLabel }: LandingFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      form_type: 'retirement',
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      ageRange: formData.get('ageRange') as string,
      location: formData.get('location') as string,
      retirementSavings: formData.get('retirementSavings') as string,
      howHeard: formData.get('howHeard') as string,
    }

    try {
      setSubmitting(true)
      await fetch(
        'https://script.google.com/macros/s/AKfycbxS_n6QvCVS_BkgGTuQCAphOIpEV89gU4YO7RtDhdwEGf0v8ipOC7xVMpaMOHNu8EvgVg/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      setSubmitted(true)
      form.reset()
    } catch (err) {
      console.error('Form error:', err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} style={labelStyle}>
              {field.label}
            </label>
            <div className="retirement-glass-wrapper" style={glassWrapperStyle}>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  required
                  defaultValue=""
                  className="retirement-form-input"
                  style={selectStyle}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  className="retirement-form-input"
                  style={inputStyle}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          background: '#C9A84C',
          color: '#1A3A16',
          border: 'none',
          borderRadius: '999px',
          padding: '16px',
          marginTop: '8px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          cursor: submitting ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#B8972B'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#C9A84C'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)'
        }}
      >
        {submitting ? 'Submitting...' : submitLabel}
      </button>

      {submitted && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(37,211,102,0.15)',
          borderRadius: '12px',
          border: '1px solid rgba(37,211,102,0.35)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>
          ✓ Received! Tito's team will reach out on WhatsApp to schedule your session.
        </div>
      )}

      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
          marginTop: '1rem',
        }}
      >
        🔒 No spam. Just your session confirmation.
      </p>
    </form>
  )
}

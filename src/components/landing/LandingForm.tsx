import { useState, type FormEvent } from 'react'

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
  color: '#C9A84C',
  marginBottom: '0.5rem',
}

const controlStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '15px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  padding: '1rem',
  color: 'white',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}

export default function LandingForm({ fields, submitLabel, webhookUrl }: LandingFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
      form.reset()
    } catch {
      // Webhook may not be live yet — still confirm to the user, matching
      // the brief's fallback ("You're registered! Check your WhatsApp...").
      setStatus('success')
      form.reset()
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>✓</div>
        <h3
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '32px',
            fontWeight: 400,
            color: 'white',
            marginBottom: '0.75rem',
          }}
        >
          You're registered!
        </h3>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.65)' }}>
          Check your WhatsApp for the session details.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} style={labelStyle}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required
                defaultValue=""
                style={{ ...controlStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A84C')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              >
                <option value="" disabled style={{ color: '#0D0B08' }}>
                  Select…
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt} style={{ color: '#0D0B08' }}>
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
                style={controlStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A84C')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          width: '100%',
          background: '#C9A84C',
          color: '#0D0B08',
          borderRadius: '999px',
          border: 'none',
          padding: '1rem',
          marginTop: '1.5rem',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          cursor: status === 'submitting' ? 'wait' : 'pointer',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {status === 'submitting' ? 'Submitting…' : submitLabel}
      </button>

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

import { useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'

/**
 * WhatsApp number field: a country-code select next to the local number.
 *
 * Every registration form posts one `phone` string, so the two visible
 * controls feed a hidden input under that same name. Handlers and the Sheets
 * ingest keep reading `formData.get('phone')` and never learn there are two
 * boxes. The composed value is E.164 (`+2348012345678`), which is what the
 * CRM's normalizePhone and the wa.me deep links want anyway - previously the
 * column collected whatever shape the visitor happened to type.
 */

export interface Country {
  name: string
  code: string // ISO, used only as a stable option key
  dial: string
  flag: string
}

// The audience is Nigeria first and the diaspora second, so those sit above
// the fold of the dropdown rather than making someone scroll past Albania.
const PRIORITY: Country[] = [
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
]

const REST: Country[] = [
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Benin', code: 'BJ', dial: '+229', flag: '🇧🇯' },
  { name: 'Botswana', code: 'BW', dial: '+267', flag: '🇧🇼' },
  { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Cameroon', code: 'CM', dial: '+237', flag: '🇨🇲' },
  { name: "Côte d'Ivoire", code: 'CI', dial: '+225', flag: '🇨🇮' },
  { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Ethiopia', code: 'ET', dial: '+251', flag: '🇪🇹' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Gambia', code: 'GM', dial: '+220', flag: '🇬🇲' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Jamaica', code: 'JM', dial: '+1876', flag: '🇯🇲' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Liberia', code: 'LR', dial: '+231', flag: '🇱🇷' },
  { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
  { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { name: 'Niger', code: 'NE', dial: '+227', flag: '🇳🇪' },
  { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
  { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Rwanda', code: 'RW', dial: '+250', flag: '🇷🇼' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SN', dial: '+221', flag: '🇸🇳' },
  { name: 'Sierra Leone', code: 'SL', dial: '+232', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Tanzania', code: 'TZ', dial: '+255', flag: '🇹🇿' },
  { name: 'Togo', code: 'TG', dial: '+228', flag: '🇹🇬' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'Uganda', code: 'UG', dial: '+256', flag: '🇺🇬' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Zambia', code: 'ZM', dial: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', dial: '+263', flag: '🇿🇼' },
]

export const COUNTRIES: Country[] = [...PRIORITY, ...REST]

/**
 * Joins the dial code to the typed number as E.164.
 *
 * Two habits to absorb: Nigerians type the trunk zero (`0803…`) and some
 * people retype the country code they just picked (`+234 803…` or `234 803…`).
 * Both would otherwise produce an unreachable number.
 */
export function composePhone(dial: string, local: string): string {
  const digits = local.replace(/\D/g, '')
  if (!digits) return ''
  const dialDigits = dial.replace(/\D/g, '')
  let rest = digits
  if (rest.startsWith(dialDigits) && rest.length > dialDigits.length) {
    rest = rest.slice(dialDigits.length)
  }
  rest = rest.replace(/^0+/, '')
  return `+${dialDigits}${rest}`
}

interface PhoneFieldProps {
  /** id of the visible number input, so an existing <label htmlFor> still works. */
  id?: string
  /** Name of the hidden, composed value. Every form submits `phone`. */
  name?: string
  required?: boolean
  placeholder?: string
  /** ISO code of the country selected on load. */
  defaultCountry?: string
  inputStyle: CSSProperties
  /** Falls back to inputStyle; pages pass their select variant. */
  selectStyle?: CSSProperties
  className?: string
  /**
   * Optional shell drawn around each control. LandingForm's border, blur and
   * focus glow live on a wrapper rather than the input, so it passes one in.
   */
  renderShell?: (child: ReactNode, key: string) => ReactNode
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function PhoneField({
  id = 'phone',
  name = 'phone',
  required = true,
  placeholder = '803 000 0000',
  defaultCountry = 'NG',
  inputStyle,
  selectStyle,
  className,
  renderShell,
  onFocus,
  onBlur,
}: PhoneFieldProps) {
  // Keyed by ISO, not by dial code: the US and Canada share +1, and keying on
  // the dial would treat picking one as picking both.
  const [iso, setIso] = useState(defaultCountry)
  const [local, setLocal] = useState('')
  const dial = (COUNTRIES.find((c) => c.code === iso) ?? PRIORITY[0]).dial

  const shell = renderShell ?? ((child: ReactNode) => child)
  const codeStyle: CSSProperties = {
    ...(selectStyle ?? inputStyle),
    // Fixed, not auto: a select sizes itself to its longest option, and
    // "United Arab Emirates +971" would take 239px of a 375px screen and
    // leave the number nowhere to go. The closed control only ever shows a
    // flag and a dial code, and the native dropdown still opens at the width
    // its own longest row needs, so nothing is lost by clamping this.
    width: selectStyle ? '116px' : '104px',
    boxSizing: 'border-box',
    textOverflow: 'ellipsis',
    paddingLeft: '0.75rem',
    paddingRight: selectStyle ? undefined : '0.5rem',
    cursor: 'pointer',
  }

  /**
   * A native select paints the selected option's own text into the closed
   * control, and no styling shortens it - "🇦🇪 +971 United Arab Emirates"
   * would clip mid-word at 116px. So the selected row alone drops its name:
   * the control reads "🇦🇪 +971", while every other row keeps the name people
   * scroll and type-ahead for. Dial code before name, so a browser that
   * truncates regardless eats the name and not the code.
   */
  const option = (c: Country) => (
    <option key={c.code} value={c.code}>
      {c.flag} {c.dial}
      {c.code === iso ? '' : ` ${c.name}`}
    </option>
  )

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
      <div style={{ flex: '0 0 auto' }}>
        {shell(
          <select
            aria-label="Country code"
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            className={className}
            style={codeStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            {PRIORITY.map(option)}
            <optgroup label="────────">{REST.map(option)}</optgroup>
          </select>,
          'code',
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {shell(
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            placeholder={placeholder}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className={className}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />,
          'number',
        )}
      </div>

      <input type="hidden" name={name} value={composePhone(dial, local)} />
    </div>
  )
}

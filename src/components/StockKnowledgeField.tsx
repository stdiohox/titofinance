import type { CSSProperties, FocusEvent } from 'react'

/**
 * "How well do you know stocks and investing?" - asked identically on the
 * Beginner's Portfolio, Stock 101 and Close Community forms.
 *
 * WHY A COMPONENT FOR ONE SELECT. All three forms post this to the same
 * `experienceLevel` key and therefore the same column. If the wording or the
 * stored values drifted apart between pages, the column would hold three
 * vocabularies for one question and nothing downstream could segment on it.
 * One definition here is the cheapest way to keep them byte-identical, and it
 * is the same reason PhoneField exists.
 *
 * WHY THE LABEL AND THE VALUE DIFFER. The visitor reads plain English - the
 * point of the question is that a nervous beginner recognises themselves in a
 * row and picks it honestly. The sheet stores the ladder rung. Close Community
 * has been collecting `Beginner` / `Intermediate` / `Advanced` since it
 * launched, so keeping those as the submitted values means the existing rows
 * stay comparable with everything collected from today, and the new pages join
 * that same scale rather than starting a second one. Change the copy freely;
 * changing a `value` re-bases the column.
 */

export interface KnowledgeLevel {
  /** Submitted and stored. Do not edit without migrating existing rows. */
  value: string
  /** Shown to the visitor. */
  label: string
}

export const KNOWLEDGE_LEVELS: KnowledgeLevel[] = [
  { value: 'Beginner', label: 'I have no idea — complete beginner' },
  { value: 'Intermediate', label: 'I have a little idea about stocks' },
  { value: 'Advanced', label: 'I have good knowledge about stocks' },
]

export const KNOWLEDGE_QUESTION = 'How well do you know stocks and investing?'

interface StockKnowledgeFieldProps {
  /** Style for the <label>. Each page owns its own form typography. */
  labelStyle: CSSProperties
  /** Base input style; the select variant is derived from it. */
  inputStyle: CSSProperties
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void
}

export default function StockKnowledgeField({
  labelStyle,
  inputStyle,
  onFocus,
  onBlur,
}: StockKnowledgeFieldProps) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor="experienceLevel" style={labelStyle}>
        {KNOWLEDGE_QUESTION}
      </label>
      <select
        id="experienceLevel"
        name="experienceLevel"
        required
        defaultValue=""
        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <option value="" disabled>
          Select…
        </option>
        {KNOWLEDGE_LEVELS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}

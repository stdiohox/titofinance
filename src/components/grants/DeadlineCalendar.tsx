import type { CSSProperties } from 'react'
import type { Deadline } from '../../lib/grantStatus'

type Props = {
  deadlines: Deadline[]
  /** Today in Lagos; marks the column and splits passed from ahead */
  today: { day: number; month: number; year: number }
}

const MONTH = 9 // October
const YEAR = 2026
const DAYS = 31
const LABELLED_DAYS = new Set([1, 5, 10, 15, 20, 25, 31])
const PASSED = 'rgba(248,245,238,0.5)'
const columns: CSSProperties = { gridTemplateColumns: `repeat(${DAYS}, minmax(0, 1fr))`, columnGap: 'clamp(2px, 0.5vw, 6px)' }

// October 2026 as a strip of 31 days, bar height = deadlines that day.
export default function DeadlineCalendar({ deadlines, today }: Props) {
  const october = deadlines.filter((d) => d.month === MONTH && d.year === YEAR)
  const counts = Array.from({ length: DAYS }, () => 0)
  for (const d of october) counts[d.day - 1] += 1
  const max = Math.max(...counts)
  if (max === 0) return null

  // Which days count as passed: all of them once October 2026 is over.
  const todayIndex =
    today.year === YEAR && today.month === MONTH ? today.day : today.year > YEAR || (today.year === YEAR && today.month > MONTH) ? DAYS + 1 : 0
  const passed = counts.reduce((n, c, i) => (i + 1 < todayIndex ? n + c : n), 0)
  const ahead = october.length - passed
  const busiest = counts.indexOf(max) + 1

  const summary = `Deadline calendar for October 2026. ${passed} deadlines have passed and ${ahead} are still ahead. The busiest day is October ${busiest}, with ${max} deadlines.`

  return (
    <figure className="w-full">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-5">
        <span className="gp-serif italic text-[1.6rem] leading-tight text-[var(--ivory)]">Deadlines across October</span>
        <span className="flex items-center gap-4 text-[13px] text-[rgba(248,245,238,0.8)]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-[2px] bg-[var(--gold)]" />
            Still ahead
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-[2px]" style={{ background: PASSED }} />
            Passed
          </span>
        </span>
      </figcaption>

      <div role="img" aria-label={summary}>
        <div className="grid items-end h-[96px] md:h-[132px]" style={columns}>
          {counts.map((count, i) => {
            const day = i + 1
            const isPassed = day < todayIndex
            return (
              <div key={day} className="relative h-full flex flex-col justify-end">
                {day === todayIndex && (
                  <span aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 border-l border-dashed border-[rgba(201,168,76,0.7)]" />
                )}
                {count > 0 && (
                  <span aria-hidden="true" className="gp-mono gp-num hidden md:block text-center text-[11px] mb-1 text-[rgba(248,245,238,0.75)]">
                    {count}
                  </span>
                )}
                {count > 0 ? (
                  <span
                    aria-hidden="true"
                    className="gp-bar relative block rounded-t-[2px]"
                    style={{ height: `${(count / max) * 78}%`, background: isPassed ? PASSED : 'var(--gold)', '--i': i } as CSSProperties}
                  />
                ) : (
                  <span aria-hidden="true" className="relative block h-[2px] bg-[rgba(248,245,238,0.2)]" />
                )}
              </div>
            )
          })}
        </div>

        <div aria-hidden="true" className="grid mt-2" style={columns}>
          {counts.map((_, i) => {
            const day = i + 1
            const isToday = day === todayIndex
            return (
              <span
                key={day}
                className={`gp-mono gp-num text-center text-[10px] md:text-[11px] leading-none whitespace-nowrap ${
                  isToday ? 'text-[var(--gold)]' : LABELLED_DAYS.has(day) ? 'text-[rgba(248,245,238,0.75)]' : 'invisible md:visible text-[rgba(248,245,238,0.7)]'
                }`}
              >
                {isToday ? (
                  <span className="relative">
                    {day}
                    <span className="absolute left-1/2 -translate-x-1/2 top-[1.35em] text-[10px] tracking-[0.08em]">Today</span>
                  </span>
                ) : (
                  day
                )}
              </span>
            )
          })}
        </div>
      </div>
    </figure>
  )
}

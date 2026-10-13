import { forwardRef, type ReactNode } from 'react'

export type SortMode = 'list' | 'deadline'

export type CategoryOption = { id: string; letter: string; label: string; count: number }

type Props = {
  options: CategoryOption[]
  total: number
  active: string
  onCategory: (id: string) => void
  hideClosed: boolean
  closedCount: number
  onHideClosed: (v: boolean) => void
  sort: SortMode
  onSort: (s: SortMode) => void
  shown: number
}

export const HIDE_CLOSED_ID = 'gp-hide-closed'

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)]'

// Filters are used over and over, so selection is a plain colour change: no
// sliding pill to wait for.
function Chip({ selected, onClick, label, children }: { selected: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={`gp-press shrink-0 inline-flex items-center gap-2 rounded-full h-9 px-4 text-[14px] font-medium whitespace-nowrap border ${focusRing} ${
        selected ? 'bg-[var(--forest)] border-[var(--forest)] text-[var(--ivory)]' : 'border-[rgba(87,84,78,0.55)] text-[var(--ink)] hover:bg-[var(--tint)]'
      }`}
    >
      {children}
    </button>
  )
}

// Sticky filter bar: category chips, a hide-closed switch and a sort toggle.
const GrantsToolbar = forwardRef<HTMLDivElement, Props>(function GrantsToolbar(
  { options, total, active, onCategory, hideClosed, closedCount, onHideClosed, sort, onSort, shown },
  ref,
) {
  return (
    <div ref={ref} className="sticky top-0 z-20 bg-[var(--ivory)] border-b border-[var(--rule)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-2.5 md:py-3 flex flex-col 2xl:flex-row 2xl:items-center gap-2.5 2xl:gap-6">
        <div
          role="group"
          aria-label="Filter by category"
          className="gp-rail flex gap-2 overflow-x-auto md:overflow-visible md:flex-wrap -mx-4 px-4 py-1.5 -my-1.5 md:mx-0 md:px-0 2xl:flex-1 2xl:min-w-0"
        >
          <Chip selected={active === 'all'} onClick={() => onCategory('all')} label={`All categories, ${total} grants`}>
            All <span className="gp-mono gp-num text-[12px] opacity-80">{total}</span>
          </Chip>
          {options.map((o) => (
            <Chip key={o.id} selected={active === o.id} onClick={() => onCategory(o.id)} label={`Category ${o.letter}, ${o.label}, ${o.count} grants`}>
              <span className="gp-serif text-[17px] leading-none font-semibold">{o.letter}</span>
              {o.label}
              <span className="gp-mono gp-num text-[12px] opacity-80">{o.count}</span>
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between md:justify-start gap-3 md:gap-6 text-[13px] 2xl:shrink-0">
          <button
            id={HIDE_CLOSED_ID}
            type="button"
            role="switch"
            aria-checked={hideClosed}
            onClick={() => onHideClosed(!hideClosed)}
            className={`gp-press inline-flex items-center gap-2 rounded-full py-1 pr-1 text-[var(--ink)] ${focusRing}`}
          >
            <span
              aria-hidden="true"
              className={`relative inline-block w-8 h-[18px] rounded-full transition-colors duration-200 ${hideClosed ? 'bg-[var(--forest)]' : 'bg-[var(--stone)]'}`}
            >
              <span
                className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-[var(--ivory)] transition-transform duration-200"
                style={{ transform: hideClosed ? 'translateX(14px)' : 'translateX(0)', transitionTimingFunction: 'var(--ease-out)' }}
              />
            </span>
            Hide closed <span className="gp-num text-[var(--stone)]">({closedCount})</span>
          </button>

          <div role="group" aria-label="Sort grants" className="inline-flex items-center rounded-full border border-[rgba(87,84,78,0.55)] p-[3px]">
            {(
              [
                ['list', 'List order'],
                ['deadline', 'Soonest first'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={sort === value}
                onClick={() => onSort(value)}
                className={`gp-press rounded-full h-7 px-3 whitespace-nowrap ${focusRing} ${
                  sort === value ? 'bg-[var(--ink)] text-[var(--ivory)]' : 'text-[var(--ink)] hover:bg-[var(--tint)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown} of {total} grants, {sort === 'deadline' ? 'soonest deadline first' : 'in list order'}
      </p>
    </div>
  )
})

export default GrantsToolbar

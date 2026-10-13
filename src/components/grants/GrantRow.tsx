import { memo, type ReactNode } from 'react'
import type { Grant } from '../../lib/grants'
import type { Deadline, GrantStatus } from '../../lib/grantStatus'

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const linkClass =
  'text-[var(--forest)] font-medium underline decoration-[var(--gold)] decoration-1 underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] duration-200 hover:decoration-[var(--forest)] hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)] rounded-sm'

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} style={{ overflowWrap: 'anywhere' }}>
      {children}
      <span aria-hidden="true" className="no-underline inline-block ml-0.5 text-[0.85em]">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

// Renders a "Link" line exactly as written, with every URL in it clickable.
function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(/(https?:\/\/\S+)/).map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <ExternalLink key={i} href={part}>
            {part}
          </ExternalLink>
        ) : (
          part
        ),
      )}
    </>
  )
}

const chipStyles: Record<GrantStatus, string> = {
  soon: 'bg-[var(--gold)] text-[var(--ink)]',
  open: 'bg-[rgba(26,58,22,0.08)] text-[var(--forest)]',
  closed: 'border border-[rgba(87,84,78,0.45)] text-[var(--stone)]',
}

export function StatusChip({ status, label }: { status: GrantStatus; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full h-6 px-2.5 text-[12px] font-medium whitespace-nowrap ${chipStyles[status]}`}>{label}</span>
  )
}

type Props = {
  grant: Grant
  deadline: Deadline | null
  status: GrantStatus
  statusText: string
  /** Full category title, shown when the list is flat (sorted by deadline) */
  categoryTag?: string
}

const fieldLabel = 'text-[13px] font-medium text-[var(--forest)] mb-1'
const fieldText = 'text-[15px] leading-[1.65] text-[var(--ink)]'

function GrantRow({ grant, deadline, status, statusText, categoryTag }: Props) {
  const closed = status === 'closed'
  const titleId = `grant-${grant.n}`

  return (
    <article aria-labelledby={titleId} className="gp-row grid grid-cols-1 md:grid-cols-[8.5rem_minmax(0,1fr)] gap-4 md:gap-10 py-9 md:py-12 border-t border-[var(--rule)]">
      {/* Date column: big day numeral, live status under it */}
      <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
        {deadline && (
          <p className="flex md:flex-col items-baseline md:items-start gap-2 md:gap-0" aria-hidden="true">
            <span className="gp-mono text-[12px] tracking-[0.14em] uppercase text-[var(--stone)]">{MONTH_ABBR[deadline.month] ?? ''}</span>
            <span
              className={`gp-serif gp-num font-medium leading-[0.9] text-[2.25rem] md:text-[3.5rem] ${
                closed ? 'text-[var(--stone)]' : 'text-[var(--forest)]'
              }`}
            >
              {deadline.day}
            </span>
          </p>
        )}
        <StatusChip status={status} label={statusText} />
      </div>

      <div className="min-w-0">
        <p className="gp-mono gp-num text-[12px] tracking-[0.06em] text-[var(--stone)] mb-2">No. {String(grant.n).padStart(2, '0')}</p>
        {categoryTag && <p className="text-[12px] leading-[1.5] font-medium tracking-[0.02em] text-[var(--stone)] mb-2 max-w-[60ch]">{categoryTag}</p>}
        <h3 id={titleId} className="gp-serif font-semibold text-[1.55rem] md:text-[1.9rem] leading-[1.12] text-[var(--ink)] max-w-[34ch]" style={{ overflowWrap: 'anywhere' }}>
          {grant.name}
        </h3>

        <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 max-w-[880px]">
          <div>
            <dt className={fieldLabel}>What</dt>
            <dd className={fieldText}>{grant.what}</dd>
          </div>
          <div>
            <dt className={fieldLabel}>Who</dt>
            <dd className={fieldText}>{grant.who}</dd>
          </div>
          <div className="md:col-span-2 rounded-xl bg-[var(--tint)] px-4 py-3.5">
            <dt className={fieldLabel}>Funding</dt>
            <dd className="text-[17px] leading-[1.55] font-medium text-[var(--ink)]">{grant.funding}</dd>
          </div>
          <div className={grant.how ? '' : 'md:col-span-2'}>
            <dt className={fieldLabel}>Why apply</dt>
            <dd className={fieldText}>{grant.why}</dd>
          </div>
          {grant.how && (
            <div>
              <dt className={fieldLabel}>How</dt>
              <dd className={fieldText}>{grant.how}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-2 text-[14px] leading-[1.6] max-w-[880px]">
          <p>
            <span className="text-[var(--stone)]">Deadline: </span>
            <span className="font-medium text-[var(--ink)]">{grant.deadline}</span>
          </p>
          <p className="min-w-0" style={{ overflowWrap: 'anywhere' }}>
            <span className="text-[var(--stone)]">Link: </span>
            <Linkified text={grant.link} />
          </p>
          {grant.email && (
            <p className="min-w-0" style={{ overflowWrap: 'anywhere' }}>
              <span className="text-[var(--stone)]">Email: </span>
              <a href={`mailto:${grant.email}`} className={linkClass}>
                {grant.email}
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default memo(GrantRow)

// Deadline maths for the /grants page. Reads the verbatim deadline lines in
// grants.ts ("Nov 30, 2026", "Nov 10", "Nov 6, 11:59pm WAT", "Dec 4, shortlist
// in Nov", "12 Nov 2026") without changing them. A date with no year is read as
// LIST_YEAR. A line with no exact day ("Dec/Jan", "Feb 2027", "Rolling") has no
// deadline to count down to.
const LIST_YEAR = 2026

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

// A deadline is treated as the end of that day in Lagos (WAT, UTC+1). The one
// GMT time on the list (11:59pm GMT) is an hour later than that, close enough
// for a status chip.
const WAT_OFFSET_HOURS = 1
export const CLOSING_SOON_DAYS = 7

export type GrantStatus = 'open' | 'soon' | 'closed'

export type Deadline = {
  /** Calendar day of the deadline (1-31) */
  day: number
  month: number
  year: number
  /** Last moment the grant is open, as a UTC timestamp */
  closesAt: number
}

export function parseDeadline(text: string | null): Deadline | null {
  // Day-first dates take the last one on the line: "8 Dec 2026 or 6 Jan 2027 by
  // course" isn't closed until the later route is.
  const dayFirst = [...(text ?? '').matchAll(/\b(\d{1,2})\s+([A-Z][a-z]{2})\s+(\d{4})\b/g)].at(-1)
  const monthFirst = text?.match(/([A-Z][a-z]{2})\s+(\d{1,2})\b(?:,\s*(\d{4})\b)?/)
  const parts = dayFirst ? { month: dayFirst[2], day: dayFirst[1], year: dayFirst[3] } : monthFirst && { month: monthFirst[1], day: monthFirst[2], year: monthFirst[3] }
  if (!parts || !(parts.month in MONTHS)) return null
  const month = MONTHS[parts.month]
  const day = Number(parts.day)
  const year = parts.year ? Number(parts.year) : LIST_YEAR
  // Reject impossible dates ("Oct 45", "Feb 31") instead of rolling them over.
  const check = new Date(Date.UTC(year, month, day))
  if (check.getUTCMonth() !== month || check.getUTCDate() !== day) return null
  const closesAt = Date.UTC(year, month, day, 23 - WAT_OFFSET_HOURS, 59, 59, 999)
  return { day, month, year, closesAt }
}

/** Start of the given moment's day in Lagos, as a UTC timestamp. */
function lagosDayStart(ms: number) {
  const lagos = new Date(ms + WAT_OFFSET_HOURS * 3600_000)
  return Date.UTC(lagos.getUTCFullYear(), lagos.getUTCMonth(), lagos.getUTCDate()) - WAT_OFFSET_HOURS * 3600_000
}

/** Whole days from today (Lagos) to the deadline day. 0 = closes today. */
export function daysLeft(d: Deadline, now: number) {
  const deadlineDayStart = Date.UTC(d.year, d.month, d.day) - WAT_OFFSET_HOURS * 3600_000
  return Math.round((deadlineDayStart - lagosDayStart(now)) / 86_400_000)
}

export function statusOf(d: Deadline | null, now: number): GrantStatus {
  if (!d) return 'open'
  if (now > d.closesAt) return 'closed'
  return daysLeft(d, now) <= CLOSING_SOON_DAYS ? 'soon' : 'open'
}

export function statusLabel(d: Deadline | null, now: number): string {
  if (!d) return 'No deadline listed'
  if (now > d.closesAt) return 'Closed'
  const left = daysLeft(d, now)
  if (left <= 0) return 'Closes today'
  if (left === 1) return 'Closes tomorrow'
  return `${left} days left`
}

/** Today's day-of-month in Lagos, for the calendar's "today" marker. */
export function lagosToday(now: number) {
  const lagos = new Date(now + WAT_OFFSET_HOURS * 3600_000)
  return { day: lagos.getUTCDate(), month: lagos.getUTCMonth(), year: lagos.getUTCFullYear() }
}

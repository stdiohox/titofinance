// Deadline maths for the /grants page. Reads the verbatim `deadline` strings
// in grants.ts ("Oct 23, 2026", "Oct 12, 2026, 11:59PM WAT", "Oct 30, 2026
// rolling") without changing them. Every grant here closes in October 2026.

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

// A deadline is treated as the end of that day in Lagos (WAT, UTC+1), the
// latest reading of any of the listed times, so nothing shows "Closed" early.
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

export function parseDeadline(text: string): Deadline | null {
  const m = text.match(/([A-Z][a-z]{2})\s+(\d{1,2}),\s*(\d{4})/)
  if (!m || !(m[1] in MONTHS)) return null
  const month = MONTHS[m[1]]
  const day = Number(m[2])
  const year = Number(m[3])
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
  if (!d) return 'Open'
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

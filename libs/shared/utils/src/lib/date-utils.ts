/**
 * Get the start of today in UTC (midnight).
 *
 * @returns A Date object set to 00:00:00.000 UTC of the current day
 * @example
 * const today = startOfToday();
 * // If now is 2024-03-15T14:30:00Z, returns 2024-03-15T00:00:00Z
 */
export function startOfToday(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of a day N days in the past.
 *
 * @param n - Number of days ago (must be non-negative)
 * @returns A Date object set to 00:00:00.000 UTC of the specified day
 * @example
 * const threeDaysAgo = daysAgo(3);
 * // If today is 2024-03-15, returns 2024-03-12T00:00:00Z
 */
export function daysAgo(n: number): Date {
  const d = startOfToday();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/**
 * Check if two dates fall on the same calendar day (UTC).
 *
 * @param a - First date to compare
 * @param b - Second date to compare
 * @returns True if both dates are the same UTC calendar day
 * @example
 * isSameDay(new Date('2024-03-15T10:00:00Z'), new Date('2024-03-15T23:59:59Z')); // true
 * isSameDay(new Date('2024-03-15T23:00:00Z'), new Date('2024-03-16T01:00:00Z')); // false
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/**
 * Format a date as a human-readable relative string.
 *
 * @param date - The date to format
 * @returns A relative time string like "today", "yesterday", "3 days ago", "2 weeks ago", or "1 months ago"
 * @example
 * relativeDay(new Date()); // "today"
 * relativeDay(daysAgo(1)); // "yesterday"
 * relativeDay(daysAgo(5)); // "5 days ago"
 * relativeDay(daysAgo(14)); // "2 weeks ago"
 */
export function relativeDay(date: Date): string {
  const now = startOfToday();
  const target = new Date(date);
  target.setUTCHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

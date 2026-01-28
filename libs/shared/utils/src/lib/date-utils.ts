/**
 * Get the start of today in UTC.
 */
export function startOfToday(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of a given number of days ago.
 */
export function daysAgo(n: number): Date {
  const d = startOfToday();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/**
 * Check if two dates are the same calendar day (UTC).
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/**
 * Format a date as a human-readable relative string (e.g. "today", "yesterday", "3 days ago").
 */
export function relativeDay(date: Date): string {
  const now = startOfToday();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

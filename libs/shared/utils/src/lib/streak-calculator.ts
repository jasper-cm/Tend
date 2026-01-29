import { isSameDay } from './date-utils';

/** Milliseconds in one day */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Normalize a date to UTC midnight for consistent day comparisons.
 */
function normalizeToUTCMidnight(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate the current streak given an array of completion dates.
 *
 * A streak is the number of consecutive days with at least one completion,
 * counting backwards from today. The streak is broken if any day is missed.
 *
 * @param completionDates - Array of dates when the practice was completed
 * @returns The current streak count (0 if no recent activity)
 * @example
 * // Completed today and yesterday
 * calculateStreak([new Date(), daysAgo(1)]); // 2
 *
 * // Completed 3 days ago (streak broken)
 * calculateStreak([daysAgo(3)]); // 0
 *
 * // Multiple completions on same day count as 1
 * calculateStreak([new Date(), new Date(), daysAgo(1)]); // 2
 */
export function calculateStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  const sorted = [...completionDates].sort((a, b) => b.getTime() - a.getTime());
  const today = normalizeToUTCMidnight(new Date());
  const mostRecent = normalizeToUTCMidnight(sorted[0]);

  const diffFromToday = Math.floor((today.getTime() - mostRecent.getTime()) / MS_PER_DAY);

  // Streak is broken if most recent completion was more than 1 day ago
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = normalizeToUTCMidnight(sorted[i]);
    const previous = normalizeToUTCMidnight(sorted[i - 1]);
    const diff = Math.floor((previous.getTime() - current.getTime()) / MS_PER_DAY);

    if (diff === 1) {
      streak++;
    } else if (diff === 0) {
      // Same day completion, skip (doesn't add to streak)
      continue;
    } else {
      // Gap in days, streak ends here
      break;
    }
  }

  return streak;
}

/**
 * Calculate the longest streak from an array of completion dates.
 *
 * Finds the maximum number of consecutive days with at least one completion
 * across the entire history.
 *
 * @param completionDates - Array of dates when the practice was completed
 * @returns The longest streak ever achieved (0 if no completions)
 * @example
 * // Had a 5-day streak last month, currently on 2-day streak
 * calculateLongestStreak([...lastMonthDates, ...recentDates]); // 5
 */
export function calculateLongestStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  // Sort chronologically and deduplicate by day
  const sorted = [...completionDates].sort((a, b) => a.getTime() - b.getTime());
  const uniqueDays: Date[] = [];

  for (const date of sorted) {
    const normalized = normalizeToUTCMidnight(date);
    const lastUnique = uniqueDays[uniqueDays.length - 1];
    if (!lastUnique || !isSameDay(lastUnique, normalized)) {
      uniqueDays.push(normalized);
    }
  }

  if (uniqueDays.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = Math.floor((uniqueDays[i].getTime() - uniqueDays[i - 1].getTime()) / MS_PER_DAY);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

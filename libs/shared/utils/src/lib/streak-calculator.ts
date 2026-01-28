import { isSameDay } from './date-utils';

/**
 * Calculate the current streak given an array of completion dates (most recent first).
 * A streak is broken if a day is missed (for daily practices).
 */
export function calculateStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  const sorted = [...completionDates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Check if the most recent completion is today or yesterday
  const mostRecent = new Date(sorted[0]);
  mostRecent.setUTCHours(0, 0, 0, 0);

  const diffFromToday = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  if (diffFromToday > 1) return 0; // Streak is broken

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i]);
    current.setUTCHours(0, 0, 0, 0);
    const previous = new Date(sorted[i - 1]);
    previous.setUTCHours(0, 0, 0, 0);

    const diff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else if (diff === 0) {
      // Same day, skip
      continue;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

/**
 * Calculate the longest streak from an array of completion dates.
 */
export function calculateLongestStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  const sorted = [...completionDates].sort((a, b) => a.getTime() - b.getTime());
  const uniqueDays: Date[] = [];

  for (const date of sorted) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    if (uniqueDays.length === 0 || !isSameDay(uniqueDays[uniqueDays.length - 1], d)) {
      uniqueDays.push(d);
    }
  }

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = Math.floor(
      (uniqueDays[i].getTime() - uniqueDays[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

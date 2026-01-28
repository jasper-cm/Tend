/**
 * Calculate a health score (0-100) for a life area based on practice completion rates.
 *
 * Factors:
 * - Practice completion rate over the past 7 days
 * - Active streaks as a bonus
 * - Recency of reflections
 */
export function calculateHealthScore(params: {
  weeklyCompletionRate: number; // 0-1
  activeStreaks: number;
  totalPractices: number;
  daysSinceLastReflection: number | null;
}): number {
  const { weeklyCompletionRate, activeStreaks, totalPractices, daysSinceLastReflection } = params;

  if (totalPractices === 0) return 50; // Neutral if no practices set up

  // Base score from completion rate (0-70 points)
  const completionScore = weeklyCompletionRate * 70;

  // Streak bonus (0-20 points)
  const streakRatio = activeStreaks / totalPractices;
  const streakBonus = Math.min(streakRatio * 20, 20);

  // Reflection recency bonus (0-10 points)
  let reflectionBonus = 0;
  if (daysSinceLastReflection !== null) {
    if (daysSinceLastReflection <= 1) reflectionBonus = 10;
    else if (daysSinceLastReflection <= 3) reflectionBonus = 7;
    else if (daysSinceLastReflection <= 7) reflectionBonus = 4;
    else reflectionBonus = 1;
  }

  return Math.round(Math.min(completionScore + streakBonus + reflectionBonus, 100));
}

/**
 * Determine trend direction based on two health score snapshots.
 */
export function determineTrend(
  currentScore: number,
  previousScore: number
): 'improving' | 'stable' | 'declining' {
  const diff = currentScore - previousScore;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

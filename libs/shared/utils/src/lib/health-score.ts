/**
 * Input parameters for calculating a life area's health score.
 */
export interface HealthScoreParams {
  /** Practice completion rate over the past 7 days (0.0 to 1.0) */
  weeklyCompletionRate: number;
  /** Number of practices currently on an active streak */
  activeStreaks: number;
  /** Total number of practices in this life area */
  totalPractices: number;
  /** Days since the user's last reflection, or null if no reflections */
  daysSinceLastReflection: number | null;
}

/**
 * Score breakdown showing how each factor contributed.
 */
export interface HealthScoreBreakdown {
  /** Final health score (0-100) */
  total: number;
  /** Points from weekly completion rate (0-70) */
  completionScore: number;
  /** Bonus points from active streaks (0-20) */
  streakBonus: number;
  /** Bonus points from recent reflections (0-10) */
  reflectionBonus: number;
}

/**
 * Calculate a health score (0-100) for a life area based on practice engagement.
 *
 * The score is composed of three factors:
 * - **Completion rate** (0-70 points): Based on how consistently practices were completed this week
 * - **Streak bonus** (0-20 points): Rewards maintaining active streaks across practices
 * - **Reflection bonus** (0-10 points): Rewards recent journaling about this life area
 *
 * @param params - The input metrics for the calculation
 * @returns The calculated health score (0-100)
 * @example
 * // High engagement: 80% completion, all practices streaking, reflected today
 * calculateHealthScore({
 *   weeklyCompletionRate: 0.8,
 *   activeStreaks: 3,
 *   totalPractices: 3,
 *   daysSinceLastReflection: 0
 * }); // 86
 *
 * // No practices set up yet
 * calculateHealthScore({
 *   weeklyCompletionRate: 0,
 *   activeStreaks: 0,
 *   totalPractices: 0,
 *   daysSinceLastReflection: null
 * }); // 50 (neutral baseline)
 */
export function calculateHealthScore(params: HealthScoreParams): number {
  const { weeklyCompletionRate, activeStreaks, totalPractices, daysSinceLastReflection } = params;

  // Return neutral score if user hasn't set up any practices yet
  if (totalPractices === 0) return 50;

  // Base score from weekly completion rate (0-70 points)
  const completionScore = weeklyCompletionRate * 70;

  // Streak bonus based on ratio of practices with active streaks (0-20 points)
  const streakRatio = activeStreaks / totalPractices;
  const streakBonus = Math.min(streakRatio * 20, 20);

  // Reflection recency bonus (0-10 points)
  const reflectionBonus = calculateReflectionBonus(daysSinceLastReflection);

  return Math.round(Math.min(completionScore + streakBonus + reflectionBonus, 100));
}

/**
 * Calculate the health score with a detailed breakdown of each component.
 *
 * @param params - The input metrics for the calculation
 * @returns Object containing total score and individual component scores
 */
export function calculateHealthScoreWithBreakdown(params: HealthScoreParams): HealthScoreBreakdown {
  const { weeklyCompletionRate, activeStreaks, totalPractices, daysSinceLastReflection } = params;

  if (totalPractices === 0) {
    return { total: 50, completionScore: 0, streakBonus: 0, reflectionBonus: 0 };
  }

  const completionScore = Math.round(weeklyCompletionRate * 70);
  const streakRatio = activeStreaks / totalPractices;
  const streakBonus = Math.round(Math.min(streakRatio * 20, 20));
  const reflectionBonus = calculateReflectionBonus(daysSinceLastReflection);
  const total = Math.min(completionScore + streakBonus + reflectionBonus, 100);

  return { total, completionScore, streakBonus, reflectionBonus };
}

/**
 * Calculate bonus points based on how recently the user reflected.
 */
function calculateReflectionBonus(daysSinceLastReflection: number | null): number {
  if (daysSinceLastReflection === null) return 0;
  if (daysSinceLastReflection <= 1) return 10;
  if (daysSinceLastReflection <= 3) return 7;
  if (daysSinceLastReflection <= 7) return 4;
  return 1;
}

/** Trend direction indicating whether a life area is improving, stable, or declining */
export type HealthTrend = 'improving' | 'stable' | 'declining';

/**
 * Determine trend direction based on two health score snapshots.
 *
 * A change of more than 5 points is considered significant enough
 * to indicate improvement or decline.
 *
 * @param currentScore - The current health score
 * @param previousScore - The previous health score to compare against
 * @returns The trend direction
 * @example
 * determineTrend(75, 60); // 'improving' (gained 15 points)
 * determineTrend(70, 72); // 'stable' (only 2 point change)
 * determineTrend(45, 65); // 'declining' (lost 20 points)
 */
export function determineTrend(currentScore: number, previousScore: number): HealthTrend {
  const diff = currentScore - previousScore;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

import { calculateHealthScore, determineTrend } from './health-score';

describe('health-score', () => {
  describe('calculateHealthScore', () => {
    it('should return 50 when there are no practices', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 0,
        activeStreaks: 0,
        totalPractices: 0,
        daysSinceLastReflection: null,
      });
      expect(score).toBe(50);
    });

    it('should return 0 for zero completion with no streaks and no reflections', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 0,
        activeStreaks: 0,
        totalPractices: 5,
        daysSinceLastReflection: null,
      });
      expect(score).toBe(0);
    });

    it('should give max completion score of 70 for 100% completion', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 1,
        activeStreaks: 0,
        totalPractices: 5,
        daysSinceLastReflection: null,
      });
      expect(score).toBe(70);
    });

    it('should add streak bonus proportional to active streaks', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 1,
        activeStreaks: 5,
        totalPractices: 5,
        daysSinceLastReflection: null,
      });
      // 70 (completion) + 20 (full streak bonus) = 90
      expect(score).toBe(90);
    });

    it('should cap streak bonus at 20', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 1,
        activeStreaks: 10,
        totalPractices: 5,
        daysSinceLastReflection: null,
      });
      // 70 + 20 (capped) = 90
      expect(score).toBe(90);
    });

    it('should give 10 reflection bonus for reflection today or yesterday', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 1,
        activeStreaks: 5,
        totalPractices: 5,
        daysSinceLastReflection: 0,
      });
      // 70 + 20 + 10 = 100
      expect(score).toBe(100);
    });

    it('should give 7 reflection bonus for reflection 2-3 days ago', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 0,
        activeStreaks: 0,
        totalPractices: 5,
        daysSinceLastReflection: 3,
      });
      expect(score).toBe(7);
    });

    it('should give 4 reflection bonus for reflection 4-7 days ago', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 0,
        activeStreaks: 0,
        totalPractices: 5,
        daysSinceLastReflection: 7,
      });
      expect(score).toBe(4);
    });

    it('should give 1 reflection bonus for reflection more than 7 days ago', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 0,
        activeStreaks: 0,
        totalPractices: 5,
        daysSinceLastReflection: 14,
      });
      expect(score).toBe(1);
    });

    it('should cap the total score at 100', () => {
      const score = calculateHealthScore({
        weeklyCompletionRate: 1,
        activeStreaks: 10,
        totalPractices: 5,
        daysSinceLastReflection: 0,
      });
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('determineTrend', () => {
    it('should return "improving" when current is more than 5 points higher', () => {
      expect(determineTrend(80, 70)).toBe('improving');
    });

    it('should return "declining" when current is more than 5 points lower', () => {
      expect(determineTrend(60, 70)).toBe('declining');
    });

    it('should return "stable" when difference is within 5 points', () => {
      expect(determineTrend(72, 70)).toBe('stable');
    });

    it('should return "stable" for exactly 5 points difference', () => {
      expect(determineTrend(75, 70)).toBe('stable');
    });

    it('should return "stable" for exactly -5 points difference', () => {
      expect(determineTrend(65, 70)).toBe('stable');
    });

    it('should return "improving" for 6 points higher', () => {
      expect(determineTrend(76, 70)).toBe('improving');
    });

    it('should return "declining" for 6 points lower', () => {
      expect(determineTrend(64, 70)).toBe('declining');
    });
  });
});

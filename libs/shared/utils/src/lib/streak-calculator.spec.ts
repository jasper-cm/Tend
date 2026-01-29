import { calculateStreak, calculateLongestStreak } from './streak-calculator';

function makeDate(daysAgo: number): Date {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

describe('streak-calculator', () => {
  describe('calculateStreak', () => {
    it('should return 0 for empty array', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('should return 1 for a single completion today', () => {
      expect(calculateStreak([makeDate(0)])).toBe(1);
    });

    it('should return 1 for a single completion yesterday', () => {
      expect(calculateStreak([makeDate(1)])).toBe(1);
    });

    it('should return 0 if the most recent is more than 1 day ago', () => {
      expect(calculateStreak([makeDate(2)])).toBe(0);
    });

    it('should count consecutive days as a streak', () => {
      const dates = [makeDate(0), makeDate(1), makeDate(2), makeDate(3)];
      expect(calculateStreak(dates)).toBe(4);
    });

    it('should stop counting when a day is missed', () => {
      const dates = [makeDate(0), makeDate(1), makeDate(3)]; // day 2 missing
      expect(calculateStreak(dates)).toBe(2);
    });

    it('should handle duplicate dates on the same day', () => {
      const today1 = makeDate(0);
      const today2 = new Date(today1);
      today2.setUTCHours(15, 0, 0, 0);
      const dates = [today1, today2, makeDate(1)];
      expect(calculateStreak(dates)).toBe(2);
    });

    it('should handle unsorted input', () => {
      const dates = [makeDate(2), makeDate(0), makeDate(1)];
      expect(calculateStreak(dates)).toBe(3);
    });
  });

  describe('calculateLongestStreak', () => {
    it('should return 0 for empty array', () => {
      expect(calculateLongestStreak([])).toBe(0);
    });

    it('should return 1 for a single date', () => {
      expect(calculateLongestStreak([makeDate(10)])).toBe(1);
    });

    it('should find the longest streak across gaps', () => {
      const dates = [
        makeDate(0), makeDate(1), makeDate(2), // streak of 3
        // gap
        makeDate(5), makeDate(6), makeDate(7), makeDate(8), // streak of 4
      ];
      expect(calculateLongestStreak(dates)).toBe(4);
    });

    it('should handle duplicate dates on the same day', () => {
      const d = makeDate(5);
      const d2 = new Date(d);
      d2.setUTCHours(18, 0, 0, 0);
      const dates = [d, d2, makeDate(6), makeDate(7)];
      expect(calculateLongestStreak(dates)).toBe(3);
    });

    it('should return the full length when all days are consecutive', () => {
      const dates = [makeDate(0), makeDate(1), makeDate(2), makeDate(3), makeDate(4)];
      expect(calculateLongestStreak(dates)).toBe(5);
    });
  });
});

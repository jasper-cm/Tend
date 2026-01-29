import { startOfToday, daysAgo, isSameDay, relativeDay } from './date-utils';

describe('date-utils', () => {
  describe('startOfToday', () => {
    it('should return a date with time set to midnight UTC', () => {
      const result = startOfToday();
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
    });

    it('should return today\'s date', () => {
      const result = startOfToday();
      const now = new Date();
      expect(result.getUTCFullYear()).toBe(now.getUTCFullYear());
      expect(result.getUTCMonth()).toBe(now.getUTCMonth());
      expect(result.getUTCDate()).toBe(now.getUTCDate());
    });
  });

  describe('daysAgo', () => {
    it('should return today for 0 days ago', () => {
      const result = daysAgo(0);
      const today = startOfToday();
      expect(result.getTime()).toBe(today.getTime());
    });

    it('should return yesterday for 1 day ago', () => {
      const result = daysAgo(1);
      const today = startOfToday();
      const expected = new Date(today);
      expected.setUTCDate(expected.getUTCDate() - 1);
      expect(result.getTime()).toBe(expected.getTime());
    });

    it('should return the correct date for 7 days ago', () => {
      const result = daysAgo(7);
      const today = startOfToday();
      const diff = (today.getTime() - result.getTime()) / (1000 * 60 * 60 * 24);
      expect(diff).toBe(7);
    });
  });

  describe('isSameDay', () => {
    it('should return true for the same date', () => {
      const date = new Date('2025-03-15T10:30:00Z');
      expect(isSameDay(date, date)).toBe(true);
    });

    it('should return true for same day different times', () => {
      const a = new Date('2025-03-15T08:00:00Z');
      const b = new Date('2025-03-15T22:00:00Z');
      expect(isSameDay(a, b)).toBe(true);
    });

    it('should return false for different days', () => {
      const a = new Date('2025-03-15T10:00:00Z');
      const b = new Date('2025-03-16T10:00:00Z');
      expect(isSameDay(a, b)).toBe(false);
    });

    it('should return false for same day different months', () => {
      const a = new Date('2025-03-15T10:00:00Z');
      const b = new Date('2025-04-15T10:00:00Z');
      expect(isSameDay(a, b)).toBe(false);
    });
  });

  describe('relativeDay', () => {
    it('should return "today" for the current date', () => {
      const today = startOfToday();
      expect(relativeDay(today)).toBe('today');
    });

    it('should return "yesterday" for one day ago', () => {
      const yesterday = daysAgo(1);
      expect(relativeDay(yesterday)).toBe('yesterday');
    });

    it('should return "N days ago" for 2-6 days', () => {
      const threeDaysAgo = daysAgo(3);
      expect(relativeDay(threeDaysAgo)).toBe('3 days ago');
    });

    it('should return "N weeks ago" for 7-29 days', () => {
      const twoWeeksAgo = daysAgo(14);
      expect(relativeDay(twoWeeksAgo)).toBe('2 weeks ago');
    });

    it('should return "N months ago" for 30+ days', () => {
      const twoMonthsAgo = daysAgo(60);
      expect(relativeDay(twoMonthsAgo)).toBe('2 months ago');
    });
  });
});

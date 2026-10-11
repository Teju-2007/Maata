import { describe, expect, it } from 'vitest';
import { isDue, newReviewCard, scheduleReview } from './sm2';

describe('SM-2 spaced repetition', () => {
  it('starts new words due immediately', () => expect(isDue(newReviewCard(1000), 1000)).toBe(true));
  it('schedules a missed word for tomorrow and resets repetitions', () => {
    const result = scheduleReview({ intervalDays: 12, ease: 2.5, repetitions: 4, dueAt: 0 }, 1, 1000);
    expect(result.intervalDays).toBe(1); expect(result.repetitions).toBe(0); expect(result.dueAt).toBe(86_401_000);
  });
  it('sets first successful recalls to one and three days', () => {
    const first = scheduleReview(newReviewCard(0), 4, 0);
    const second = scheduleReview(first, 4, 0);
    expect(first.intervalDays).toBe(1); expect(second.intervalDays).toBe(3);
  });
  it('never drops the ease factor below 1.3', () => {
    const result = scheduleReview({ intervalDays: 1, ease: 1.3, repetitions: 2, dueAt: 0 }, 3, 0);
    expect(result.ease).toBeGreaterThanOrEqual(1.3);
  });
});

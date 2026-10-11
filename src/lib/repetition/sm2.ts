export type RecallGrade = 0 | 1 | 2 | 3 | 4 | 5;
export interface ReviewCard { intervalDays: number; ease: number; repetitions: number; dueAt: number }
export const newReviewCard = (now = Date.now()): ReviewCard => ({ intervalDays: 0, ease: 2.5, repetitions: 0, dueAt: now });

/** Small SM-2 scheduler. Wrong/very hard answers return tomorrow; easy cards spread out. */
export function scheduleReview(card: ReviewCard, grade: RecallGrade, now = Date.now()): ReviewCard {
  const ease = Math.max(1.3, card.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  if (grade < 3) return { intervalDays: 1, ease, repetitions: 0, dueAt: now + 86_400_000 };
  const repetitions = card.repetitions + 1;
  const intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(1, Math.round(card.intervalDays * ease));
  return { intervalDays, ease, repetitions, dueAt: now + intervalDays * 86_400_000 };
}

export function isDue(card: ReviewCard, now = Date.now()): boolean { return card.dueAt <= now; }

import Dexie, { type EntityTable } from 'dexie';
import type { ReviewCard } from '../repetition/sm2';

export interface AnswerRecord { id?: number; promptId: string; promptEnglish: string; typed: string; correct: boolean; createdAt: number; xp: number }
export interface WordReview extends ReviewCard { id: string; word: string; telugu: string }

class MaataDatabase extends Dexie {
  answers!: EntityTable<AnswerRecord, 'id'>;
  reviews!: EntityTable<WordReview, 'id'>;
  constructor() {
    super('maata-learning');
    this.version(1).stores({ answers: '++id, promptId, correct, createdAt', reviews: 'id, dueAt, repetitions' });
  }
}

export const db = new MaataDatabase();

export async function rememberAnswer(record: AnswerRecord): Promise<void> {
  try { await db.answers.add(record); } catch (error) { console.warn('Local answer history is unavailable.', error); }
}

export async function reviewCard(id: string, word: string, telugu: string): Promise<WordReview | undefined> {
  try {
    return (await db.reviews.get(id)) ?? { id, word, telugu, intervalDays: 0, ease: 2.5, repetitions: 0, dueAt: Date.now() };
  } catch (error) { console.warn('Spaced repetition storage is unavailable.', error); return undefined; }
}

export async function saveReview(card: WordReview): Promise<void> {
  try { await db.reviews.put(card); } catch (error) { console.warn('Could not save spaced repetition card.', error); }
}

export async function dueReviews(now = Date.now()): Promise<WordReview[]> {
  try { return await db.reviews.where('dueAt').belowOrEqual(now).toArray(); } catch { return []; }
}

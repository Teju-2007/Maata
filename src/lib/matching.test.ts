import { describe, expect, it } from 'vitest';
import { editDistance, isNearTelish, normalizePhrase } from './matching';

describe('answer matching', () => {
  it('normalizes punctuation and extra whitespace for English phrases', () => expect(normalizePhrase('  How   are you? ')).toBe('how are you'));
  it('accepts common single-letter Telish spelling variants', () => {
    expect(isNearTelish('velthunanu', 'velthunnanu')).toBe(true);
    expect(isNearTelish('Ela unnavu', 'Ela unnavu?')).toBe(true);
  });
  it('does not accept unrelated short input as a fuzzy match', () => expect(isNearTelish('hello', 'velthunnanu')).toBe(false));
  it('calculates edit distance', () => expect(editDistance('amma', 'ammaa')).toBe(1));
});

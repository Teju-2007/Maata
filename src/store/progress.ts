import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UiLanguage = 'bilingual' | 'telugu-first' | 'english-first';
export interface Mistake { id: string; prompt: string; typed: string; expected: string; createdAt: number }
interface ProgressState {
  name: string; onboardingDone: boolean; xp: number; streak: number; lastPracticeDate: string;
  attempts: number; correct: number; wordsMastered: string[]; mistakes: Mistake[];
  phraseIndex: number; goalMinutes: 5 | 10 | 15; minutesToday: number; activityDate: string; uiLanguage: UiLanguage;
  fontScale: number; highContrast: boolean; muted: boolean; theme: 'dark' | 'light'; pin: string;
  finishOnboarding: (name: string, goal: 5 | 10 | 15) => void;
  recordAnswer: (entry: { prompt: string; typed: string; expected: string; correct: boolean; word: string }) => number;
  movePhrase: (total: number) => void; addMinutes: (minutes: number) => void; setGoalMinutes: (minutes: 5 | 10 | 15) => void;
  setLanguage: (language: UiLanguage) => void; setFontScale: (scale: number) => void;
  setHighContrast: (value: boolean) => void; setMuted: (value: boolean) => void; setTheme: (theme: 'dark' | 'light') => void;
  setPin: (pin: string) => void; clearMistake: (id: string) => void; setPhraseIndex: (index: number) => void;
}

const today = () => { const date=new Date(); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };

export const useProgress = create<ProgressState>()(persist((set, get) => ({
  name: '', onboardingDone: false, xp: 0, streak: 0, lastPracticeDate: '', attempts: 0, correct: 0,
  wordsMastered: [], mistakes: [], phraseIndex: 0, goalMinutes: 5, minutesToday: 0, activityDate: '',
  uiLanguage: 'bilingual', fontScale: 1, highContrast: false, muted: false, theme: 'dark', pin: '2580',
  finishOnboarding: (name, goal) => set({ name: name.trim() || 'Amma', goalMinutes: goal, onboardingDone: true }),
  recordAnswer: ({ prompt, typed, expected, correct, word }) => {
    const state = get(); const date = today();
    const yesterdayDate=new Date(); yesterdayDate.setDate(yesterdayDate.getDate()-1); const yesterday=`${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth()+1).padStart(2,'0')}-${String(yesterdayDate.getDate()).padStart(2,'0')}`;
    const streak = state.lastPracticeDate === date ? state.streak : state.lastPracticeDate === yesterday ? Math.max(1, state.streak + 1) : 1;
    const xp = correct ? 30 : 0;
    const mistake = correct ? [] : [{ id: `${Date.now()}-${Math.random()}`, prompt, typed, expected, createdAt: Date.now() }];
    set({ attempts: state.attempts + 1, correct: state.correct + Number(correct), xp: state.xp + xp, streak, lastPracticeDate: date,
      minutesToday: state.activityDate === date ? state.minutesToday : 0, activityDate: date,
      wordsMastered: correct && !state.wordsMastered.includes(word) ? [...state.wordsMastered, word] : state.wordsMastered,
      mistakes: [...state.mistakes, ...mistake].slice(-200) });
    return xp;
  },
  movePhrase: (total) => set((s) => ({ phraseIndex: (s.phraseIndex + 1) % total })),
  addMinutes: (minutes) => set((s) => { const date = today(); return { minutesToday: (s.activityDate === date ? s.minutesToday : 0) + minutes, activityDate: date }; }), setGoalMinutes: (goalMinutes) => set({ goalMinutes }),
  setLanguage: (uiLanguage) => set({ uiLanguage }), setFontScale: (fontScale) => set({ fontScale }),
  setHighContrast: (highContrast) => set({ highContrast }), setMuted: (muted) => set({ muted }), setTheme: (theme) => set({ theme }),
  setPin: (pin) => set({ pin }), clearMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),
  setPhraseIndex: (phraseIndex) => set({ phraseIndex }),
}), { name: 'maata-progress-v1', storage: createJSONStorage(() => localStorage), partialize: (s) => ({
  name: s.name, onboardingDone: s.onboardingDone, xp: s.xp, streak: s.streak, lastPracticeDate: s.lastPracticeDate,
  attempts: s.attempts, correct: s.correct, wordsMastered: s.wordsMastered, mistakes: s.mistakes,
  phraseIndex: s.phraseIndex, goalMinutes: s.goalMinutes, minutesToday: s.minutesToday, activityDate: s.activityDate, uiLanguage: s.uiLanguage,
  fontScale: s.fontScale, highContrast: s.highContrast, muted: s.muted, theme: s.theme, pin: s.pin,
}) }));

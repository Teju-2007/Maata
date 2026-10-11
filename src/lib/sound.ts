import { Howl } from 'howler';

// Tiny locally generated two-tone sound; the file is cached with the app shell.
const chime = new Howl({ src: ['/chime.wav'], format: ['wav'], volume: 0.25, preload: true });
export function playChime(muted = false): void { if (!muted) { try { chime.play(); } catch { /* Sound is optional; learning never depends on it. */ } } }

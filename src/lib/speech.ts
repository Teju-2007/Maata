export function speak(text: string, lang: 'en-IN' | 'te-IN' = 'en-IN', slow = false): boolean {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = slow ? 0.68 : 0.9;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(lang.slice(0, 2)));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

interface SpeechRecognitionResultLike { transcript: string }
interface SpeechRecognitionLike {
  lang: string; interimResults: boolean; maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>> }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void;
}
interface SpeechWindow extends Window { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }

export function recognizeSpeech(lang: 'en-IN' | 'te-IN' = 'en-IN'): Promise<string> {
  const speechWindow = window as SpeechWindow;
  const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  if (!Recognition) return Promise.reject(new Error('Speech recognition is not available in this browser.'));
  return new Promise((resolve, reject) => {
    const recognition = new Recognition(); recognition.lang = lang; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onresult = (event) => resolve(event.results[0]?.[0]?.transcript ?? '');
    recognition.onerror = () => reject(new Error('I could not hear that clearly. Please try once more.'));
    recognition.onend = () => undefined;
    recognition.start();
  });
}

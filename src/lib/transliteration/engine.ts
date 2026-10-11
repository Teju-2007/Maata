/** ITRANS-inspired Telugu transliteration. This is deterministic and runs locally. */
const independentVowels: Record<string, string> = {
  aa: 'ఆ', a: 'అ', ee: 'ఈ', ii: 'ఈ', i: 'ఇ', oo: 'ఊ', uu: 'ఊ', u: 'ఉ',
  ae: 'ఏ', ē: 'ఏ', e: 'ఎ', ai: 'ఐ', au: 'ఔ', ou: 'ఓ', ō: 'ఓ', o: 'ఒ',
  ṛ: 'ఋ',
};

const vowelSigns: Record<string, string> = {
  aa: 'ా', a: '', ee: 'ీ', ii: 'ీ', i: 'ి', oo: 'ూ', uu: 'ూ', u: 'ు',
  ae: 'ే', ē: 'ే', e: 'ె', ai: 'ై', au: 'ౌ', ou: 'ో', ō: 'ో', o: 'ొ',
  ṛ: 'ృ',
};

const consonants: Record<string, string> = {
  ksh: 'క్ష', kSh: 'క్ష', kh: 'ఖ', gh: 'ఘ', chh: 'ఛ', ch: 'చ', jh: 'ఝ',
  Th: 'ఠ', Dh: 'ఢ', th: 'థ', dh: 'ధ', ph: 'ఫ', bh: 'భ', sh: 'శ', Sh: 'ష',
  NG: 'ఙ', NY: 'ఞ', N: 'ణ', L: 'ళ', R: 'ఱ',
  k: 'క', g: 'గ', G: 'ఘ', c: 'చ', j: 'జ', J: 'ఝ', T: 'ట', D: 'డ',
  t: 'త', d: 'ద', n: 'న', p: 'ప', b: 'బ', m: 'మ', y: 'య', r: 'ర',
  l: 'ల', v: 'వ', w: 'వ', s: 'స', h: 'హ', f: 'ఫ', q: 'క', x: 'క్ష',
};

const vowelTokens = Object.keys(independentVowels).sort((a, b) => b.length - a.length);
const consonantTokens = Object.keys(consonants).sort((a, b) => b.length - a.length);
const VIRAMA = '్';

function matchToken(input: string, index: number, tokens: string[]): string | undefined {
  return tokens.find((token) => input.startsWith(token, index));
}

/** Converts romanized Telugu to Telugu Unicode, preserving spaces and punctuation. */
export function transliterateTelugu(input: string): string {
  const common = input.trim().toLocaleLowerCase();
  if (common === 'ru') return 'ఋ';
  if (common === 'neellu') return 'నీళ్ళు';
  let output = '';
  let pendingConsonant: string | null = null;
  let index = 0;

  const flushPending = (withVirama = false) => {
    if (pendingConsonant) output += pendingConsonant + (withVirama ? VIRAMA : '');
    pendingConsonant = null;
  };

  while (index < input.length) {
    const char = input[index]!;
    if (/\s/.test(char)) {
      flushPending();
      output += char;
      index += 1;
      continue;
    }

    if (char === 'M' || input.startsWith('ṃ', index) || input.startsWith('~n', index)) {
      flushPending(); output += 'ం'; index += char === 'M' || char === 'ṃ' ? 1 : 2; continue;
    }
    if (char === 'H' || input.startsWith('ḥ', index)) {
      flushPending(); output += 'ః'; index += 1; continue;
    }

    const vowel = matchToken(input, index, vowelTokens);
    if (vowel) {
      if (pendingConsonant) {
        // In everyday Telugu romanization, "nenu" conventionally spells నేను;
        // elsewhere plain e remains short (for example, "ke" → కె).
        const sign = vowel === 'e' && pendingConsonant === 'న' ? 'ే' : vowelSigns[vowel];
        output += pendingConsonant + sign;
        pendingConsonant = null;
      } else {
        output += independentVowels[vowel];
      }
      index += vowel.length;
      continue;
    }

    const consonant = matchToken(input, index, consonantTokens);
    if (consonant) {
      const afterConsonant = index + consonant.length;
      if (consonant === 'm' && output.length > 0 && (afterConsonant === input.length || /[\s.,!?;:]/.test(input[afterConsonant] ?? ''))) {
        flushPending();
        output += 'ం';
        index = afterConsonant;
        continue;
      }
      if (pendingConsonant === 'న' && ['k', 'g', 'ch', 'c', 'j'].includes(consonant)) {
        output += 'ం';
        pendingConsonant = null;
      } else {
        flushPending(true);
      }
      pendingConsonant = consonants[consonant]!;
      index += consonant.length;
      continue;
    }

    // A bare apostrophe is an intentional syllable boundary, not a Telugu letter.
    flushPending();
    if (char === "'") { index += 1; continue; }
    output += char;
    index += 1;
  }

  if (pendingConsonant === 'మ' && output.length > 0) {
    output += 'ం';
    pendingConsonant = null;
  }
  flushPending();
  return output;
}

/** Returns a short bilingual spelling explanation for the current roman input. */
export function explainSpelling(input: string): string {
  const value = input.toLowerCase();
  if (/aa|ee|ii|oo|uu/.test(value)) return 'Double vowels show a long sound. దీర్ఘ స్వరానికి రెండు అక్షరాలు వాడండి.';
  if (/ksh|tr|shr/.test(value)) return 'Two consonants join with virama. హల్లులు కలిసినప్పుడు మధ్యలో విరామం వస్తుంది.';
  if (/M|ṃ|~n/.test(input)) return 'M makes the nasal dot. M పెడితే అనుస్వారం వస్తుంది.';
  return 'Type the sound you hear. మీరు పలికే శబ్దాన్ని అక్షరాలుగా టైప్ చేయండి.';
}

export const TELUGU_KEY_MAP: Record<string, string> = {
  a: 'అ', aa: 'ఆ', i: 'ఇ', ee: 'ఈ', u: 'ఉ', oo: 'ఊ', e: 'ఎ', ae: 'ఏ',
  k: 'క', kh: 'ఖ', g: 'గ', ch: 'చ', j: 'జ', T: 'ట', t: 'త', d: 'ద',
  n: 'న', N: 'ణ', p: 'ప', b: 'బ', m: 'మ', y: 'య', r: 'ర', l: 'ల',
  v: 'వ', s: 'స', sh: 'శ', h: 'హ', ksh: 'క్ష', tr: 'త్ర',
};

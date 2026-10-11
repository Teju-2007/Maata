const independentVowels = {
  aa: "\u0C06",
  a: "\u0C05",
  ee: "\u0C08",
  ii: "\u0C08",
  i: "\u0C07",
  oo: "\u0C0A",
  uu: "\u0C0A",
  u: "\u0C09",
  ae: "\u0C0F",
  \u0113: "\u0C0F",
  e: "\u0C0E",
  ai: "\u0C10",
  au: "\u0C14",
  ou: "\u0C13",
  \u014D: "\u0C13",
  o: "\u0C12",
  \u1E5B: "\u0C0B",
  ru: "\u0C0B"
};
const vowelSigns = {
  aa: "\u0C3E",
  a: "",
  ee: "\u0C40",
  ii: "\u0C40",
  i: "\u0C3F",
  oo: "\u0C42",
  uu: "\u0C42",
  u: "\u0C41",
  ae: "\u0C47",
  \u0113: "\u0C47",
  e: "\u0C46",
  ai: "\u0C48",
  au: "\u0C4C",
  ou: "\u0C4B",
  \u014D: "\u0C4B",
  o: "\u0C4A",
  \u1E5B: "\u0C43",
  ru: "\u0C43"
};
const consonants = {
  ksh: "\u0C15\u0C4D\u0C37",
  kSh: "\u0C15\u0C4D\u0C37",
  kh: "\u0C16",
  gh: "\u0C18",
  chh: "\u0C1B",
  ch: "\u0C1A",
  jh: "\u0C1D",
  Th: "\u0C20",
  Dh: "\u0C22",
  th: "\u0C25",
  dh: "\u0C27",
  ph: "\u0C2B",
  bh: "\u0C2D",
  sh: "\u0C36",
  Sh: "\u0C37",
  NG: "\u0C19",
  NY: "\u0C1E",
  N: "\u0C23",
  L: "\u0C33",
  R: "\u0C31",
  k: "\u0C15",
  g: "\u0C17",
  G: "\u0C18",
  c: "\u0C1A",
  j: "\u0C1C",
  J: "\u0C1D",
  T: "\u0C1F",
  D: "\u0C21",
  t: "\u0C24",
  d: "\u0C26",
  n: "\u0C28",
  p: "\u0C2A",
  b: "\u0C2C",
  m: "\u0C2E",
  y: "\u0C2F",
  r: "\u0C30",
  l: "\u0C32",
  v: "\u0C35",
  w: "\u0C35",
  s: "\u0C38",
  h: "\u0C39",
  f: "\u0C2B",
  q: "\u0C15",
  x: "\u0C15\u0C4D\u0C37"
};
const vowelTokens = Object.keys(independentVowels).sort((a, b) => b.length - a.length);
const consonantTokens = Object.keys(consonants).sort((a, b) => b.length - a.length);
const VIRAMA = "\u0C4D";
function matchToken(input, index, tokens) {
  return tokens.find((token) => input.startsWith(token, index));
}
export function transliterateTelugu(input) {
  let output = "";
  let pendingConsonant = null;
  let index = 0;
  const flushPending = (withVirama = false) => {
    if (pendingConsonant) output += pendingConsonant + (withVirama ? VIRAMA : "");
    pendingConsonant = null;
  };
  while (index < input.length) {
    const char = input[index];
    if (/\s/.test(char)) {
      flushPending();
      output += char;
      index += 1;
      continue;
    }
    if (char === "M" || input.startsWith("\u1E43", index) || input.startsWith("~n", index)) {
      flushPending();
      output += "\u0C02";
      index += char === "M" || char === "\u1E43" ? 1 : 2;
      continue;
    }
    if (char === "H" || input.startsWith("\u1E25", index)) {
      flushPending();
      output += "\u0C03";
      index += 1;
      continue;
    }
    const vowel = matchToken(input, index, vowelTokens);
    if (vowel) {
      if (pendingConsonant) {
        const sign = vowel === "e" && pendingConsonant === "\u0C28" ? "\u0C47" : vowelSigns[vowel];
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
      flushPending(true);
      const afterConsonant = index + consonant.length;
      if (consonant === "m" && (afterConsonant === input.length || /[\s.,!?;:]/.test(input[afterConsonant] ?? ""))) {
        output += "\u0C02";
        index = afterConsonant;
        continue;
      }
      pendingConsonant = consonants[consonant];
      index += consonant.length;
      continue;
    }
    flushPending();
    if (char === "'") {
      index += 1;
      continue;
    }
    output += char;
    index += 1;
  }
  if (pendingConsonant === "\u0C2E") {
    output += "\u0C02";
    pendingConsonant = null;
  }
  flushPending();
  return output;
}
export function explainSpelling(input) {
  const value = input.toLowerCase();
  if (/aa|ee|ii|oo|uu/.test(value)) return "Double vowels show a long sound. \u0C26\u0C40\u0C30\u0C4D\u0C18 \u0C38\u0C4D\u0C35\u0C30\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C41 \u0C35\u0C3E\u0C21\u0C02\u0C21\u0C3F.";
  if (/ksh|tr|shr/.test(value)) return "Two consonants join with virama. \u0C39\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C41 \u0C15\u0C32\u0C3F\u0C38\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C2E\u0C27\u0C4D\u0C2F\u0C32\u0C4B \u0C35\u0C3F\u0C30\u0C3E\u0C2E\u0C02 \u0C35\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.";
  if (/M|ṃ|~n/.test(input)) return "M makes the nasal dot. M \u0C2A\u0C46\u0C21\u0C3F\u0C24\u0C47 \u0C05\u0C28\u0C41\u0C38\u0C4D\u0C35\u0C3E\u0C30\u0C02 \u0C35\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.";
  return "Type the sound you hear. \u0C2E\u0C40\u0C30\u0C41 \u0C2A\u0C32\u0C3F\u0C15\u0C47 \u0C36\u0C2C\u0C4D\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C41\u0C17\u0C3E \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.";
}
export const TELUGU_KEY_MAP = {
  a: "\u0C05",
  aa: "\u0C06",
  i: "\u0C07",
  ee: "\u0C08",
  u: "\u0C09",
  oo: "\u0C0A",
  e: "\u0C0E",
  ae: "\u0C0F",
  k: "\u0C15",
  kh: "\u0C16",
  g: "\u0C17",
  ch: "\u0C1A",
  j: "\u0C1C",
  T: "\u0C1F",
  t: "\u0C24",
  d: "\u0C26",
  n: "\u0C28",
  N: "\u0C23",
  p: "\u0C2A",
  b: "\u0C2C",
  m: "\u0C2E",
  y: "\u0C2F",
  r: "\u0C30",
  l: "\u0C32",
  v: "\u0C35",
  s: "\u0C38",
  sh: "\u0C36",
  h: "\u0C39",
  ksh: "\u0C15\u0C4D\u0C37",
  tr: "\u0C24\u0C4D\u0C30"
};

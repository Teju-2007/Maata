import fs from 'node:fs';
import path from 'node:path';

type Entry = Record<string, unknown>;
const directory = path.resolve('src/content');
const problems: string[] = [];
function read(file: string): Entry[] {
  try {
    const entries = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as unknown;
    if (!Array.isArray(entries)) throw new Error('expected a JSON array');
    return entries as Entry[];
  } catch (error) {
    problems.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}
function fields(entries: Entry[], file: string, required: string[]): void {
  entries.forEach((entry, index) => required.forEach((field) => {
    if (typeof entry[field] !== 'string' || !String(entry[field]).trim()) problems.push(`${file}[${index}] is missing ${field}`);
  }));
}

const phrases = read('phrases.json');
const vocabulary = read('vocabulary.json');
const grammar = read('grammar.json');
const dialogues = read('dialogues.json');
const stories = read('stories.json');
fields(phrases, 'phrases.json', ['telugu', 'telish', 'english', 'audio_text']);
fields(vocabulary, 'vocabulary.json', ['word', 'telugu', 'roman', 'english', 'audio_text', 'example']);
fields(grammar, 'grammar.json', ['title', 'telugu', 'english', 'pattern', 'question', 'answer', 'example']);
dialogues.forEach((item, index) => {
  fields([item], `dialogues.json[${index}]`, ['place', 'telugu']);
  if (!Array.isArray(item.lines) || item.lines.length === 0) problems.push(`dialogues.json[${index}] needs conversation lines`);
  else fields(item.lines as Entry[], `dialogues.json[${index}].lines`, ['speaker', 'english', 'telugu']);
});
stories.forEach((item, index) => {
  fields([item], `stories.json[${index}]`, ['title', 'teluguTitle', 'text', 'telugu']);
  if (!Array.isArray(item.wordsToType) || item.wordsToType.length === 0) problems.push(`stories.json[${index}] needs wordsToType`);
});
if (phrases.length < 50) problems.push(`phrases.json has ${phrases.length}; at least 50 are required.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Content check passed: ${phrases.length} phrases, ${vocabulary.length} vocabulary words, ${grammar.length} grammar lessons, ${dialogues.length} dialogues, and ${stories.length} story chapters.`);

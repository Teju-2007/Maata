import phrases from './phrases.json';
import vocabulary from './vocabulary.json';
import grammar from './grammar.json';
import dialogues from './dialogues.json';
import stories from './stories.json';

export { phrases, vocabulary, grammar, dialogues, stories };
export type Phrase = (typeof phrases)[number];
export type VocabularyWord = (typeof vocabulary)[number];

import { describe, expect, it } from 'vitest';
import { explainSpelling, transliterateTelugu } from './engine';

describe('Telugu transliteration', () => {
  it.each(Object.entries({
    k:'క', kh:'ఖ', g:'గ', gh:'ఘ', ch:'చ', chh:'ఛ', j:'జ', jh:'ఝ', T:'ట', Th:'ఠ', D:'డ', Dh:'ఢ',
    t:'త', th:'థ', d:'ద', dh:'ధ', n:'న', N:'ణ', p:'ప', ph:'ఫ', b:'బ', bh:'భ', m:'మ', y:'య', r:'ర',
    l:'ల', L:'ళ', v:'వ', w:'వ', s:'స', sh:'శ', Sh:'ష', h:'హ', R:'ఱ', ksh:'క్ష', x:'క్ష', f:'ఫ', q:'క',
  }))('handles consonant %s', (roman, telugu) => expect(transliterateTelugu(`${roman}a`)).toBe(telugu));

  it.each(Object.entries({a:'అ', aa:'ఆ', i:'ఇ', ii:'ఈ', ee:'ఈ', u:'ఉ', uu:'ఊ', oo:'ఊ', e:'ఎ', ae:'ఏ', ē:'ఏ', ai:'ఐ', o:'ఒ', ou:'ఓ', au:'ఔ', ru:'ఋ'}))(
    'handles independent vowel %s', (roman, telugu) => expect(transliterateTelugu(roman)).toBe(telugu),
  );

  it.each([
    ['a','అ'],['aa','ఆ'],['i','ఇ'],['ee','ఈ'],['u','ఉ'],['oo','ఊ'],['e','ఎ'],['ae','ఏ'],['ai','ఐ'],['o','ఒ'],['ou','ఓ'],['au','ఔ'],
    ['ka','క'],['kaa','కా'],['ki','కి'],['kee','కీ'],['ku','కు'],['koo','కూ'],['ke','కె'],['kae','కే'],['kai','కై'],['ko','కొ'],['kou','కో'],['kau','కౌ'],
    ['k','క'],['kh','ఖ'],['g','గ'],['gh','ఘ'],['ch','చ'],['chh','ఛ'],['j','జ'],['jh','ఝ'],['T','ట'],['Th','ఠ'],['D','డ'],['Dh','ఢ'],['t','త'],['th','థ'],['d','ద'],['dh','ధ'],
    ['n','న'],['N','ణ'],['p','ప'],['ph','ఫ'],['b','బ'],['bh','భ'],['m','మ'],['y','య'],['r','ర'],['l','ల'],['L','ళ'],['v','వ'],['w','వ'],['sh','శ'],['Sh','ష'],['s','స'],['h','హ'],['R','ఱ'],
    ['ka ki ku','క కి కు'],['amma','అమ్మ'],['anna','అన్న'],['akka','అక్క'],['illu','ఇల్లు'],['ammaa','అమ్మా'],['ksha','క్ష'],['kshi','క్షి'],['tra','త్ర'],['kshama','క్షమ'],['namaskaaram','నమస్కారం'],['telugu','తెలుగు'],['meeru','మీరు'],['nenu','నేను'],['manchi','మంచి'],['pustakam','పుస్తకం'],['paalu','పాలు'],['neellu','నీళ్ళు'],['vellu','వెల్లు'],['raamu','రాము'],['seeta','సీత'],['raatri','రాత్రి'],['sneham','స్నేహం'],['M','ం'],['ḥ','ః'],['~n','ం'],['ksha!','క్ష!'],['nenu, amma','నేను, అమ్మ'],['namaskaram.','నమస్కరం.'],
  ])('maps %s', (roman, telugu) => expect(transliterateTelugu(roman)).toBe(telugu));

  it('keeps unrecognized characters readable', () => expect(transliterateTelugu('amma 123!')).toBe('అమ్మ 123!'));
  it('explains long vowels and conjuncts', () => {
    expect(explainSpelling('ammaa')).toContain('Double vowels');
    expect(explainSpelling('kshama')).toContain('virama');
  });
});

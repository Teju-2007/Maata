import { useEffect, useState } from 'react';
import { ArrowRight, Check, HelpCircle, Keyboard, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { phrases } from '../content';
import { GoldButton, GemButton, Panel, Parchment } from '../components/ui';
import { explainSpelling, TELUGU_KEY_MAP, transliterateTelugu } from '../lib/transliteration/engine';
import { isNearTelish, normalizePhrase } from '../lib/matching';
import { speak } from '../lib/speech';
import { playChime } from '../lib/sound';
import { rememberAnswer, reviewCard, saveReview } from '../lib/storage/db';
import { scheduleReview } from '../lib/repetition/sm2';
import { useProgress } from '../store/progress';

type Mode='tenglish'|'translate';

export function TypingStudio() {
  const [typed,setTyped]=useState(''); const [mode,setMode]=useState<Mode>('tenglish'); const [feedback,setFeedback]=useState<'idle'|'good'|'try'>('idle');
  const [showWhy,setShowWhy]=useState(false); const [showKeyMap,setShowKeyMap]=useState(false); const [startedAt,setStartedAt]=useState(Date.now()); const [seconds,setSeconds]=useState(0);
  const phraseIndex=useProgress((s)=>s.phraseIndex); const phrase=phrases[phraseIndex%phrases.length]!; const recordAnswer=useProgress((s)=>s.recordAnswer); const movePhrase=useProgress((s)=>s.movePhrase); const muted=useProgress((s)=>s.muted); const addMinutes=useProgress((s)=>s.addMinutes);
  useEffect(()=>{const timer=window.setInterval(()=>setSeconds(Math.floor((Date.now()-startedAt)/1000)),1000);return()=>window.clearInterval(timer);},[startedAt]);
  useEffect(()=>{if(seconds>0&&seconds%60===0)addMinutes(1);},[seconds,addMinutes]);
  const expected=mode==='tenglish'?phrase.telish:phrase.english;
  const preview=transliterateTelugu(typed);
  const elapsedMinutes=Math.max(seconds/60,0.1); const wpm=Math.round(typed.trim().split(/\s+/).filter(Boolean).length/elapsedMinutes);
  const accuracy=typed.length?Math.max(0,Math.round((Array.from(typed).filter((char,index)=>char.toLowerCase()===expected[index]?.toLowerCase()).length/typed.length)*100)):100;
  const nextKey=expected[Math.min(typed.length,expected.length-1)]?.toLowerCase()??'';
  const keyCards=Object.entries(TELUGU_KEY_MAP).slice(0,18);

  const finish = async () => {
    if(feedback==='good')return;
    const correct=mode==='tenglish'?isNearTelish(typed,phrase.telish):normalizePhrase(typed)===normalizePhrase(phrase.english);
    if(!typed.trim()) {setFeedback('try');return;}
    const oldLevel=Math.floor(useProgress.getState().xp/100)+1;
    const xp=recordAnswer({prompt:phrase.telugu,typed,expected,correct,word:phrase.english}); setFeedback(correct?'good':'try');
    await rememberAnswer({promptId:`phrase-${phraseIndex}`,promptEnglish:phrase.english,typed,correct,createdAt:Date.now(),xp});
    const id=`phrase-${phraseIndex}`; const existing=await reviewCard(id,phrase.english,phrase.telugu);
    if(existing) await saveReview({...existing,...scheduleReview(existing,correct?4:1),id,word:phrase.english,telugu:phrase.telugu});
    if(correct){playChime(muted); if(Math.floor(useProgress.getState().xp/100)+1>oldLevel) confetti({particleCount:120,spread:76,origin:{y:.68},colors:['#f7c85b','#ef8c52','#2ac3b4','#a78bfa']});}
  };
  const next = () => {movePhrase(phrases.length);setTyped('');setFeedback('idle');setStartedAt(Date.now());setSeconds(0);setShowWhy(false);};
  const addKey=(key:string)=>setTyped((value)=>value+key);
  const tts=()=>speak(mode==='tenglish'?phrase.telugu:phrase.english,mode==='tenglish'?'te-IN':'en-IN');

  return <div className="page-content studio-page"><div className="page-heading"><div><div className="eyebrow">STUDIO 01 · మీ వేగంతో నేర్చుకోండి</div><h1>Tenglish Typing Studio</h1><p>Telugu sounds → English letters → beautiful Telugu words.</p></div><Link to="/" className="soft-link"><ArrowRight className="back-arrow"/> Back to journey</Link></div>
    <div className="studio-progress"><div><span>Lesson {phraseIndex+1} of {phrases.length}</span><span>Level · {phrase.level}</span></div><div className="meter"><i style={{width:`${((phraseIndex+1)/phrases.length)*100}%`}}/></div><div className="mode-tabs"><button className={mode==='tenglish'?'selected':''} onClick={()=>{setMode('tenglish');setTyped('');setFeedback('idle');}}>⌨️ Type in Tenglish</button><button className={mode==='translate'?'selected':''} onClick={()=>{setMode('translate');setTyped('');setFeedback('idle');}}>🌍 Translate to English</button></div></div>
    <div className="studio-grid"><div className="exercise-column"><Panel className={`exercise-card ${feedback==='good'?'correct-card':''} ${feedback==='try'?'gentle-error':''}`}>
      <div className="exercise-meta"><span className="tag">{phrase.category}</span><span>💛 Take your time</span></div><div className="prompt-telugu">{phrase.telugu}</div><button className="listen-button" onClick={tts}><Volume2 size={18}/> Listen slowly · నెమ్మదిగా వినండి</button>
      {mode==='tenglish'&&<div className="target-example"><span>Type the sound using English letters</span><strong>{phrase.telish}</strong></div>}
      {mode==='translate'&&<div className="target-example"><span>What does this mean in English?</span><strong>Think about the sentence, one word at a time.</strong></div>}
      <label className="answer-label" htmlFor="typing-answer">Your answer · మీ సమాధానం</label><input id="typing-answer" autoComplete="off" className={`studio-input ${feedback==='good'?'good':''} ${feedback==='try'?'error':''}`} value={typed} onChange={(e)=>{setTyped(e.target.value);if(feedback!=='idle')setFeedback('idle');}} onKeyDown={(e)=>e.key==='Enter'&&void finish()} placeholder={mode==='tenglish'?'Type here: e.g. namaskaram':'Type the English translation'} aria-describedby="telugu-preview" />
      {mode==='tenglish'&&<div className="preview-row" id="telugu-preview"><span>Live Telugu preview · ఇప్పటి తెలుగు</span><strong lang="te">{preview||'…'}</strong></div>}
      <div className="word-check" aria-label="Compare spelling"><span>Target</span><div>{Array.from(expected).map((char,index)=><span key={`${char}-${index}`} className={typed[index]?(typed[index]?.toLowerCase()===char.toLowerCase()?'match':'mismatch'):''}>{char===' '?'\u00a0':char}</span>)}</div></div>
      <div className="typing-stats"><span>⚡ {wpm} WPM</span><span>◎ {accuracy}% match</span><span>⏱ {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span></div>
      <div className="exercise-actions"><GoldButton disabled={feedback==='good'} onClick={()=>void finish()}><Check size={19}/> Check kindly</GoldButton><GemButton gem="💜" onClick={()=>setShowWhy((value)=>!value)}><HelpCircle size={17}/> Why this spelling?</GemButton><button className="quiet-button" onClick={()=>{setTyped('');setFeedback('idle');}} aria-label="Clear answer"><RotateCcw size={18}/></button></div>
      {showWhy&&<Parchment title="A LITTLE SPELLING CLUE · చిన్న సూచన">{explainSpelling(typed||phrase.telish)}<br/><span className="telish-spelling">తెలుగు పలుకును నెమ్మదిగా విని, అక్షరాలను ఒక్కొక్కటిగా టైప్ చేయండి.</span></Parchment>}
      {feedback==='good'&&<div className="feedback-success" role="status"><span>✨</span><div><b>చాలా బాగుంది! Wonderful work!</b><small>+30 XP · You are growing with every try.</small></div></div>}
      {feedback==='try'&&<div className="feedback-kind" role="status"><span>🌱</span><div><b>That’s okay — let’s try it together.</b><small>{mode==='tenglish'?`Listen again: ${phrase.telish}`:`Think of the meaning: ${phrase.telugu}`}</small></div></div>}
      {feedback==='good'&&<GoldButton className="next-button" onClick={next}>Next little win <ArrowRight size={18}/></GoldButton>}
    </Panel>
    <Panel className="keyboard-panel"><div className="keyboard-title"><div><Keyboard size={19}/><b>Telugu sound keyboard</b><small>Tap a key to add its Roman spelling</small></div><button onClick={()=>setShowKeyMap((x)=>!x)}>{showKeyMap?'Hide':'Show'} key map</button></div>{showKeyMap&&<div className="key-map">{keyCards.map(([roman,telugu])=><button key={roman} className={roman.toLowerCase()===nextKey?'next-key':''} onClick={()=>addKey(roman)}><b>{roman}</b><span>{telugu}</span></button>)}</div>}</Panel>
    </div><aside className="studio-aside"><Parchment title="YOUR GENTLE HINT · మీ చిన్న సూచన">{phrase.hint_parchment}<br/><span className="telish-spelling">తప్పులు కూడా నేర్చుకోవడంలో భాగమే. Every mistake is part of learning.</span></Parchment><Panel className="studio-helper"><div className="helper-gem">✦</div><h3>Slow is strong.</h3><p>Type at the pace that feels comfortable. The app will wait for you.</p><button onClick={()=>speak('Take your time. You are learning beautifully.','en-IN',true)} className="listen-button"><Volume2 size={17}/> Hear encouragement</button></Panel><Panel className="module-shortcut"><b>Ready for another game?</b><Link to="/spelling">Open Spelling Lab <ArrowRight size={16}/></Link><Link to="/speak">Practice speaking <ArrowRight size={16}/></Link></Panel></aside></div>
  </div>;
}

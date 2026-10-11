import { useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { vocabulary } from '../content';
import { GoldButton, Panel } from '../components/ui';
import { useProgress } from '../store/progress';

export function MiniGames() {
  const recordAnswer=useProgress((s)=>s.recordAnswer);
  const deck=useMemo(()=>[...vocabulary.slice(0,6).flatMap((item,index)=>[{id:`en-${index}`,pair:item.word,label:item.word,kind:'English'},{id:`te-${index}`,pair:item.word,label:item.telugu,kind:'తెలుగు'}])].sort(()=>Math.random()-.5),[]);
  const [open,setOpen]=useState<string[]>([]);const [matched,setMatched]=useState<string[]>([]);const [turns,setTurns]=useState(0);const [message,setMessage]=useState('Choose two cards that mean the same thing.');
  const flip=(id:string)=>{if(open.length===2||matched.includes(id)||open.includes(id))return;const next=[...open,id];setOpen(next);if(next.length===2){setTurns((n)=>n+1);const a=deck.find((c)=>c.id===next[0]);const b=deck.find((c)=>c.id===next[1]);if(a?.pair===b?.pair){setMatched((m)=>[...m,...next]);setMessage('✨ A lovely match! బాగా జత చేశారు!');setOpen([]);recordAnswer({prompt:`Match ${a?.label}`,typed:b?.label??'',expected:a?.label??'',correct:true,word:a?.pair??''});}else{setMessage('Almost! Look and try another pair.');window.setTimeout(()=>setOpen([]),850);}}};
  const reset=()=>{setOpen([]);setMatched([]);setTurns(0);setMessage('Choose two cards that mean the same thing.');};
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow">MINI-GAMES · చిన్న ఆటలు</div><h1>Word Match Garden</h1><p>Match each English word with its Telugu meaning.</p></div><div className="module-orb">🪷</div></div><Panel className="match-game"><div className="game-stats"><span>Moves <b>{turns}</b></span><span>Pairs <b>{matched.length/2} / 6</b></span><button className="quiet-button" onClick={reset}><RotateCcw size={17}/> New game</button></div><div className="match-grid">{deck.map((card)=>{const shown=open.includes(card.id)||matched.includes(card.id);return <button key={card.id} onClick={()=>flip(card.id)} className={`match-card ${shown?'revealed':''} ${matched.includes(card.id)?'matched':''}`} aria-label={`${shown?card.label:'Flip card'}`}><span className="match-gem">{shown?card.label:'✦'}</span><small>{shown?card.kind:'Tap to reveal'}</small></button>;})}</div><div className="game-message" role="status">{matched.length===12?<><Sparkles/> All matched! A beautiful job, Amma! <GoldButton onClick={reset}>Play again</GoldButton></>:message}</div></Panel></div>;
}

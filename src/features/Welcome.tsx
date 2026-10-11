import { useState } from 'react';
import { ArrowRight, Heart, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Parrot } from '../components/Parrot';
import { GoldButton, Panel } from '../components/ui';
import { useProgress } from '../store/progress';
import { speak } from '../lib/speech';

export function Welcome() {
  const [step,setStep]=useState(0); const [name,setName]=useState(''); const [goal,setGoal]=useState<5|10|15>(5); const [placement,setPlacement]=useState('');
  const finish=useProgress((s)=>s.finishOnboarding); const navigate=useNavigate();
  const done=()=>{finish(name,goal); navigate('/');};
  return <div className="welcome-page"><Panel className="welcome-card"><div className="welcome-head"><span className="brand-mark">మ</span><b>మాట • Maata</b><span className="welcome-step">{step+1} / 4</span></div>
    <div className="welcome-content"><Parrot mood={step===2?'happy':'wave'}/><div className="eyebrow">A gentle start · సంతోషంగా ప్రారంభిద్దాం</div>
      {step===0&&<><h1>మీ ఇంగ్లీష్ ప్రయాణం<br/>ఇక్కడ మొదలవుతుంది.</h1><p>Hi Amma! We’ll learn English and Telugu typing together. No rush, no pressure—just one happy little step at a time.</p><button className="voice-link" onClick={()=>speak('నమస్కారం అమ్మా. మనం కలిసి నేర్చుకుందాం.','te-IN')}><Volume2 size={18}/> వినండి · Listen to welcome</button><GoldButton onClick={()=>setStep(1)}>Let’s begin <ArrowRight size={20}/></GoldButton></>}
      {step===1&&<><h1>What should we call you?</h1><p>మీ పేరు చెప్పండి — tell us your name.</p><input autoFocus className="welcome-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name / పేరు" onKeyDown={(e)=>e.key==='Enter'&&setStep(2)}/><GoldButton onClick={()=>setStep(2)}>Next <ArrowRight size={20}/></GoldButton></>}
      {step===2&&<><h1>A small daily goal</h1><p>రోజుకు ఎంతసేపు నేర్చుకోవాలి? You can change this any time.</p><div className="goal-options">{([5,10,15] as const).map((minutes)=><button key={minutes} onClick={()=>setGoal(minutes)} className={goal===minutes?'selected':''}><b>{minutes}</b><small>minutes / నిమిషాలు</small></button>)}</div><div className="placement-note"><Heart size={18}/> Starting easy is a smart choice. We’ll grow together.</div><GoldButton onClick={()=>setStep(3)}>Try a little English <ArrowRight size={20}/></GoldButton></>}
      {step===3&&<><h1>Just one tiny question</h1><p>ఇది పరీక్ష కాదు — it simply helps us choose a comfortable start.</p><div className="question-box"><h3>I ___ a mother.</h3><div className="choice-list">{['am','is','are'].map((option)=><button key={option} className={placement===option?'chosen':''} onClick={()=>setPlacement(option)}>{option}</button>)}</div></div><div className="placement-note"><Heart size={18}/> Every answer helps us make the lessons gentler.</div><GoldButton onClick={done}>Start my journey <ArrowRight size={20}/></GoldButton><button className="voice-link" onClick={done}>Skip for now · ఇప్పుడే దాటవేయండి</button></>}
    </div><div className="welcome-dots">{[0,1,2,3].map((n)=><span key={n} className={step===n?'active':''}/>)}</div></Panel><span className="welcome-foot">Made with love for Amma</span></div>;
}

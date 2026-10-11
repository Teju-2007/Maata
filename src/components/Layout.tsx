import { NavLink, Outlet, Link } from 'react-router-dom';
import { BookOpen, Brain, Home, Languages, Mic2, NotebookPen, Settings, Sparkles, Trophy, Users, WandSparkles } from 'lucide-react';
import { useProgress } from '../store/progress';
import { Parrot } from './Parrot';

const links = [
  { to: '/', label: 'Home', telugu: 'హోమ్', icon: Home, end: true },
  { to: '/studio', label: 'Tenglish Studio', telugu: 'తెలుగు టైపింగ్', icon: Languages },
  { to: '/spelling', label: 'Spelling Lab', telugu: 'పదాల స్పెల్లింగ్', icon: Sparkles },
  { to: '/grammar', label: 'Grammar Garden', telugu: 'వ్యాకరణం', icon: BookOpen },
  { to: '/speak', label: 'Speak & Listen', telugu: 'వినండి, మాట్లాడండి', icon: Mic2 },
  { to: '/games', label: 'Mini-games', telugu: 'చిన్న ఆటలు', icon: WandSparkles },
  { to: '/story', label: 'Story Mode', telugu: 'కథలు', icon: Brain },
  { to: '/notebook', label: 'Mistake Notebook', telugu: 'తిరిగి నేర్చుకోండి', icon: NotebookPen },
];

export function AppLayout() {
  const name = useProgress((s) => s.name); const xp = useProgress((s) => s.xp); const streak = useProgress((s) => s.streak);
  const language = useProgress((s) => s.uiLanguage);
  return <div className="app-shell">
    <aside className="sidebar"><Link to="/" className="brand"><span className="brand-mark">మ</span><span><b>మాట • Maata</b><small>Telugu-English Tutor</small></span></Link>
      <div className="side-profile"><Parrot mood="wave"/><div><b>నమస్కారం, {name || 'అమ్మ'}!</b><span>చిన్న అడుగులు, పెద్ద విజయం</span></div></div>
      <nav aria-label="Main navigation" className="side-nav">{links.map(({ to, label, telugu, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19}/><span>{language==='telugu-first'?telugu:label}<small>{language==='english-first'?'':language==='telugu-first'?label:telugu}</small></span></NavLink>)}</nav>
      <div className="side-bottom"><div className="side-xp"><span>✨ {xp} XP</span><span>🪔 {streak} day streak</span></div><NavLink to="/family" className="nav-link"><Users size={19}/><span>Family progress<small>కుటుంబ ప్రగతి</small></span></NavLink><NavLink to="/settings" className="nav-link"><Settings size={19}/><span>Settings<small>అమరికలు</small></span></NavLink><NavLink to="/trophies" className="nav-link"><Trophy size={19}/><span>Trophy room<small>బహుమతులు</small></span></NavLink></div>
    </aside>
    <main className="main-area"><header className="mobile-header"><Link to="/" className="brand"><span className="brand-mark">మ</span><b>మాట • Maata</b></Link><div className="mobile-streak">🪔 {streak}</div></header><Outlet/></main>
    <nav className="mobile-nav" aria-label="Quick navigation">{links.slice(0,5).map(({to,label,icon:Icon,end})=><NavLink key={to} to={to} end={end} aria-label={label} className={({isActive})=>isActive?'active':''}><Icon size={20}/><small>{label.split(' ')[0]}</small></NavLink>)}</nav>
  </div>;
}

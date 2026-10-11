import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { AppLayout } from './components/Layout';
import { useProgress } from './store/progress';

const Dashboard=lazy(()=>import('./features/Dashboard').then((module)=>({default:module.Dashboard})));
const FamilyDashboard=lazy(()=>import('./features/FamilyDashboard').then((module)=>({default:module.FamilyDashboard})));
const GrammarGarden=lazy(()=>import('./features/GrammarGarden').then((module)=>({default:module.GrammarGarden})));
const MiniGames=lazy(()=>import('./features/MiniGames').then((module)=>({default:module.MiniGames})));
const Notebook=lazy(()=>import('./features/Notebook').then((module)=>({default:module.Notebook})));
const Settings=lazy(()=>import('./features/Settings').then((module)=>({default:module.Settings})));
const SpeakListen=lazy(()=>import('./features/SpeakListen').then((module)=>({default:module.SpeakListen})));
const SpellingLab=lazy(()=>import('./features/SpellingLab').then((module)=>({default:module.SpellingLab})));
const StoryMode=lazy(()=>import('./features/StoryMode').then((module)=>({default:module.StoryMode})));
const Trophies=lazy(()=>import('./features/Trophies').then((module)=>({default:module.Trophies})));
const TypingStudio=lazy(()=>import('./features/TypingStudio').then((module)=>({default:module.TypingStudio})));
const Welcome=lazy(()=>import('./features/Welcome').then((module)=>({default:module.Welcome})));

function LearningRoute({ children }: { children: ReactNode }) {
  const done = useProgress((state) => state.onboardingDone);
  return done ? children : <Navigate to="/welcome" replace/>;
}

function AppRoutes() {
  const settings=useProgress(useShallow((state)=>({theme:state.theme,highContrast:state.highContrast,fontScale:state.fontScale})));
  useEffect(()=>{
    document.documentElement.dataset.theme=settings.theme;
    document.documentElement.dataset.contrast=settings.highContrast?'high':'normal';
    document.documentElement.style.setProperty('--font-scale',String(settings.fontScale));
  },[settings]);
  useEffect(()=>{useProgress.getState().addMinutes(0);},[]);
  useEffect(()=>{if('serviceWorker'in navigator)void navigator.serviceWorker.register('/sw.js').catch((error)=>console.warn('Offline mode could not be enabled.',error));},[]);
  return <Suspense fallback={<div className="page-content" role="status">Opening your lesson… · పాఠం తెరుస్తున్నాం</div>}><Routes>
    <Route path="/welcome" element={<Welcome/>}/>
    <Route element={<AppLayout/>}>
      <Route path="/" element={<LearningRoute><Dashboard/></LearningRoute>}/>
      <Route path="/studio" element={<LearningRoute><TypingStudio/></LearningRoute>}/>
      <Route path="/spelling" element={<LearningRoute><SpellingLab/></LearningRoute>}/>
      <Route path="/grammar" element={<LearningRoute><GrammarGarden/></LearningRoute>}/>
      <Route path="/speak" element={<LearningRoute><SpeakListen/></LearningRoute>}/>
      <Route path="/games" element={<LearningRoute><MiniGames/></LearningRoute>}/>
      <Route path="/story" element={<LearningRoute><StoryMode/></LearningRoute>}/>
      <Route path="/notebook" element={<LearningRoute><Notebook/></LearningRoute>}/>
      <Route path="/family" element={<LearningRoute><FamilyDashboard/></LearningRoute>}/>
      <Route path="/settings" element={<LearningRoute><Settings/></LearningRoute>}/>
      <Route path="/trophies" element={<LearningRoute><Trophies/></LearningRoute>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Suspense>;
}

export default function App(){return <BrowserRouter><AppRoutes/></BrowserRouter>;}

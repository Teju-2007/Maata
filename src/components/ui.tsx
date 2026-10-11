import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
export function GoldButton({ children, className = '', ...props }: HTMLMotionProps<'button'>) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className={`gold-button ${className}`} {...props}>{children}</motion.button>;
}
export function GemButton({ children, gem = '💎', ...props }: Omit<HTMLMotionProps<'button'>, 'children'> & { children: ReactNode; gem?: string }) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className="gem-button" {...props}><span aria-hidden="true">{gem}</span>{children}</motion.button>;
}
export function GoldPlaque({ icon, label, value, foot }: { icon: string; label: string; value: string | number; foot?: string }) {
  return <Panel className="stat-plaque"><div className="stat-icon">{icon}</div><div><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{foot && <div className="stat-foot">{foot}</div>}</div></Panel>;
}
export function Parchment({ children, title }: { children: ReactNode; title: string }) {
  return <aside className="parchment"><div className="parchment-title">{title}</div>{children}</aside>;
}
export function ProgressRing({ value, total, label }: { value: number; total: number; label: string }) {
  const percent = Math.min(100, Math.round((value / Math.max(1, total)) * 100));
  return <div className="progress-ring" style={{ '--progress': `${percent}%` } as React.CSSProperties}><div><strong>{percent}%</strong><span>{label}</span></div></div>;
}

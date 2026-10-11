import { motion } from 'framer-motion';

export function Parrot({ mood = 'wave' }: { mood?: 'wave' | 'happy' | 'gentle' }) {
  return <motion.svg aria-label="Friendly Maata parrot mascot" role="img" viewBox="0 0 150 150" className="parrot" animate={mood === 'happy' ? { rotate: [0, -6, 6, 0], y: [0, -5, 0] } : mood === 'wave' ? { y: [0, -4, 0] } : { scale: [1, 1.015, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
    <defs><linearGradient id="body" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f8c85c"/><stop offset="1" stopColor="#df863c"/></linearGradient><linearGradient id="wing" x1="0" x2="1"><stop stopColor="#1ab6a7"/><stop offset="1" stopColor="#147a83"/></linearGradient></defs>
    <ellipse cx="75" cy="132" rx="42" ry="8" fill="#070b17" opacity=".24"/><ellipse cx="77" cy="88" rx="43" ry="48" fill="url(#body)"/><ellipse cx="57" cy="90" rx="23" ry="34" fill="url(#wing)"/><circle cx="89" cy="48" r="31" fill="#f1b84c"/><path d="M105 47c25-12 30 6 4 17l-13-5Z" fill="#e47d42"/><circle cx="98" cy="43" r="4.4" fill="#20243a"/><circle cx="99" cy="42" r="1.4" fill="#fff"/><path d="M39 125c16-7 32-7 48 0" fill="none" stroke="#d06d43" strokeWidth="6" strokeLinecap="round"/><path d="m60 128-4 9m26-9 4 9" stroke="#d87c42" strokeWidth="5" strokeLinecap="round"/><path d="M55 60c8-11 20-17 34-17" fill="none" stroke="#ffe79b" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
  </motion.svg>;
}

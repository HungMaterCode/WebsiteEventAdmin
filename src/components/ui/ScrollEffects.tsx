'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function ScrollProgress() {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) setProgress((window.scrollY / scrollHeight) * 100);
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div className="h-full bg-gradient-to-r from-magenta via-cyan to-gold glow-magenta transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);
  return (
    <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-magenta/20 backdrop-blur-md border border-magenta/50 flex items-center justify-center text-magenta glow-magenta hover:bg-magenta hover:text-white transition-all">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2"><path d="M18 15l-6-6-6 6" /></svg>
    </motion.button>
  );
}

export function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 -left-20 w-96 h-96 border border-magenta/20 rounded-full blur-sm" />
      <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] border border-cyan/10 rounded-full blur-md" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
    </div>
  );
}

export function Preloader() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const timer = setTimeout(() => setLoading(false), 2500); return () => clearTimeout(timer); }, []);
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: loading ? 1 : 0, pointerEvents: loading ? 'auto' as const : 'none' as const }} transition={{ duration: 0.8, ease: "easeInOut" }} className="fixed inset-0 z-[200] bg-midnight flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-display font-black uppercase tracking-[0.5em] text-center">
        <span className="text-gradient">NEON</span><br /><span className="text-silver">HERITAGE</span>
      </motion.div>
      <div className="mt-12 w-48 h-1 bg-royal/30 rounded-full overflow-hidden relative">
        <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan to-transparent" />
      </div>
      <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="mt-6 text-teal text-xs font-bold uppercase tracking-widest">Initializing Cinematic Experience...</motion.p>
    </motion.div>
  );
}

'use client';
import React from 'react';
import { motion } from 'motion/react';
import { X, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ onOpenBooking, onOpenStatus }: { onOpenBooking?: (type: 'GA' | 'VIP') => void, onOpenStatus?: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Nghệ Sĩ", href: "#lineup" },
    { name: "Lộ Trình", href: "#timeline" },
    { name: "Quà Tặng", href: "#merch" },
    { name: "Địa Điểm", href: "#location" },
  ];

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-100 bg-midnight/80 backdrop-blur-md border-b border-royal/30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-display font-black uppercase tracking-widest">
            <span className="text-gradient">Neon</span><span className="text-silver">Heritage</span>
          </Link>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Experience</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-cyan transition-colors">{link.name}</a>
          ))}
          <button suppressHydrationWarning onClick={() => onOpenStatus ? onOpenStatus() : window.location.href = '/'} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-wider hover:bg-white/10 hover:text-cyan transition-all text-sm">Trạng thái vé</button>
          <button suppressHydrationWarning onClick={() => onOpenBooking ? onOpenBooking('GA') : window.location.href = '/'} className="px-6 py-2 rounded-full bg-magenta/10 border border-magenta text-magenta font-bold uppercase tracking-wider hover:bg-magenta hover:text-white transition-all glow-magenta text-sm">Mua Vé</button>
        </div>
        <button suppressHydrationWarning onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-silver">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <motion.div initial={false} animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }} className="md:hidden overflow-hidden bg-midnight/95 backdrop-blur-xl border-b border-royal/30">
        <div className="p-6 space-y-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold uppercase tracking-widest text-silver hover:text-cyan transition-colors">{link.name}</a>
          ))}
          <button suppressHydrationWarning onClick={() => { setIsMobileMenuOpen(false); onOpenStatus ? onOpenStatus() : window.location.href = '/'; }} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-silver font-bold uppercase tracking-widest">Trạng thái vé</button>
          <button suppressHydrationWarning onClick={() => { setIsMobileMenuOpen(false); onOpenBooking ? onOpenBooking('GA') : window.location.href = '/'; }} className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold uppercase tracking-widest glow-magenta">Mua Vé Ngay</button>
        </div>
      </motion.div>
    </nav>
  );
}

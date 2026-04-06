'use client';
import React from 'react';
import { motion } from 'motion/react';
import { X, Menu } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar({ onOpenBooking, onOpenStatus }: { onOpenBooking?: (type: 'GA' | 'VIP') => void, onOpenStatus?: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { data: session } = useSession();

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
          
          {session ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <span className="text-sm font-bold text-silver">{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut()} className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">Đăng xuất</button>
            </div>
          ) : (
            <button onClick={() => signIn('google')} className="ml-4 pl-4 border-l border-white/10 text-sm font-bold uppercase tracking-wider text-cyan hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.67-2.28 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Đăng nhập
            </button>
          )}

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
          
          <div className="pt-4 border-t border-white/10">
            {session ? (
              <div className="space-y-4">
                <div className="text-silver font-bold">{session.user?.name || session.user?.email}</div>
                <button onClick={() => { setIsMobileMenuOpen(false); signOut(); }} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest">Đăng Xuất</button>
              </div>
            ) : (
              <button onClick={() => { setIsMobileMenuOpen(false); signIn('google'); }} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-cyan font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.67-2.28 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
}

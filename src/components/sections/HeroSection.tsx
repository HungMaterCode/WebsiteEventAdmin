'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

export default function HeroSection({ onOpenBooking }: { onOpenBooking: (type: 'GA' | 'VIP' | null) => void }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-20 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-royal/40 via-midnight to-midnight z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen z-0"></div>
      <div className="absolute top-1/4 left-10 w-48 h-48 md:w-64 md:h-64 border border-gold/20 rounded-full blur-[1px] z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 md:w-96 md:h-96 border border-cyan/10 rounded-full blur-[2px] z-0"></div>

      <div className="container mx-auto px-6 relative z-10 text-center mt-6 md:mt-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
          <span className="inline-block py-1.5 px-4 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-[10px] md:text-sm font-medium tracking-[0.2em] mb-6 uppercase shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            Neon Heritage Festival
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase leading-[1.2] mb-6">
            <span className="text-gradient block pb-2 pt-4">Dòng Chảy Di Sản</span>
            <span className="text-silver text-xl sm:text-2xl md:text-5xl lg:text-6xl block mt-2 tracking-wide">Bế Mạc Festival Ninh Bình</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-teal text-sm md:text-lg font-medium mb-8">
          <div className="flex items-center gap-2 bg-royal/30 px-4 py-2 rounded-lg border border-royal/50 backdrop-blur-sm w-full md:w-auto justify-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
            <span>31 Tháng 12, 2024</span>
          </div>
          <div className="flex items-center gap-2 bg-royal/30 px-4 py-2 rounded-lg border border-royal/50 backdrop-blur-sm w-full md:w-auto justify-center">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
            <span>20:00 - 00:30</span>
          </div>
          <div className="flex items-center gap-2 bg-royal/30 px-4 py-2 rounded-lg border border-royal/50 backdrop-blur-sm w-full md:w-auto justify-center">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
            <span>Thung Nham, Ninh Bình</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <CountdownTimer />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="mt-12">
          <button
            suppressHydrationWarning
            onClick={() => onOpenBooking(null)}
            className="group relative px-10 py-5 bg-gradient-primary rounded-full font-bold text-xl tracking-wider uppercase overflow-hidden glow-magenta transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,136,0.8)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative flex items-center gap-3">
              <Ticket className="w-6 h-6" />
              Mua Vé Ngay
            </span>
          </button>
        </motion.div>
      </div>

      <div className="absolute top-6 right-6 z-20 hidden md:block">
        <div className="text-gold font-display font-bold text-xl tracking-widest text-glow-gold">FESTIVAL NINH BÌNH</div>
      </div>
      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <div className="text-silver/50 text-sm tracking-widest uppercase">Newday Media</div>
      </div>
    </section>
  );
}

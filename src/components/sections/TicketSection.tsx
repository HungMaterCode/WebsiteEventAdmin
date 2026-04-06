'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star } from 'lucide-react';

export default function TicketSection({ onOpenBooking }: { onOpenBooking: (type: 'GA' | 'VIP') => void }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative bg-midnight" id="tickets">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4">
            <span className="text-silver">Chọn Hạng </span>
            <span className="text-gradient">Vé</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta to-cyan mx-auto rounded-full glow-magenta"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 max-w-md bg-royal/10 border border-cyan/30 rounded-3xl p-8 backdrop-blur-sm hover:border-cyan/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-3xl font-display font-bold text-cyan uppercase tracking-widest mb-2">Vé Thường</h3>
            <p className="text-gray-400 mb-6">Trải nghiệm không gian âm nhạc tuyệt vời</p>
            <div className="text-4xl font-bold text-silver mb-8">500.000<span className="text-xl text-gray-500 font-normal"> VNĐ</span></div>
            <ul className="space-y-4 mb-10">
              {['Khu vực đứng chung (GA)', 'Thưởng thức trọn vẹn các màn trình diễn', 'Truy cập khu vực F&B cơ bản', 'Quà tặng vòng tay dạ quang'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-cyan shrink-0 mt-0.5" /><span>{feature}</span></li>
              ))}
            </ul>
            <button
              suppressHydrationWarning
              onClick={() => onOpenBooking('GA')}
              className="w-full py-4 rounded-xl border border-cyan text-cyan font-bold uppercase tracking-wider hover:bg-cyan hover:text-midnight transition-colors duration-300"
            >
              Mua Vé Thường
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full lg:w-1/2 max-w-md bg-gradient-to-b from-royal/40 to-midnight border-glow-magenta rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden transform lg:-translate-y-4 shadow-[0_10px_40px_rgba(255,0,136,0.15)]">
            <div className="absolute top-6 right-6 bg-magenta text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest glow-magenta">Hot</div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-magenta/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-3xl font-display font-bold text-gold uppercase tracking-widest mb-2 text-glow-gold">Vé VIP</h3>
            <p className="text-gray-300 mb-6">Khu vực gần sân khấu nhất</p>
            <div className="text-4xl font-bold text-silver mb-8">1.500.000<span className="text-xl text-gray-500 font-normal"> VNĐ</span></div>
            <ul className="space-y-4 mb-10">
              {['Khu vực Fanzone sát sân khấu', 'Lối đi riêng biệt (Fast-track)', 'Set quà tặng Heritage độc quyền', 'Truy cập khu vực F&B cao cấp', 'Giao lưu nghệ sĩ (Tùy chọn)'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200"><Star className="w-5 h-5 text-gold shrink-0 mt-0.5" /><span>{feature}</span></li>
              ))}
            </ul>
            <button
              suppressHydrationWarning
              onClick={() => onOpenBooking('VIP')}
              className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold uppercase tracking-wider glow-magenta hover:scale-[1.02] transition-transform duration-300"
            >
              Mua Vé VIP
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

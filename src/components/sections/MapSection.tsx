'use client';
import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Sparkles } from 'lucide-react';

export default function MapSection() {
  return (
    <section className="py-24 relative bg-midnight border-t border-royal/30" id="location">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/3">
            <h2 className="text-4xl font-display font-black uppercase tracking-wider mb-6"><span className="text-silver">Địa Điểm </span><span className="text-gradient block">Tổ Chức</span></h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">Khu Du Lịch Sinh Thái Thung Nham, Ninh Bình.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-royal/10 p-4 rounded-xl border border-royal/30"><MapPin className="w-6 h-6 text-magenta shrink-0 mt-1" /><div><h4 className="text-silver font-bold mb-1">Địa chỉ</h4><p className="text-gray-400 text-sm">Thôn Hải Nham, Xã Ninh Hải, Huyện Hoa Lư, Tỉnh Ninh Bình</p></div></div>
              <div className="flex items-start gap-4 bg-royal/10 p-4 rounded-xl border border-royal/30"><Sparkles className="w-6 h-6 text-cyan shrink-0 mt-1" /><div><h4 className="text-silver font-bold mb-1">Không gian</h4><p className="text-gray-400 text-sm">Sân khấu ngoài trời quy mô lớn, hòa mình vào thiên nhiên.</p></div></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-2/3 relative rounded-3xl overflow-hidden border border-royal/50 aspect-video lg:aspect-auto lg:h-[500px] bg-royal/5">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ninhbinh/1200/800')] opacity-40 mix-blend-luminosity object-cover"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-16 h-16 bg-magenta/20 rounded-full animate-ping absolute"></div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center relative z-10 glow-magenta border-2 border-white"><MapPin className="w-6 h-6 text-white" /></div>
              <div className="mt-4 bg-midnight/80 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan/30 text-cyan font-bold tracking-wider whitespace-nowrap">THUNG NHAM</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

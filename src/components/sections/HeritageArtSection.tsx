'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Music, Sparkles, Star, Mic, Drum, Guitar, Radio, Disc, Heart } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Music': <Music className="w-8 h-8" />,
  'Sparkles': <Sparkles className="w-8 h-8" />,
  'Star': <Star className="w-8 h-8" />,
  'Mic': <Mic className="w-8 h-8" />,
  'Drum': <Drum className="w-8 h-8" />,
  'Guitar': <Guitar className="w-8 h-8" />,
  'Radio': <Radio className="w-8 h-8" />,
  'Disc': <Disc className="w-8 h-8" />,
  'Heart': <Heart className="w-8 h-8" />,
};

export default function HeritageArtSection({ settings }: { settings?: any }) {
  const artTitle = settings?.artTitle || "Nghệ Thuật";
  const artSubtitle = settings?.artSubtitle || "Di Sản Cyber";
  const artDescription = settings?.artDescription || "Tại Neon Heritage Festival, chúng tôi không chỉ trình diễn âm nhạc. Chúng tôi kể câu chuyện về sự giao thoa giữa quá khứ và tương lai.";
  const artImage = settings?.artImage || "https://picsum.photos/seed/heritage-art/800/800";
  
  const defaultItems = [
    { name: "Đàn Tính", desc: "Nhạc cụ linh hồn của người Tày, Nùng, Thái. Tiếng đàn thanh cao hòa quyện cùng âm hưởng điện tử hiện đại.", icon: "Music" },
    { name: "Trống Hội", desc: "Âm vang hào hùng từ những chiếc trống truyền thống, tạo nên nhịp đập mạnh mẽ cho dòng chảy di sản.", icon: "Sparkles" },
    { name: "Khèn Mông", desc: "Giai điệu phóng khoáng của núi rừng Tây Bắc được tái hiện qua lăng kính âm nhạc đương đại.", icon: "Music" },
  ];

  const artItems = Array.isArray(settings?.artItems) ? settings.artItems : defaultItems;

  return (
    <section className="py-24 relative bg-midnight border-y border-royal/20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-6 md:mb-8 italic">
              <span className="text-silver">{artTitle} </span><span className="text-gradient block">{artSubtitle}</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 md:mb-10">{artDescription}</p>
            <div className="space-y-4 md:space-y-6">
              {artItems.slice(0, 3).map((item: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 md:p-6 rounded-2xl bg-royal/5 border border-royal/20 hover:border-gold/40 transition-colors group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-midnight transition-all shrink-0">
                    {ICON_MAP[item.icon] || <Music className="w-8 h-8" />}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-gold mb-1 md:mb-2 uppercase tracking-wide text-glow-gold">{item.name}</h4>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
            <div className="relative aspect-square max-w-[280px] sm:max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-magenta to-cyan rounded-full blur-[60px] md:blur-[100px] opacity-20 animate-pulse"></div>
              <div className="relative z-10 w-full h-full border-2 border-gold/30 rounded-full p-4 md:p-8 flex items-center justify-center">
                <div className="w-full h-full border border-cyan/20 rounded-full p-4 md:p-8 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-cyan rounded-full glow-cyan"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-magenta rounded-full glow-magenta"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                  <img src={artImage} alt="Heritage Art" className="w-full h-full object-cover rounded-full border-2 md:border-4 border-midnight shadow-[0_0_30px_rgba(230,199,83,0.3)]" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

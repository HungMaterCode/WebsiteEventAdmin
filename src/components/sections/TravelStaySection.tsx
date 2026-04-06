'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Car, Plane, Hotel, Info } from 'lucide-react';

export default function TravelStaySection() {
  const travelOptions = [
    { icon: <Car className="w-8 h-8" />, title: "Đường Bộ", desc: "Chỉ mất 1.5 - 2 giờ di chuyển từ Hà Nội qua cao tốc Pháp Vân - Cầu Giẽ.", color: "text-cyan", bg: "bg-cyan/10" },
    { icon: <Plane className="w-8 h-8" />, title: "Đường Hàng Không", desc: "Bay đến sân bay Nội Bài, sau đó sử dụng dịch vụ xe Limousine đưa đón.", color: "text-magenta", bg: "bg-magenta/10" },
    { icon: <Hotel className="w-8 h-8" />, title: "Lưu Trú", desc: "Hệ thống Resort & Homestay cao cấp tại Thung Nham và khu vực lân cận.", color: "text-gold", bg: "bg-gold/10" },
  ];
  return (
    <section className="py-24 relative bg-midnight overflow-hidden" id="location">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-8"><span className="text-silver">Di Chuyển & </span><span className="text-gradient block">Lưu Trú</span></h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">Ninh Bình không chỉ là nơi diễn ra lễ hội, mà còn là một hành trình khám phá di sản.</p>
              <div className="space-y-6">
                {travelOptions.map((option, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 p-6 rounded-3xl bg-royal/5 border border-royal/20 hover:border-royal/50 transition-all group">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl ${option.bg} flex items-center justify-center ${option.color} border border-current/20 group-hover:scale-110 transition-transform`}>{option.icon}</div>
                    <div><h3 className="text-xl font-bold text-silver mb-2">{option.title}</h3><p className="text-gray-400 text-sm leading-relaxed">{option.desc}</p></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-[3rem] overflow-hidden border border-royal/50 shadow-[0_0_50px_rgba(79,31,118,0.2)]">
              <img src="https://picsum.photos/seed/ninhbinh-travel/800/1000" alt="Ninh Binh Travel" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-midnight/60 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-full bg-cyan flex items-center justify-center text-midnight"><Info className="w-6 h-6" /></div><h4 className="text-xl font-bold text-silver">Lời khuyên cho bạn</h4></div>
                <p className="text-gray-300 text-sm leading-relaxed">Bạn nên đến Ninh Bình từ sớm để tham quan các danh thắng trước khi hòa mình vào không gian âm nhạc.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

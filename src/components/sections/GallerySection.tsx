'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function GallerySection() {
  const images = [
    { url: "https://picsum.photos/seed/g1/800/600", title: "Ánh Sáng Di Sản" },
    { url: "https://picsum.photos/seed/g2/800/600", title: "Bùng Nổ Cảm Xúc" },
    { url: "https://picsum.photos/seed/g3/800/600", title: "Vũ Điệu Neon" },
    { url: "https://picsum.photos/seed/g4/800/600", title: "Kết Nối Di Sản" },
    { url: "https://picsum.photos/seed/g5/800/600", title: "Thung Nham Rực Rỡ" },
    { url: "https://picsum.photos/seed/g6/800/600", title: "Khoảnh Khắc Vàng" },
  ];
  return (
    <section className="py-24 relative bg-midnight overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4"><span className="text-silver">Khoảnh Khắc </span><span className="text-gradient">Di Sản</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan via-gold to-magenta mx-auto rounded-full glow-gold"></div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-royal/30">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-xl font-bold text-silver uppercase tracking-widest text-glow-cyan">{img.title}</h4>
                  <div className="w-12 h-1 bg-cyan mt-2 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

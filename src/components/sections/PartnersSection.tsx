'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function PartnersSection() {
  const partners = [
    { name: "Newday Media", logo: "https://picsum.photos/seed/p1/200/100" },
    { name: "Ninh Binh Tourism", logo: "https://picsum.photos/seed/p2/200/100" },
    { name: "Cyber Sound", logo: "https://picsum.photos/seed/p3/200/100" },
    { name: "Neon Light Co.", logo: "https://picsum.photos/seed/p4/200/100" },
    { name: "Heritage Bank", logo: "https://picsum.photos/seed/p5/200/100" },
    { name: "Vibe Energy", logo: "https://picsum.photos/seed/p6/200/100" },
  ];
  return (
    <section className="py-24 bg-[#0D0716] border-t border-royal/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Đối tác đồng hành</span>
        </motion.div>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
          {partners.map((p, i) => (
            <motion.img key={i} src={p.logo} alt={p.name} whileHover={{ scale: 1.1, filter: 'grayscale(0%)' }} className="h-8 md:h-10 grayscale transition-all cursor-pointer" referrerPolicy="no-referrer" />
          ))}
        </div>
      </div>
    </section>
  );
}

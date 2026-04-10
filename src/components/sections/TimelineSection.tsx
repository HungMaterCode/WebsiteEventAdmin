'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export default function TimelineSection({ items, settings }: { items?: any[], settings?: any }) {
  const timelineTitle = settings?.timelineTitle || "Lộ Trình";
  const timelineSubtitle = settings?.timelineSubtitle || "Sự Kiện";

  const displayTimeline = Array.isArray(items) ? items : [];

  return (
    <section className="py-24 relative bg-midnight overflow-hidden" id="timeline">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-royal/20 via-transparent to-transparent z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4 italic">
            <span className="text-silver">{timelineTitle} </span>
            <span className="text-gradient">{timelineSubtitle}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan to-magenta mx-auto rounded-full glow-cyan"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-6 sm:left-7 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan via-magenta to-royal rounded-full md:-translate-x-1/2 glow-magenta opacity-50"></div>
          {displayTimeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex items-center justify-between mb-12 md:mb-24 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="absolute left-6 sm:left-7 md:left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan md:-translate-x-1/2 shadow-[0_0_15px_rgba(0,255,255,0.8)] z-10 border-2 border-midnight"></div>
              <div className="hidden md:block w-5/12"></div>
              <div className="w-full pl-12 sm:pl-16 md:pl-0 md:w-5/12">
                <div className="bg-royal/20 border border-royal/50 p-5 md:p-6 rounded-2xl backdrop-blur-md hover:border-cyan/60 hover:bg-royal/30 transition-all duration-300 group shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                  <div className="text-cyan font-display font-bold text-xl md:text-2xl mb-2 flex items-center gap-3">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-glow-cyan" />
                    {item.time}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-silver mb-2 uppercase tracking-wide group-hover:text-magenta transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-xs md:text-base leading-relaxed">{item.description || item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

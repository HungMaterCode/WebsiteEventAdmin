'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection({ faqs }: { faqs: any[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative bg-midnight" id="faq">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4">
            <span className="text-silver">Câu Hỏi </span><span className="text-gradient">Thường Gặp</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta to-cyan mx-auto rounded-full glow-magenta"></div>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-royal/30 rounded-2xl overflow-hidden bg-royal/5">
              <button
                suppressHydrationWarning
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-royal/10 transition-all"
              >
                <span className="text-silver font-bold uppercase tracking-wide text-sm md:text-base">{faq.question || faq.q}</span>
                {activeIndex === i ? <ChevronUp className="text-cyan" /> : <ChevronDown className="text-gray-500" />}
              </button>
              <motion.div initial={false} animate={{ height: activeIndex === i ? 'auto' : 0, opacity: activeIndex === i ? 1 : 0 }} className="overflow-hidden">
                <div className="p-6 pt-0 text-gray-400 text-sm md:text-base leading-relaxed border-t border-royal/10">{faq.answer || faq.a}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

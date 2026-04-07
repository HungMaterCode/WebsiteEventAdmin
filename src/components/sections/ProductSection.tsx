'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function ProductSection({ products, onOpenProduct }: { products: any[], onOpenProduct: (product: any) => void }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative bg-midnight overflow-hidden" id="merch">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-magenta/10 rounded-full blur-3xl -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl translate-x-1/4"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4">
            <span className="text-silver">Sản Phẩm </span>
            <span className="text-gradient">Độc Quyền</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Chiêm ngưỡng bộ sưu tập vật phẩm di sản độc quyền. Bạn có thể sở hữu trực tiếp tại quầy lưu niệm trong đêm diễn.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta to-cyan mx-auto mt-6 rounded-full glow-magenta"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any, index: number) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative bg-royal/10 border border-royal/30 rounded-3xl p-4 hover:border-magenta/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,136,0.1)]">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 bg-magenta text-white text-[10px] font-bold uppercase tracking-widest rounded-full glow-magenta shadow-lg">{product.tag || product.category}</span>
                </div>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <button
                    suppressHydrationWarning
                    onClick={() => onOpenProduct(product)}
                    className="w-full py-2 bg-white text-midnight font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-cyan transition-colors shadow-lg"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-lg font-bold text-silver group-hover:text-cyan transition-colors line-clamp-1">{product.name}</h3>
                <span className="text-cyan font-display font-black text-sm shrink-0 mt-1">{formatCurrency(product.price)}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 h-10">{product.description || product.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-royal/30 to-magenta/10 border border-magenta/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-magenta/20 flex items-center justify-center shrink-0"><Sparkles className="w-8 h-8 text-magenta" /></div>
            <div>
              <h4 className="text-xl font-bold text-silver uppercase tracking-wide">Ưu đãi đặc biệt cho hạng vé VIP</h4>
              <p className="text-gray-400">Nhận ngay trọn bộ Combo Sản Phẩm Heritage khi sở hữu vé VIP.</p>
            </div>
          </div>
          <a href="#tickets" className="px-8 py-3 bg-magenta text-white font-bold rounded-full uppercase tracking-widest hover:scale-105 transition-transform glow-magenta">Mua Vé VIP Ngay</a>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

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
            <span className="text-silver">Quà Tặng </span>
            <span className="text-gradient">Độc Quyền</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Sở hữu những vật phẩm mang đậm dấu ấn Cyber-Heritage, chỉ có tại đêm bế mạc Festival Ninh Bình 2024.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta to-cyan mx-auto mt-6 rounded-full glow-magenta"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any, index: number) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative bg-royal/10 border border-royal/30 rounded-3xl p-4 hover:border-magenta/50 transition-all duration-500">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 bg-magenta text-white text-[10px] font-bold uppercase tracking-widest rounded-full glow-magenta">{product.tag || product.category}</span>
                </div>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <button
                    suppressHydrationWarning
                    onClick={() => onOpenProduct(product)}
                    className="w-full py-2 bg-white text-midnight font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-cyan transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-silver mb-2 group-hover:text-cyan transition-colors">{product.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description || product.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-royal/30 to-magenta/10 border border-magenta/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-magenta/20 flex items-center justify-center shrink-0"><Sparkles className="w-8 h-8 text-magenta" /></div>
            <div>
              <h4 className="text-xl font-bold text-silver uppercase tracking-wide">Ưu đãi đặc biệt cho hạng vé VIP</h4>
              <p className="text-gray-400">Nhận ngay trọn bộ Combo Quà Tặng Heritage khi sở hữu vé VIP.</p>
            </div>
          </div>
          <a href="#tickets" className="px-8 py-3 bg-magenta text-white font-bold rounded-full uppercase tracking-widest hover:scale-105 transition-transform glow-magenta">Mua Vé VIP Ngay</a>
        </motion.div>
      </div>
    </section>
  );
}

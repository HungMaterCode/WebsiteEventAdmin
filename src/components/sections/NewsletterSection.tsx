'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [submitted, setSubmitted] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative bg-midnight overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto bg-gradient-to-br from-royal/30 to-midnight border border-royal/50 rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan via-magenta to-gold"></div>
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-wider mb-6"><span className="text-silver">Đừng Bỏ Lỡ </span><span className="text-gradient">Khoảnh Khắc Nào</span></h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Đăng ký nhận bản tin để cập nhật thông tin mới nhất.</p>
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-teal/10 border border-teal/30 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-teal font-bold uppercase tracking-widest"><CheckCircle2 className="w-6 h-6" />Cảm ơn bạn đã đăng ký!</div>
            </motion.div>
          ) : (
            <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <input
                suppressHydrationWarning
                required
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-4 rounded-full bg-midnight border border-royal/50 text-silver focus:outline-none focus:border-cyan transition-colors"
              />
              <button
                suppressHydrationWarning
                className="px-8 py-4 bg-cyan text-midnight font-bold rounded-full uppercase tracking-widest hover:bg-white transition-all glow-cyan"
              >
                Đăng Ký
              </button>
            </form>
          )}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-teal" /><span>Chúng tôi cam kết bảo mật thông tin của bạn.</span></div>
        </motion.div>
      </div>
    </section>
  );
}

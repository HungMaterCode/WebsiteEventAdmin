'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative bg-midnight border-t border-royal/20" id="contact">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-8">
              <span className="text-silver">Liên Hệ </span><span className="text-gradient block">Ban Tổ Chức</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">Bạn có thắc mắc hoặc cần hỗ trợ đặc biệt? Đừng ngần ngại liên hệ với chúng tôi.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center text-cyan border border-cyan/30 group-hover:bg-cyan group-hover:text-midnight transition-all"><Mail className="w-6 h-6" /></div>
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div><div className="text-silver font-bold">support@neonheritage.vn</div></div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center text-magenta border border-magenta/30 group-hover:bg-magenta group-hover:text-white transition-all"><Phone className="w-6 h-6" /></div>
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Hotline</div><div className="text-silver font-bold">1900 8888 (8:00 - 22:00)</div></div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center text-gold border border-gold/30 group-hover:bg-gold group-hover:text-midnight transition-all"><MapPin className="w-6 h-6" /></div>
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Văn phòng</div><div className="text-silver font-bold">Tầng 12, Tòa nhà Newday, Hà Nội</div></div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="p-8 md:p-10 bg-royal/10 border border-royal/30 rounded-[2rem] backdrop-blur-sm">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal/50"><CheckCircle2 className="w-10 h-10 text-teal" /></div>
                  <h3 className="text-2xl font-display font-black text-silver uppercase mb-2">Đã Gửi Thành Công!</h3>
                  <p className="text-gray-400 mb-8">Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ làm việc.</p>
                  <button onClick={() => setSubmitted(false)} className="text-cyan font-bold uppercase tracking-widest text-sm hover:underline">Gửi tin nhắn khác</button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Họ và Tên</label>
                      <input
                        suppressHydrationWarning
                        name="name"
                        required
                        type="text"
                        className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                      <input
                        suppressHydrationWarning
                        name="email"
                        required
                        type="email"
                        className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Chủ đề</label>
                    <select suppressHydrationWarning name="subject" className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all appearance-none">
                      <option>Hỗ trợ đặt vé</option><option>Thông tin sự kiện</option><option>Hợp tác tài trợ</option><option>Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lời nhắn</label>
                    <textarea suppressHydrationWarning name="message" required rows={4} className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all resize-none" placeholder="Nhập nội dung cần hỗ trợ..."></textarea>
                  </div>
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-primary rounded-xl font-bold uppercase tracking-widest text-white glow-magenta hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send className="w-5 h-5" />Gửi Tin Nhắn</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

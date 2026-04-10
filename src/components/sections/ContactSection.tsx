'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signIn } from 'next-auth/react';

export default function ContactSection() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAuthenticated = status === 'authenticated';
  const isAuthLoading = status === 'loading';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          subject: 'Liên hệ từ Website',
        }),
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Server returned an unexpected response format.');
      }

      if (!res.ok) throw new Error(data.error || 'Gửi tin nhắn thất bại');

      toast.success('Gửi tin nhắn thành công!');
      setSubmitted(true);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
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
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div><div className="text-silver font-bold">{process.env.NEXT_PUBLIC_EMAIL || 'support@neonheritage.vn'}</div></div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center text-magenta border border-magenta/30 group-hover:bg-magenta group-hover:text-white transition-all"><Phone className="w-6 h-6" /></div>
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Hotline</div><div className="text-silver font-bold">{process.env.NEXT_PUBLIC_HOTLINE || '1900 8888 (8:00 - 22:00)'}</div></div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center text-gold border border-gold/30 group-hover:bg-gold group-hover:text-midnight transition-all"><MapPin className="w-6 h-6" /></div>
                <div><div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Văn phòng</div><div className="text-silver font-bold">{process.env.NEXT_PUBLIC_OFFICE || 'Tầng 12, Tòa nhà Newday, Hà Nội'}</div></div>
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
                <form className="relative space-y-6" onSubmit={handleSubmit}>
                  {/* Overlay for unauthenticated users */}
                  {!isAuthenticated && !isAuthLoading && (
                    <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-midnight/40 rounded-[1.5rem] flex items-center justify-center p-6 text-center">
                      <div className="space-y-4 max-w-xs scale-in">
                        <div className="w-12 h-12 rounded-full bg-magenta/20 flex items-center justify-center mx-auto border border-magenta/30">
                          <Lock className="w-6 h-6 text-magenta" />
                        </div>
                        <p className="text-sm font-bold text-silver uppercase tracking-wider">Vui lòng đăng nhập để gửi tin nhắn hỗ trợ</p>
                        <button 
                          type="button"
                          onClick={() => signIn('google')}
                          className="px-6 py-2 bg-magenta text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-magenta/80 transition-all glow-magenta"
                        >
                          Đăng nhập bằng Google
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Họ và Tên</label>
                      <input
                        suppressHydrationWarning
                        name="name"
                        required
                        type="text"
                        defaultValue={session?.user?.name || ''}
                        readOnly={isAuthenticated}
                        className={`w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all ${isAuthenticated ? 'opacity-60 cursor-not-allowed bg-royal/10' : ''}`}
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
                        defaultValue={session?.user?.email || ''}
                        readOnly={isAuthenticated}
                        className={`w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all ${isAuthenticated ? 'opacity-60 cursor-not-allowed bg-royal/10' : ''}`}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Số điện thoại</label>
                    <input
                      suppressHydrationWarning
                      name="phone"
                      required
                      type="tel"
                      pattern="^0[0-9]{9}$"
                      minLength={10}
                      maxLength={10}
                      title="Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0"
                      className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all"
                      placeholder="Ví dụ: 0912345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lời nhắn</label>
                    <textarea suppressHydrationWarning name="message" required rows={4} className="w-full px-5 py-3 rounded-xl bg-midnight border border-royal/30 text-silver focus:border-cyan outline-none transition-all resize-none" placeholder="Nhập nội dung cần hỗ trợ..."></textarea>
                  </div>
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
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

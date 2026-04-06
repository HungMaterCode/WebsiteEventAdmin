'use client';
import React from 'react';
import { motion } from 'motion/react';
import { X, Ticket, CreditCard, Wallet, CheckCircle2, Smartphone } from 'lucide-react';

type Step = 'info' | 'payment' | 'confirm';

export default function BookingModal({ isOpen, onClose, selectedType }: { isOpen: boolean, onClose: () => void, selectedType: 'GA' | 'VIP' | null }) {
  const [step, setStep] = React.useState<Step>('info');
  const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', quantity: 1, accessories: [] as string[] });
  const [bookingResult, setBookingResult] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const ticketPrice = selectedType === 'VIP' ? 1500000 : 500000;
  const total = ticketPrice * formData.quantity;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ticketType: selectedType,
          totalPrice: total,
        }),
      });
      const data = await res.json();
      setBookingResult(data);
      setStep('confirm');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-lg bg-midnight/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta via-cyan to-gold"></div>
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['info', 'payment', 'confirm'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step === s ? 'bg-magenta border-magenta text-white' : i < ['info', 'payment', 'confirm'].indexOf(step) ? 'bg-teal border-teal text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{i + 1}</div>
              {i < 2 && <div className={`flex-1 h-0.5 ${i < ['info', 'payment', 'confirm'].indexOf(step) ? 'bg-teal' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 'info' && (
          <div className="space-y-6">
            <div><h3 className="text-2xl font-display font-black text-white uppercase">Thông tin đặt vé</h3><p className="text-gray-400 text-sm mt-1">Vé {selectedType} - {ticketPrice.toLocaleString()} VNĐ</p></div>
            <div className="space-y-4">
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan/50 text-sm" required />
              <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan/50 text-sm" required />
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Số điện thoại" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan/50 text-sm" required />
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">-</button>
                  <span className="w-10 text-center text-white font-bold">{formData.quantity}</span>
                  <button type="button" onClick={() => setFormData({...formData, quantity: Math.min(10, formData.quantity + 1)})} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between text-lg font-bold"><span className="text-gray-400">Tổng cộng:</span><span className="text-cyan">{total.toLocaleString()} VNĐ</span></div>
            </div>
            <button onClick={() => setStep('payment')} disabled={!formData.name || !formData.email || !formData.phone} className="w-full py-4 bg-gradient-primary rounded-2xl font-bold uppercase tracking-widest text-white glow-magenta hover:scale-[1.02] transition-all disabled:opacity-50 text-sm">Tiếp tục thanh toán</button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div><h3 className="text-2xl font-display font-black text-white uppercase">Thanh toán</h3><p className="text-gray-400 text-sm mt-1">Chọn phương thức</p></div>
            <div className="space-y-3">
              {[
                { icon: <CreditCard className="w-5 h-5" />, name: "Chuyển khoản ngân hàng", desc: "ACB / Vietcombank" },
                { icon: <Wallet className="w-5 h-5" />, name: "Ví Momo / ZaloPay", desc: "Quét QR thanh toán" },
                { icon: <Smartphone className="w-5 h-5" />, name: "Thanh toán tại quầy", desc: "Nhận vé trực tiếp" },
              ].map((method, i) => (
                <button key={i} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-all flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">{method.icon}</div>
                  <div><div className="text-white font-bold text-sm">{method.name}</div><div className="text-gray-500 text-xs">{method.desc}</div></div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('info')} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs">Quay lại</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-4 bg-gradient-primary rounded-2xl font-bold uppercase tracking-widest text-white glow-magenta text-xs disabled:opacity-50">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Xác nhận'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && bookingResult && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-teal/20 rounded-full flex items-center justify-center mx-auto border border-teal/50"><CheckCircle2 className="w-10 h-10 text-teal" /></div>
            <div>
              <h3 className="text-2xl font-display font-black text-white uppercase">Đặt Vé Thành Công!</h3>
              <p className="text-gray-400 text-sm mt-2">Mã đặt chỗ của bạn:</p>
              <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-cyan/30">
                <span className="text-2xl font-mono font-bold text-cyan tracking-wider">{bookingResult.bookingCode}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Thông tin vé đã được gửi tới email {formData.email}</p>
            <button onClick={() => { onClose(); setStep('info'); setBookingResult(null); setFormData({name:'',email:'',phone:'',quantity:1,accessories:[]}); }} className="w-full py-4 bg-gradient-primary rounded-2xl font-bold uppercase tracking-widest text-white glow-magenta text-sm">Đóng</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

'use client';
import React from 'react';
import { motion } from 'motion/react';
import { X, Ticket, CreditCard, Wallet, CheckCircle2, Smartphone, Heart, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Step = 'select' | 'info' | 'payment' | 'confirm';

export default function BookingModal({ isOpen, onClose, selectedType }: { isOpen: boolean, onClose: () => void, selectedType: 'GA' | 'VIP' | null }) {
  const { data: session } = useSession();
  const [internalSelectedType, setInternalSelectedType] = React.useState<'GA' | 'VIP' | null>(selectedType);
  const [step, setStep] = React.useState<Step>('select');
  const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', quantity: 1, accessories: [] as string[] });
  const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);
  const [bookingResult, setBookingResult] = React.useState<{ bookingCode: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Discount State
  const [discountCode, setDiscountCode] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [appliedDiscount, setAppliedDiscount] = React.useState<{ code: string, type: string, value: number, name: string } | null>(null);
  const [discountError, setDiscountError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (selectedType) {
        setInternalSelectedType(selectedType);
        setStep('info');
      } else {
        setInternalSelectedType(null);
        setStep('select');
      }
      
      if (session?.user?.email) {
        setFormData(prev => ({ 
          ...prev, 
          email: session.user?.email || '', 
          name: prev.name || session.user?.name || '' 
        }));
      }
    }
  }, [session, isOpen, selectedType]);

  const ticketPrice = internalSelectedType === 'VIP' ? 1500000 : 500000;
  const subtotal = ticketPrice * formData.quantity;
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'PERCENT') {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else {
      discountAmount = appliedDiscount.value;
    }
  }
  
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    setIsValidating(true);
    setDiscountError('');
    try {
      const res = await fetch('/api/marketing/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount(data);
        setDiscountError('');
      } else {
        setDiscountError(data.error || 'Mã không hợp lệ');
        setAppliedDiscount(null);
      }
    } catch (e) {
      setDiscountError('Lỗi kết nối');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!paymentMethod || !internalSelectedType) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ticketType: internalSelectedType,
          totalPrice: total,
          discountCode: appliedDiscount?.code || null,
          discountAmount: discountAmount,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        throw new Error(`Lỗi hệ thống: ${res.status}`);
      }

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

  const steps: Step[] = ['select', 'info', 'payment', 'confirm'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-xl bg-midnight/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 px-4">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0 ${step === s ? 'bg-magenta border-magenta text-white ring-4 ring-magenta/20' : i < currentStepIndex ? 'bg-teal border-teal text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{i + 1}</div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStepIndex ? 'bg-teal' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 'select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">Chọn Hạng Vé</h3>
              <p className="text-gray-400 text-sm mt-2">Nâng cấp trải nghiệm để tận hưởng lễ hội trọn vẹn nhất</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => { setInternalSelectedType('GA'); setStep('info'); }}
                className="group relative p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/5 transition-all text-left overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan/10 rounded-full blur-2xl group-hover:bg-cyan/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan mb-6 group-hover:scale-110 transition-transform">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-display font-black text-white uppercase mb-1">GA Ticket</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">Trải nghiệm âm nhạc sôi động tại khu vực General Admission.</p>
                  <div className="text-xl font-bold text-cyan">500.000 <span className="text-[10px] text-gray-500">VNĐ</span></div>
                </div>
              </button>

              <button 
                onClick={() => { setInternalSelectedType('VIP'); setStep('info'); }}
                className="group relative p-6 rounded-[2.5rem] bg-[#FF0088]/10 border border-[#FF0088]/30 hover:border-[#FF0088] hover:bg-[#FF0088]/20 transition-all text-left overflow-hidden ring-1 ring-[#FF0088]/20"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF0088]/20 rounded-full blur-2xl group-hover:bg-[#FF0088]/30 transition-all"></div>
                <div className="absolute top-4 right-6 px-3 py-1 bg-[#FF0088] rounded-full text-[8px] font-black uppercase text-white tracking-widest shadow-[0_0_15px_rgba(255,0,136,0.5)]">Recommended</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF0088]/20 flex items-center justify-center text-[#FF0088] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,0,136,0.2)]">
                    <Heart className="w-6 h-6 fill-[#FF0088]" />
                  </div>
                  <h4 className="text-xl font-display font-black text-white uppercase mb-1">VIP Ticket</h4>
                  <ul className="text-[10px] text-gray-400 space-y-1 mb-6 leading-relaxed">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#FF0088]"></div> Sát sân khấu & Lối đi riêng</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#FF0088]"></div> Quà tặng độc quyền Neon</li>
                  </ul>
                  <div className="text-xl font-bold text-[#FF0088]">1.500.000 <span className="text-[10px] text-gray-500 uppercase tracking-widest">VNĐ</span></div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Thông tin khách hàng</h3>
              <p className="text-gray-400 text-sm mt-1">Vé <span className={internalSelectedType === 'VIP' ? 'text-[#FF0088] font-bold' : 'text-cyan font-bold'}>{internalSelectedType} TICKET</span> - {ticketPrice.toLocaleString()} VNĐ</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"><User className="w-4 h-4" /></div>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all text-sm" required />
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"><Smartphone className="w-4 h-4" /></div>
                <input value={formData.email} readOnly placeholder="Email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-gray-400 focus:outline-none cursor-not-allowed text-sm" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-magenta font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">Theo tài khoản</div>
              </div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"><Smartphone className="w-4 h-4" /></div>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Số điện thoại" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all text-sm" required />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số lượng vé:</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-cyan/30 transition-all">-</button>
                  <span className="w-6 text-center text-white font-bold">{formData.quantity}</span>
                  <button type="button" onClick={() => setFormData({...formData, quantity: Math.min(10, formData.quantity + 1)})} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-cyan/30 transition-all">+</button>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    value={discountCode} 
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())} 
                    placeholder="Mã giảm giá" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan/50 text-xs" 
                    disabled={!!appliedDiscount}
                  />
                  {appliedDiscount ? (
                    <button onClick={() => { setAppliedDiscount(null); setDiscountCode(''); }} className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase transition-all">Gỡ mã</button>
                  ) : (
                    <button onClick={handleApplyDiscount} disabled={!discountCode || isValidating} className="px-4 py-3 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan text-[10px] font-bold uppercase hover:bg-cyan/20 transition-all disabled:opacity-50">
                      {isValidating ? '...' : 'Áp dụng'}
                    </button>
                  )}
                </div>
                {discountError && <p className="text-red-500 text-[10px] pl-2">{discountError}</p>}
                {appliedDiscount && <p className="text-teal text-[10px] pl-2">✓ Đã áp dụng: <b>{appliedDiscount.name}</b></p>}
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()} VNĐ</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-xs text-teal px-2 italic font-medium">
                  <span>Giảm giá:</span>
                  <span>-{discountAmount.toLocaleString()} VNĐ</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-[#00FFFF]/5 p-4 rounded-xl border border-[#00FFFF]/20">
                <span className="text-sm font-bold text-gray-400">TỔNG THANH TOÁN:</span>
                <span className="text-xl font-display font-black text-cyan">{total.toLocaleString()} VNĐ</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              {!selectedType && (
                <button onClick={() => setStep('select')} className="px-6 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">Quay lại</button>
              )}
              <button 
                onClick={() => setStep('payment')} 
                disabled={!formData.name || !formData.phone} 
                className="flex-1 py-4 bg-gradient-to-r from-[#FF0088] to-[#4F1F76] rounded-2xl font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(255,0,136,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 text-[10px]"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div><h3 className="text-2xl font-display font-black text-white uppercase">Thanh toán</h3><p className="text-gray-400 text-sm mt-1">Chọn phương thức để tiếp tục</p></div>
            <div className="space-y-3">
              {[
                { id: 'bank', icon: <CreditCard className="w-5 h-5" />, name: "Chuyển khoản ngân hàng", desc: "ACB / Vietcombank" },
                { id: 'momo', icon: <Wallet className="w-5 h-5" />, name: "Ví Momo / ZaloPay", desc: "Quét QR nhanh chóng" },
              ].map((method) => (
                <button 
                  key={method.id} 
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${paymentMethod === method.id ? 'bg-cyan/10 border-cyan/50 ring-1 ring-cyan/50' : 'bg-white/5 border-white/10 hover:border-cyan/30'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'bg-cyan text-midnight' : 'bg-cyan/10 text-cyan'}`}>{method.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{method.name}</div>
                    <div className="text-gray-500 text-xs">{method.desc}</div>
                  </div>
                  {paymentMethod === method.id && <div className="w-6 h-6 rounded-full bg-cyan flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-midnight"></div></div>}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('info')} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">Quay lại</button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !paymentMethod} 
                className="flex-1 py-4 bg-gradient-primary rounded-2xl font-bold uppercase tracking-widest text-white glow-magenta text-xs disabled:opacity-50 transition-all"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Xác nhận Đặt vé'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && bookingResult && (
          <div className="text-center space-y-8 py-4">
            <div className="relative">
              <div className="w-24 h-24 bg-teal/20 rounded-full flex items-center justify-center mx-auto border border-teal/50">
                <CheckCircle2 className="w-12 h-12 text-teal" />
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-10 h-10 bg-magenta rounded-full flex items-center justify-center border-4 border-midnight">
                <Heart className="w-5 h-5 text-white fill-white" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-wider">Đặt Vé Thành Công!</h3>
              <p className="text-gray-400 text-sm">Cảm ơn {formData.name} đã đồng hành cùng chúng tôi.</p>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-cyan/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent"></div>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 relative z-10">Mã đặt chỗ của bạn</p>
              <div className="text-3xl font-mono font-black text-cyan tracking-[0.3em] relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{bookingResult.bookingCode}</div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal/5 border border-teal/20 text-teal-400 text-sm leading-relaxed">
                <p className="font-bold mb-1">Mã QR Check-In đã được gửi!</p>
                <p className="text-xs opacity-70">Vui lòng kiểm tra hộp thư đến tại <span className="font-bold underline">{formData.email}</span> để nhận vé điện tử kèm mã QR vào cổng.</p>
              </div>
              
              <div className="text-xs text-gray-500 italic">
                * Mã QR này sẽ được sử dụng để quét tại cổng soát vé. Vui lòng không chia sẻ mã này với người lạ.
              </div>
            </div>

            <button 
              onClick={() => { onClose(); setStep('info'); setBookingResult(null); setFormData({name:'',email:'',phone:'',quantity:1,accessories:[]}); setPaymentMethod(null); }} 
              className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold uppercase tracking-widest text-silver text-sm transition-all"
            >
              Trở về trang chủ
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

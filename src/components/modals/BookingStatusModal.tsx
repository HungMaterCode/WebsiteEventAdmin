'use client';
import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

export default function BookingStatusModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [bookingId, setBookingId] = React.useState('');
  const [booking, setBooking] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        setBooking(await res.json());
      } else {
        setError('Booking not found. Please check your ID.');
      }
    } catch {
      setError('Failed to fetch booking status.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-xl bg-midnight/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-royal"></div>
        <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>
        <div className="mb-8 md:mb-10">
          <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">Kiểm tra trạng thái vé</h3>
          <p className="text-gray-400 text-xs md:text-sm mt-2">Nhập Mã đặt chỗ của bạn để quản lý thông tin</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
          <input value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="Nhập Mã đặt chỗ (VD: NH-123...)" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all text-sm" />
          <button type="submit" disabled={loading} className="px-8 py-4 bg-cyan text-midnight font-bold rounded-2xl hover:scale-105 transition-all disabled:opacity-50 text-sm">{loading ? 'Đang tìm...' : 'Tìm kiếm'}</button>
        </form>
        {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center mb-8">{error}</div>}
        {booking && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tên khách hàng</p><p className="text-lg font-bold text-white">{booking.name}</p></div>
                <div className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${booking.status === 'confirmed' || booking.status === 'CONFIRMED' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-gold/10 text-gold border-gold/20'}`}>{booking.status === 'confirmed' || booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Trạng thái vào cửa</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${booking.checkInTime ? 'bg-teal glow-teal' : 'bg-gray-700'}`}></div>
                    <span className={`text-xs font-bold ${booking.checkInTime ? 'text-teal' : 'text-gray-500'}`}>{booking.checkInTime ? 'Đã vào cửa' : 'Chưa vào cửa'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Trạng thái ra về</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${booking.checkOutTime ? 'bg-magenta glow-magenta' : 'bg-gray-700'}`}></div>
                    <span className={`text-xs font-bold ${booking.checkOutTime ? 'text-magenta' : 'text-gray-500'}`}>{booking.checkOutTime ? 'Đã ra về' : 'Chưa ra về'}</span>
                  </div>
                </div>
              </div>
              {booking.surveyCompleted && (
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal/20 text-teal"><CheckCircle2 className="w-6 h-6" /></div>
                  <p className="text-sm font-bold text-teal uppercase tracking-widest">Khảo sát đã hoàn thành</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

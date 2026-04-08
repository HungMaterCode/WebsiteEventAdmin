'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Calendar, User, Phone, CreditCard, ChevronRight, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  phone: string;
  createdAt: string;
}

export default function MyTicketsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTicket, setSelectedTicket] = React.useState<Booking | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetchUserBookings();
    }
  }, [isOpen]);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/bookings');
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-[#060010]/90 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,31,118,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30">
              <Ticket className="w-5 h-5 text-[#00FFFF]" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-[#FFFFFF] uppercase tracking-widest">Vé Của Tôi</h3>
              <p className="text-[10px] text-[#8A8F98] uppercase tracking-widest mt-0.5">Lịch sử đặt vé và vé điện tử</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#8A8F98] hover:text-[#FFFFFF] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8A8F98]">Đang tải dữ liệu...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Ticket className="w-8 h-8 text-[#4F1F76]" />
              </div>
              <h4 className="text-lg font-bold text-[#FFFFFF] mb-2 uppercase tracking-tight">Bạn chưa có vé nào</h4>
              <p className="text-sm text-[#8A8F98] max-w-[250px] mb-8">Hãy chọn cho mình một vị trí tại Neon Heritage Festival ngay hôm nay!</p>
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF0088] to-[#4F1F76] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all glow-magenta"
              >
                Mua Vé Ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {selectedTicket ? (
                  <motion.div 
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center"
                  >
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="self-start flex items-center gap-2 text-[10px] font-bold text-[#00FFFF] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-all"
                    >
                      <ChevronRight className="w-3 h-3 rotate-180" /> Quay lại danh sách
                    </button>

                    <div className="w-full max-w-[280px] bg-[#FFFFFF] p-5 rounded-2xl mb-6 shadow-inner flex flex-col items-center">
                      <QRCodeCanvas 
                        value={selectedTicket.bookingCode}
                        size={180}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-[8px] uppercase tracking-[0.3em] font-black text-[#0D0716]/30 mb-0.5">Mã Booking</div>
                        <div className="text-xl font-mono font-black text-[#0D0716]">{selectedTicket.bookingCode}</div>
                      </div>
                    </div>

                    <div className="w-full space-y-4 bg-white/5 rounded-[2rem] p-6 border border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest">Loại Vé</p>
                          <p className={`text-sm font-black ${selectedTicket.ticketType === 'VIP' ? 'text-[#FF0088]' : 'text-[#00FFFF]'}`}>{selectedTicket.ticketType} TICKET</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest">Số Lượng</p>
                          <p className="text-sm font-bold text-[#FFFFFF]">{selectedTicket.quantity} Vé</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest">Ngày Mua</p>
                          <p className="text-sm font-bold text-[#FFFFFF]">{new Date(selectedTicket.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest">Tổng Tiền</p>
                          <p className="text-sm font-black text-[#00FFFF]">{selectedTicket.totalPrice.toLocaleString()} VNĐ</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#8A8F98]" />
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-[#8A8F98] uppercase tracking-widest">Chủ Vé</p>
                            <p className="text-xs font-bold text-[#FFFFFF]">{selectedTicket.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-[#8A8F98]" />
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-[#8A8F98] uppercase tracking-widest">Số Điện Thoại</p>
                            <p className="text-xs font-bold text-[#FFFFFF]">{selectedTicket.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    {bookings.map((booking) => (
                      <button 
                        key={booking.id}
                        onClick={() => setSelectedTicket(booking)}
                        className="w-full group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:border-[#00FFFF]/30 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${booking.ticketType === 'VIP' ? 'bg-[#FF0088]/10 border-[#FF0088]/30 text-[#FF0088]' : 'bg-[#00FFFF]/10 border-[#00FFFF]/30 text-[#00FFFF]'}`}>
                            <QrCode className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="text-xs font-mono font-black text-[#FFFFFF] tracking-widest">{booking.bookingCode}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${booking.ticketType === 'VIP' ? 'bg-[#FF0088]/10 text-[#FF0088]' : 'bg-[#00FFFF]/10 text-[#00FFFF]'}`}>
                                {booking.ticketType}
                              </span>
                              <span className="text-[10px] text-[#8A8F98]">{booking.quantity} Vé • {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-[#FFFFFF]">{booking.totalPrice.toLocaleString()} VNĐ</p>
                            <p className="text-[8px] uppercase tracking-widest text-[#8A8F98]">Đã thanh toán</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8A8F98] group-hover:text-[#00FFFF] transition-all group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-[#4F1F76]/30 text-center shrink-0">
          <p className="text-[9px] text-[#8A8F98] uppercase tracking-widest font-medium">Neon Heritage Experience &copy; 2024</p>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

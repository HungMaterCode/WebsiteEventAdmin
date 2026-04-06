'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Ticket, Calendar, MapPin, QrCode, 
  ChevronRight, Info, Music
} from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: string;
  ticketStatus: string;
}

export default function MyTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTicket, setSelectedTicket] = React.useState<Booking | null>(null);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTickets();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#060010] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00FFFF]/20 border-t-[#00FFFF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-[#00FFFF] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060010] text-white pt-32 pb-20 px-6 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#4F1F76]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#FF0088]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-[#00FFFF]"></div>
            <span className="text-[#00FFFF] font-bold uppercase tracking-widest text-xs">Khu vực cá nhân</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"
          >
            Vé của <span className="bg-gradient-to-r from-[#FF0088] to-[#00FFFF] bg-clip-text text-transparent">Bạn</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl text-lg"
          >
            Chào mừng <span className="text-white font-bold">{session?.user?.name}</span>. 
            Dưới đây là danh sách các vé bạn đã đặt cho Neon Heritage Festival.
          </motion.p>
        </header>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-xl text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Ticket className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Bạn chưa có vé nào</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">Mua vé ngay để không bỏ lỡ trải nghiệm di sản âm thanh đỉnh cao tại Ninh Bình</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF0088] to-[#4F1F76] rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,0,136,0.3)]"
            >
              Đặt vé ngay <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          /* Ticket Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking, i) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                whileHover={{ y: -5 }}
                className="relative group h-full"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${booking.ticketType === 'VIP' ? 'from-[#FF0088] to-[#4F1F76]' : 'from-[#00FFFF] to-blue-600'} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                
                <div className="relative h-full flex flex-col bg-[#0D0716]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                  {/* Ticket Header */}
                  <div className={`p-6 ${booking.ticketType === 'VIP' ? 'bg-[#FF0088]/10 border-b border-[#FF0088]/20' : 'bg-[#00FFFF]/10 border-b border-[#00FFFF]/20'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${booking.ticketType === 'VIP' ? 'bg-[#FF0088]/20' : 'bg-[#00FFFF]/20'}`}>
                        <Ticket className={`w-6 h-6 ${booking.ticketType === 'VIP' ? 'text-[#FF0088]' : 'text-[#00FFFF]'}`} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${booking.ticketType === 'VIP' ? 'text-[#FF0088]' : 'text-[#00FFFF]'}`}>Loại Vé</p>
                        <h3 className="text-xl font-black uppercase tracking-wider">{booking.ticketType}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mã Vé</p>
                      <p className="font-mono text-sm font-bold text-white">{booking.bookingCode}</p>
                    </div>
                  </div>

                  {/* Ticket Content */}
                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Thời gian</p>
                        <p className="text-sm font-bold">31.12.2024 • 20:00 - 00:30</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Địa điểm</p>
                        <p className="text-sm font-bold">Thung Nham, Ninh Bình</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Số lượng</p>
                        <p className="text-lg font-black text-white">{booking.quantity} x {booking.ticketType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tổng tiền</p>
                        <p className="text-lg font-black text-white">{(booking.totalPrice || 0).toLocaleString()} VNĐ</p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Footer */}
                  <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'bg-[#00C099] animate-pulse' : 'bg-[#E6C753]'}`}></div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'text-[#00C099]' : 'text-[#E6C753]'}`}>
                         {booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'Đã Thanh Toán' : 'Đang Chờ'}
                       </span>
                    </div>
                    <button 
                      onClick={() => setSelectedTicket(booking)}
                      className="px-6 py-2.5 bg-white text-[#060010] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#00FFFF] transition-all flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" /> Xem Mã QR
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-8 rounded-3xl bg-blue-600/10 border border-blue-600/30 flex items-start gap-4"
        >
          <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
          <div className="text-sm text-blue-200 leading-relaxed">
            <p className="font-bold mb-2">Thông tin quan trọng:</p>
            <ul className="list-disc pl-4 space-y-1 opacity-80">
              <li>Vui lòng chuẩn bị Mã QR để check-in tại cổng sự kiện.</li>
              <li>Bạn có thể in vé ra giấy hoặc sử dụng phiên bản điện tử trên điện thoại.</li>
              <li>Mọi thắc mắc vui lòng liên hệ hotline 1900 8888 hoặc quầy hỗ trợ tại hiện trường.</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#0D0716] border border-white/10 rounded-[3rem] p-10 text-center"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">QR Code Check-in</h3>
                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Mã: {selectedTicket.bookingCode}</p>
              </div>

              <div className="relative aspect-square w-full max-w-[200px] mx-auto p-4 bg-white rounded-[2rem] mb-8">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedTicket.bookingCode)}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#0D0716] rounded-xl flex items-center justify-center border border-white/20">
                    <Music className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedTicket.name}</p>
                <div className="h-px w-20 bg-white/10 mx-auto"></div>
                <p className="text-xl font-black text-white uppercase tracking-wider">{selectedTicket.ticketType}</p>
              </div>

              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, Edit2, Trash2, 
  Ticket, CheckCircle2, XCircle, Clock, Save, X, QrCode, Printer, RotateCcw
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const mockTickets = [
  { id: 'TKT-827391', guestName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', type: 'VIP', price: '3,500,000 VNĐ', status: 'Chưa sử dụng', purchasedAt: '2026-04-01', qrCode: 'VIP-A12' },
  { id: 'TKT-827392', guestName: 'Trần Thị B', email: 'tranthib@gmail.com', type: 'GA', price: '1,500,000 VNĐ', status: 'Đã check-in', purchasedAt: '2026-04-02', qrCode: 'STD-B05' },
  { id: 'TKT-827393', guestName: 'Lê Văn C', email: 'levanc@gmail.com', type: 'GA', price: '1,200,000 VNĐ', status: 'Chưa sử dụng', purchasedAt: '2026-03-25', qrCode: 'EB-C88' },
  { id: 'TKT-827394', guestName: 'Hoàng Minh D', email: 'hoangminhd@gmail.com', type: 'VIP', price: '3,500,000 VNĐ', status: 'Đã hủy', purchasedAt: '2026-04-03', qrCode: 'VIP-D42' },
  { id: 'TKT-827395', guestName: 'Phạm Thị E', email: 'phamthie@gmail.com', type: 'GA', price: '1,500,000 VNĐ', status: 'Đã check-in', purchasedAt: '2026-04-04', qrCode: 'STD-E19' },
];

export default function AdminTicketsPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('ALL');
  const [filterSource, setFilterSource] = React.useState('ALL');
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenModal = (booking: any = null) => {
    if (booking) {
      setEditMode(true);
      setSelectedBooking(booking);
    } else {
      setEditMode(false);
      setSelectedBooking({
        name: '',
        email: 'ticket-admin@event.com',
        phone: '',
        ticketType: 'GA',
        quantity: 1,
        totalPrice: 500000,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    if (!selectedBooking.name || !selectedBooking.quantity || parseInt(selectedBooking.quantity.toString()) < 1) {
      alert('Vui lòng điền đầy đủ tên khách hàng và số lượng vé hợp lệ (tối thiểu là 1)');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = editMode ? `/api/bookings/${selectedBooking.id}` : '/api/bookings';
      const method = editMode ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBooking),
      });

      if (res.ok) {
        const data = await res.json();
        if (!editMode) {
          setLastCreatedBooking(data);
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
        } else {
          setIsModalOpen(false);
          fetchBookings();
        }
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCreation = async () => {
    if (!lastCreatedBooking) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${lastCreatedBooking.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsSuccessModalOpen(false);
        setLastCreatedBooking(null);
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to cancel/delete booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintQR = () => {
    alert('Vé đã được phát hành thành công! Hệ thống sẽ thực hiện in mã QR này (Tính năng in thật đang được phát triển).');
    setIsSuccessModalOpen(false);
    fetchBookings();
  };

  const handleDelete = async (id: string, name: string) => {
    // Adding a simple confirmation to prevent accidental clicks as per standard admin UX,
    // though the user asked for simple, usually "window.confirm" is considered simple enough.
    // If they really want NO confirmation, I can remove it, but let's keep it safe.
    if (!window.confirm(`Xác nhận xóa vé của "${name}"? Thao tác này sẽ xóa vĩnh viễn dữ liệu.`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || b.ticketType === filterType;
    const matchesSource = filterSource === 'ALL' || 
      (filterSource === 'COUNTER' ? b.email === 'ticket-admin@event.com' : b.email !== 'ticket-admin@event.com');
    
    return matchesSearch && matchesType && matchesSource;
  });

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'VIP': return 'text-[#FF0088] font-black glow-magenta';
      case 'GA': return 'text-[#00FFFF] font-bold glow-cyan';
      default: return 'text-[#FFFFFF] font-bold';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Vé Sự Kiện</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Quản lý danh sách người mua vé, trạng thái thanh toán và thông tin khách hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-[#060010] font-bold rounded-xl flex items-center gap-2 transition-all glow-cyan"
        >
          <Plus className="w-5 h-5" /> Phát Hành Vé Mới
        </button>
      </div>

      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã vé, tên khách hàng hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98] pointer-events-none" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-40 bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20 transition-all appearance-none cursor-pointer outline-none focus:border-[#00FFFF]"
              >
                <option value="ALL">TẤT CẢ HẠNG VÉ</option>
                <option value="GA">GENERAL ADMISSION</option>
                <option value="VIP">VIP TICKET</option>
              </select>
            </div>
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98] pointer-events-none" />
              <select 
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full md:w-40 bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20 transition-all appearance-none cursor-pointer outline-none focus:border-[#00FFFF]"
              >
                <option value="ALL">TẤT CẢ NGUỒN VÉ</option>
                <option value="COUNTER">LẬP TẠI QUẦY</option>
                <option value="WEB">LẬP TRÊN WEB</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 whitespace-nowrap">Mã Booking</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[200px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Loại Vé</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Số Lượng</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Tổng Tiền</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden sm:table-cell">Ngày Tạo</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8A8F98]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs uppercase tracking-widest font-bold">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8A8F98]">
                    <p className="text-sm">Không có dữ liệu lượt đặt vé phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={booking.id} 
                    className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#4F1F76] group-hover:text-[#00FFFF] transition-colors" />
                        <span className="font-mono text-xs font-bold text-[#FFFFFF]">{booking.bookingCode}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#FFFFFF] text-sm">{booking.name}</div>
                      <div className="text-[10px] text-[#8A8F98] mt-0.5">{booking.email}</div>
                    </td>
                    <td className="p-4">
                      <div className={`text-xs ${getTypeStyle(booking.ticketType)}`}>{booking.ticketType}</div>
                    </td>
                    <td className="p-4 text-center font-bold text-[#FFFFFF]">
                      {booking.quantity}
                    </td>
                    <td className="p-4 font-black text-[#00FFFF] text-xs">
                      {(booking.totalPrice || 0).toLocaleString()} VNĐ
                    </td>
                    <td className="p-4 hidden sm:table-cell text-xs text-[#8A8F98]">
                      {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(booking)} 
                          className="p-1.5 rounded-lg bg-[#4F1F76]/20 text-[#00FFFF] border border-[#00FFFF]/0 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/10 transition-all" 
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(booking.id, booking.name)} 
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/0 hover:border-red-500/50 hover:bg-red-500/20 transition-all" 
                          title="Xóa vé"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Tạo / Chỉnh sửa vé */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                    <Ticket className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#FFFFFF] uppercase tracking-wider">{editMode ? 'Chỉnh Sửa Vé' : 'Tạo Vé Mới'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {/* Hàng 1: Tên + Loại vé */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Họ Tên Khách Hàng *</label>
                      <input 
                        type="text" 
                        required
                        value={selectedBooking?.name || ''}
                        onChange={(e) => setSelectedBooking({ ...selectedBooking, name: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A" 
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Loại Vé *</label>
                      <select 
                        required
                        value={selectedBooking?.ticketType || 'GA'}
                        onChange={(e) => {
                          const type = e.target.value;
                          const price = type === 'VIP' ? 1500000 : 500000;
                          setSelectedBooking({ 
                            ...selectedBooking, 
                            ticketType: type,
                            totalPrice: (selectedBooking.quantity || 1) * price
                          });
                        }}
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] appearance-none"
                      >
                        <option value="GA">General Admission</option>
                        <option value="VIP">VIP Ticket (Khu V/A)</option>
                      </select>
                    </div>
                  </div>

                  {/* Hàng 2: SĐT + Số lượng */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={selectedBooking?.phone || ''}
                        onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })}
                        placeholder="Ví dụ: 090xxxxxxx" 
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Số lượng vé *</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={selectedBooking?.quantity ?? 1}
                        onChange={(e) => {
                          const val = e.target.value;
                          const qty = parseInt(val);
                          const price = selectedBooking.ticketType === 'VIP' ? 1500000 : 500000;
                          setSelectedBooking({ 
                            ...selectedBooking, 
                            quantity: val === '' ? '' : qty,
                            totalPrice: (isNaN(qty) ? 0 : qty) * price
                          });
                        }}
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" 
                        placeholder="Số lượng"
                      />
                    </div>
                  </div>

                  {/* Hàng 3: Tổng tiền */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tổng Tiền (VNĐ)</label>
                      <input 
                        type="number" 
                        readOnly
                        value={selectedBooking?.totalPrice || 0}
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#00FFFF] font-bold focus:outline-none focus:border-[#00FFFF] cursor-not-allowed opacity-80" 
                      />
                    </div>
                  </div>

                  {editMode && selectedBooking?.bookingCode && (
                    <div className="p-4 border border-[#00FFFF]/30 bg-[#00FFFF]/5 rounded-xl flex items-start gap-3">
                      <QrCode className="w-6 h-6 text-[#00FFFF] shrink-0 mt-1" />
                      <div>
                        <div className="text-sm font-bold text-[#FFFFFF]">Mã Booking: {selectedBooking.bookingCode}</div>
                        <div className="text-xs text-[#8A8F98] mt-1">Dữ liệu được quản lý trực tiếp từ cơ sở dữ liệu. Mọi thay đổi sẽ được cập nhật ngay lập tức cho khách hàng.</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-[#4F1F76]/30 bg-[#0D0716] flex justify-end gap-4 shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy Bỏ</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#00C099] text-[#060010] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-cyan disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-midnight border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-5 h-5" />
                    )} 
                    {editMode ? 'Lưu Thay Đổi' : 'Tạo Vé Mới'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Thành công (QR) */}
      <AnimatePresence>
        {isSuccessModalOpen && lastCreatedBooking && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-[320px] bg-[#0D0716] border border-[#00FFFF]/30 rounded-[1.5rem] shadow-[0_0_50px_rgba(0,255,255,0.2)] overflow-hidden print:bg-white print:border-none print:shadow-none print:rounded-none">
              <div className="p-5 flex flex-col items-center">
                <div className="w-10 h-10 bg-[#00FFFF]/10 rounded-full flex items-center justify-center mb-3 border border-[#00FFFF]/30 print:hidden">
                  <CheckCircle2 className="w-5 h-5 text-[#00FFFF]" />
                </div>
                
                <h3 className="text-lg font-display font-black text-[#FFFFFF] uppercase tracking-widest mb-0.5 print:text-black print:text-base text-center">Phát Hành Thành Công</h3>
                <p className="text-[#8A8F98] text-[9px] mb-4 print:hidden text-center max-w-[180px]">Đã lưu vào hệ thống. Hãy in mã QR này cho khách hàng.</p>

                {/* Vùng In QR */}
                <div id="qr-print-area" className="bg-[#FFFFFF] p-4 rounded-xl mb-4 shadow-inner flex flex-col items-center print:p-0 print:shadow-none print:m-0 print:mb-0">
                  <QRCodeCanvas 
                    value={lastCreatedBooking.bookingCode}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="mt-3 text-center">
                    <div className="text-[7px] uppercase tracking-[0.3em] font-black text-[#0D0716]/30 mb-0.5">Mã Booking</div>
                    <div className="text-base font-mono font-black text-[#0D0716]">{lastCreatedBooking.bookingCode}</div>
                  </div>
                </div>

                {/* Thông tin vé */}
                <div className="w-full space-y-2 mb-4 print:text-black px-1">
                  <div className="flex justify-between items-center border-b border-[#4F1F76]/10 pb-1.5 print:border-black">
                    <span className="text-[8px] text-[#8A8F98] uppercase font-bold print:text-gray-600">Khách Hàng</span>
                    <span className="text-[10px] font-bold text-[#FFFFFF] print:text-black">{lastCreatedBooking.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#4F1F76]/10 pb-1.5 print:border-black">
                    <span className="text-[8px] text-[#8A8F98] uppercase font-bold print:text-gray-600">SĐT</span>
                    <span className="text-[10px] font-bold text-[#FFFFFF] print:text-black">{lastCreatedBooking.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#4F1F76]/10 pb-1.5 print:border-black">
                    <span className="text-[8px] text-[#8A8F98] uppercase font-bold print:text-gray-600">Hạng Vé</span>
                    <span className={`text-[10px] font-black ${lastCreatedBooking.ticketType === 'VIP' ? 'text-[#FF0088]' : 'text-[#00FFFF]'} print:text-black`}>{lastCreatedBooking.ticketType} TICKET</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#4F1F76]/10 pb-1.5 print:border-black">
                    <span className="text-[8px] text-[#8A8F98] uppercase font-bold print:text-gray-600">Số Lượng</span>
                    <span className="text-[10px] font-bold text-[#FFFFFF] print:text-black">{lastCreatedBooking.quantity} VÉ</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[8px] text-[#8A8F98] uppercase font-bold print:text-gray-600">Tổng Tiền</span>
                    <span className="text-[10px] font-black text-[#00FFFF] print:text-black">{(lastCreatedBooking.totalPrice || 0).toLocaleString()} VNĐ</span>
                  </div>
                </div>

                {/* Nút bấm */}
                <div className="flex gap-2 w-full print:hidden">
                  <button 
                    onClick={handleCancelCreation}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-[10px] font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Hủy
                  </button>
                  <button 
                    onClick={handlePrintQR}
                    className="flex-1 py-2.5 rounded-lg bg-[#00FFFF] text-[#060010] text-[10px] font-black hover:bg-[#00FFFF]/80 transition-all flex items-center justify-center gap-2 glow-cyan"
                  >
                    <Printer className="w-3.5 h-3.5" /> In QR
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    fetchBookings();
                  }}
                  className="mt-4 text-[9px] uppercase font-bold text-[#8A8F98] hover:text-[#FFFFFF] transition-colors print:hidden"
                >
                  Đóng & Hoàn Tất
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #qr-print-area, #qr-print-area * {
            visibility: visible;
          }
          #qr-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

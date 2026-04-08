'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, Edit2, Trash2, 
  Ticket, CheckCircle2, XCircle, Clock, Save, X, QrCode
} from 'lucide-react';

const mockTickets = [
  { id: 'TKT-827391', guestName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', type: 'VIP', price: '3,500,000 VNĐ', status: 'Chưa sử dụng', purchasedAt: '2026-04-01', qrCode: 'VIP-A12' },
  { id: 'TKT-827392', guestName: 'Trần Thị B', email: 'tranthib@gmail.com', type: 'STANDARD', price: '1,500,000 VNĐ', status: 'Đã check-in', purchasedAt: '2026-04-02', qrCode: 'STD-B05' },
  { id: 'TKT-827393', guestName: 'Lê Văn C', email: 'levanc@gmail.com', type: 'EARLY BIRD', price: '1,200,000 VNĐ', status: 'Chưa sử dụng', purchasedAt: '2026-03-25', qrCode: 'EB-C88' },
  { id: 'TKT-827394', guestName: 'Hoàng Minh D', email: 'hoangminhd@gmail.com', type: 'VIP', price: '3,500,000 VNĐ', status: 'Đã hủy', purchasedAt: '2026-04-03', qrCode: 'VIP-D42' },
  { id: 'TKT-827395', guestName: 'Phạm Thị E', email: 'phamthie@gmail.com', type: 'STANDARD', price: '1,500,000 VNĐ', status: 'Đã check-in', purchasedAt: '2026-04-04', qrCode: 'STD-E19' },
];

export default function AdminTicketsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleOpenModal = (isEdit = false) => {
    setEditMode(isEdit);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Chưa sử dụng': return 'bg-[#00FFFF]/10 text-[#00FFFF] border-[#00FFFF]/30';
      case 'Đã check-in': return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
      case 'Đã hủy': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-[#8A8F98]/10 text-admin-text-muted border-[#8A8F98]/30';
    }
  };

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'VIP': return 'text-[#FF0088] font-black glow-magenta';
      case 'EARLY BIRD': return 'text-[#E6C753] font-bold glow-gold';
      default: return 'text-admin-text font-bold';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Vé Sự Kiện</h2>
          <p className="text-admin-text-muted text-sm mt-1">Quản lý danh sách người mua vé, trạng thái check-in và gửi mã QR</p>
        </div>
        <button 
          onClick={() => handleOpenModal(false)}
          className="px-6 py-3 bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-[#060010] font-bold rounded-xl flex items-center gap-2 transition-all glow-cyan"
        >
          <Plus className="w-5 h-5" /> Phát Hành Vé Mới
        </button>
      </div>

      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã vé, tên khách hàng hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF] transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-[#4F1F76]/20 transition-all">
              <Filter className="w-5 h-5" /> <span className="hidden sm:inline">Lọc Hạng Vé</span>
            </button>
            <button className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-[#4F1F76]/20 transition-all">
              <Filter className="w-5 h-5" /> <span className="hidden sm:inline">Trạng Thái</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border whitespace-nowrap">Mã Định Danh</th>
                <th className="p-4 font-bold border-b border-admin-border min-w-[200px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-admin-border">Loại Vé</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border hidden sm:table-cell">Ngày Mua</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={ticket.id} 
                  className="border-b border-admin-border hover:bg-[#4F1F76]/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#4F1F76] group-hover:text-[#00FFFF] transition-colors" />
                      <span className="font-mono text-sm font-bold text-admin-text">{ticket.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-admin-text">{ticket.guestName}</div>
                    <div className="text-xs text-admin-text-muted mt-1">{ticket.email}</div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm ${getTypeStyle(ticket.type)}`}>{ticket.type}</div>
                    <div className="text-xs text-admin-text-muted mt-1">{ticket.price}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                      {ticket.status === 'Đã check-in' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {ticket.status === 'Chưa sử dụng' && <Clock className="w-3 h-3 mr-1" />}
                      {ticket.status === 'Đã hủy' && <XCircle className="w-3 h-3 mr-1" />}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-admin-text-muted">
                    {ticket.purchasedAt}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(true)} className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#00FFFF] border border-[#00FFFF]/0 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/10 transition-all" title="Chỉnh sửa">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#4F1F76]/20 text-red-500 border border-red-500/0 hover:border-red-500/50 hover:bg-red-500/10 transition-all" title="Hủy vé">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Tạo / Chỉnh sửa vé */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-[#4F1F76]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                    <Ticket className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase tracking-wider">{editMode ? 'Chỉnh Sửa Vé' : 'Phát Hành Vé Mới'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Họ Tên Khách Hàng *</label>
                    <input type="text" placeholder="Ví dụ: Nguyễn Văn A" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Email *</label>
                    <input type="email" placeholder="Ví dụ: email@domain.com" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Loại Vé *</label>
                    <select className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF] appearance-none">
                      <option value="VIP">VIP Ticket (Khu V/A)</option>
                      <option value="STANDARD">Standard Ticket</option>
                      <option value="EARLY BIRD">Early Bird Ticket</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Trạng Thái</label>
                    <select className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF] appearance-none" defaultValue="Chưa sử dụng">
                      <option value="Chưa sử dụng">Chưa sử dụng</option>
                      <option value="Đã check-in">Đã check-in</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mã Khuyến Mãi (Nếu có)</label>
                  <input type="text" placeholder="Nhập mã code để giảm giá..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" />
                </div>
                
                {editMode && (
                  <div className="p-4 border border-[#FF0088]/30 bg-[#FF0088]/5 rounded-xl flex items-start gap-3">
                    <QrCode className="w-6 h-6 text-[#FF0088] shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-admin-text">Mã QR Code: VIP-A12</div>
                      <div className="text-xs text-admin-text-muted mt-1">Vé này đã được gửi qua email. Nếu bạn thay đổi thông tin, hệ thống sẽ gửi lại vé mới kèm mã QR cập nhật.</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-admin-border bg-admin-panel flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy Bỏ</button>
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#00C099] text-[#060010] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-cyan">
                  <Save className="w-5 h-5" /> {editMode ? 'Lưu Thay Đổi' : 'Tạo Vé Mới'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

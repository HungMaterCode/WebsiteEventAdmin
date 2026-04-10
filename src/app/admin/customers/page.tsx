'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, Edit2, Trash2, ShieldAlert,
  Star, Mail, Phone, Calendar, Download, MoreVertical, X, Save
} from 'lucide-react';

const mockCustomers = [
  { id: 'CUS-001', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', totalSpent: '15,000,000 VNĐ', ticketCount: 12, status: 'VIP', lastActive: '2026-04-05' },
  { id: 'CUS-002', name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0987654321', totalSpent: '1,500,000 VNĐ', ticketCount: 2, status: 'REGULAR', lastActive: '2026-04-02' },
  { id: 'CUS-003', name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0912345678', totalSpent: '500,000 VNĐ', ticketCount: 1, status: 'REGULAR', lastActive: '2026-03-20' },
  { id: 'CUS-004', name: 'Hoàng Minh D', email: 'hoangminhd@gmail.com', phone: '0934567890', totalSpent: '8,500,000 VNĐ', ticketCount: 5, status: 'VIP', lastActive: '2026-04-04' },
  { id: 'CUS-005', name: 'Phạm Thị E', email: 'phamthie@gmail.com', phone: '0976543210', totalSpent: '0 VNĐ', ticketCount: 0, status: 'BANNED', lastActive: '2026-01-15' },
];

export default function AdminCustomersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'VIP': return 'bg-gold/10 text-gold border-gold/30 glow-gold font-bold';
      case 'REGULAR': return 'bg-cyan/10 text-cyan border-cyan/30';
      case 'BANNED': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-admin-bg/10 text-admin-text-muted border-admin-border/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Khách Hàng</h2>
          <p className="text-admin-text-muted text-sm mt-1">Cơ sở dữ liệu người dùng, hạng thành viên và lịch sử mua hàng</p>
        </div>
        <button className="px-6 py-3 border border-cyan/50 hover:bg-cyan/10 text-cyan font-bold rounded-xl flex items-center gap-2 transition-all">
          <Download className="w-5 h-5" /> Xuất Dữ Liệu (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-20 h-20 text-cyan" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Tổng Khách Hàng</div>
          <div className="text-3xl font-display font-black text-cyan glow-cyan">14,258</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Star className="w-20 h-20 text-gold" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Khách Hàng VIP</div>
          <div className="text-3xl font-display font-black text-gold glow-gold">2,450</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldAlert className="w-20 h-20 text-red-500" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Tài Khoản Bị Khóa</div>
          <div className="text-3xl font-display font-black text-red-500">42</div>
        </motion.div>
      </div>

      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between items-center bg-admin-bg/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email, SĐT..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-magenta transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-bg/20 transition-all w-full md:w-auto">
            <Filter className="w-5 h-5" /> Lọc Hạng Thành Viên
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border min-w-[250px]">Thông Tin Khách Hàng</th>
                <th className="p-4 font-bold border-b border-admin-border">Liên Hệ</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Hạng TV</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Chi Tiêu</th>
                <th className="p-4 font-bold border-b border-admin-border hidden sm:table-cell text-right">Hoạt Động</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((customer, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={customer.id} 
                  className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-admin-border p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-admin-bg/30 flex items-center justify-center text-admin-text font-bold">
                          {customer.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-admin-text group-hover:text-cyan transition-colors">{customer.name}</div>
                        <div className="text-xs text-admin-text-muted mt-1 font-mono">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-admin-text-muted"><Mail className="w-3 h-3" /> {customer.email}</div>
                      <div className="flex items-center gap-2 text-xs text-admin-text-muted"><Phone className="w-3 h-3" /> {customer.phone}</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] border uppercase tracking-widest ${getStatusStyle(customer.status)}`}>
                      {customer.status === 'VIP' && <Star className="w-3 h-3 mr-1 fill-current" />}
                      {customer.status === 'BANNED' && <ShieldAlert className="w-3 h-3 mr-1" />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-admin-text">{customer.totalSpent}</div>
                    <div className="text-[10px] text-admin-text-muted font-bold mt-1 uppercase tracking-widest">{customer.ticketCount} Giao Dịch</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-right text-xs text-admin-text-muted">
                    <div className="flex items-center justify-end gap-1"><Calendar className="w-3 h-3" /> {customer.lastActive}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Chi tiết">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all" title="Cài đặt">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10 shrink-0">
                <h3 className="text-xl font-display font-bold text-admin-text uppercase tracking-wider">Thông Tin Khách Hàng</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Họ Tên</label>
                  <input type="text" defaultValue="Nguyễn Văn A" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Hạng Thành Viên</label>
                  <select className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none" defaultValue="VIP">
                    <option value="VIP">VIP</option>
                    <option value="REGULAR">Regular</option>
                    <option value="BANNED">Banned (Khóa tài khoản)</option>
                  </select>
                </div>
                <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-xl flex items-start gap-3 mt-6 cursor-pointer hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-red-500">Xóa vĩnh viễn tài khoản</div>
                    <div className="text-xs text-admin-text-muted mt-1">Hành động này không thể hoàn tác. Mọi vé và lịch sử giao dịch sẽ bị xóa.</div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-admin-border bg-admin-panel flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Đóng</button>
                <button className="px-8 py-3 rounded-xl bg-gradient-brand text-admin-text font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
                  <Save className="w-5 h-5" /> Lưu Thay Đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

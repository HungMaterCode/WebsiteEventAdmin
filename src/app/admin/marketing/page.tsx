'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, Edit2, Trash2, X, Save, Tag,
  Percent, Calendar, CheckCircle2, Clock, XCircle
} from 'lucide-react';

const mockCampaigns = [
  { id: 'MKT-001', name: 'EARLY10', description: 'Giảm 10% cho khách đăng ký sớm', type: 'Mã Giảm Giá', discount: '10%', used: 245, limit: 500, status: 'Đang chạy', expires: '2026-04-10' },
  { id: 'MKT-002', name: 'VIP30', description: 'Ưu đãi 30% cho khách hàng VIP', type: 'Mã Giảm Giá', discount: '30%', used: 80, limit: 100, status: 'Đang chạy', expires: '2026-04-08' },
  { id: 'MKT-003', name: 'EMAIL_BLAST_01', description: 'Email marketing ra mắt sự kiện', type: 'Email', discount: '—', used: 8420, limit: 10000, status: 'Đã gửi', expires: '2026-03-30' },
  { id: 'MKT-004', name: 'BUDDY5', description: 'Giới thiệu bạn bè nhận 5% hoa hồng', type: 'Referral', discount: '5%', used: 120, limit: 300, status: 'Đang chạy', expires: '2026-04-15' },
  { id: 'MKT-005', name: 'FLASH24', description: 'Flash sale 24h chớp nhoáng', type: 'Flash Sale', discount: '20%', used: 300, limit: 300, status: 'Hết hạn', expires: '2026-04-01' },
];

export default function AdminMarketingPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getStatusStyle = (s: string) => {
    if (s === 'Đang chạy') return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
    if (s === 'Đã gửi') return 'bg-[#00FFFF]/10 text-[#00FFFF] border-[#00FFFF]/30';
    return 'bg-[#8A8F98]/10 text-[#8A8F98] border-[#8A8F98]/30';
  };

  const getTypeIcon = (t: string) => {
    if (t === 'Mã Giảm Giá') return <Tag className="w-4 h-4 text-[#FF0088]" />;
    if (t === 'Flash Sale') return <Percent className="w-4 h-4 text-[#E6C753]" />;
    return <Megaphone className="w-4 h-4 text-[#00FFFF]" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Marketing & Khuyến Mãi</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Tạo mã giảm giá, chiến dịch email và quản lý referral</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#FF0088] hover:bg-[#FF0088]/80 text-[#FFFFFF] font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta">
          <Plus className="w-5 h-5" /> Tạo Chiến Dịch Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Chiến Dịch Đang Chạy', value: '3', icon: Megaphone, color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20' },
          { label: 'Tổng Lượt Dùng Mã', value: '8,865', icon: Tag, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20' },
          { label: 'Khách Từ Referral', value: '120', icon: CheckCircle2, color: 'text-[#00C099]', bg: 'bg-[#00C099]/10 border-[#00C099]/20' },
          { label: 'Đã Hết Hạn', value: '1', icon: XCircle, color: 'text-[#8A8F98]', bg: 'bg-[#8A8F98]/10 border-[#8A8F98]/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/5">
          <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Danh Sách Chiến Dịch</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[220px]">Chiến Dịch</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Loại</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Ưu Đãi</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Tiến Độ</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden sm:table-cell whitespace-nowrap">Hết Hạn</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c, i) => {
                const pct = Math.round((c.used / c.limit) * 100);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-mono font-black text-[#FF0088] text-sm">{c.name}</div>
                      <div className="text-xs text-[#8A8F98] mt-1 line-clamp-1">{c.description}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[#8A8F98]">{getTypeIcon(c.type)} {c.type}</div>
                    </td>
                    <td className="p-4 text-center font-display font-black text-lg text-[#E6C753]">{c.discount}</td>
                    <td className="p-4 min-w-[140px]">
                      <div className="text-[10px] text-[#8A8F98] mb-1.5 font-bold">{c.used}/{c.limit} lượt</div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#FF0088] to-[#00FFFF]" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                        {c.status === 'Đang chạy' && <CheckCircle2 className="w-3 h-3" />}
                        {c.status === 'Hết hạn' && <Clock className="w-3 h-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-xs text-[#8A8F98] whitespace-nowrap">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.expires}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FF0088]/10 border border-[#FF0088]/30"><Megaphone className="w-5 h-5 text-[#FF0088]" /></div>
                  <h3 className="text-xl font-display font-bold text-[#FFFFFF] uppercase">Tạo Chiến Dịch Mới</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tên / Mã Chiến Dịch *</label>
                  <input type="text" placeholder="VD: EARLY10, VIP30..." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] font-mono focus:outline-none focus:border-[#FF0088]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Mô Tả</label>
                  <input type="text" placeholder="Mô tả ngắn gọn về chiến dịch..." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Loại Chiến Dịch</label>
                    <select className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] appearance-none">
                      {['Mã Giảm Giá', 'Flash Sale', 'Email', 'Referral'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Mức Giảm Giá (%)</label>
                    <input type="number" placeholder="10" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Giới Hạn Lượt Dùng</label>
                    <input type="number" placeholder="500" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Ngày Hết Hạn</label>
                    <input type="date" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#4F1F76]/30 flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy</button>
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF0088] to-[#4F1F76] text-[#FFFFFF] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
                  <Save className="w-5 h-5" /> Tạo Chiến Dịch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

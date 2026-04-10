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
    if (s === 'Đang chạy') return 'bg-emerald/10 text-emerald border-emerald/30';
    if (s === 'Đã gửi') return 'bg-cyan/10 text-cyan border-cyan/30';
    return 'bg-admin-bg/10 text-admin-text-muted border-admin-border/30';
  };

  const getTypeIcon = (t: string) => {
    if (t === 'Mã Giảm Giá') return <Tag className="w-4 h-4 text-magenta" />;
    if (t === 'Flash Sale') return <Percent className="w-4 h-4 text-gold" />;
    return <Megaphone className="w-4 h-4 text-cyan" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Marketing & Khuyến Mãi</h2>
          <p className="text-admin-text-muted text-sm mt-1">Tạo mã giảm giá, chiến dịch email và quản lý referral</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-magenta hover:bg-magenta/80 text-admin-text font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta">
          <Plus className="w-5 h-5" /> Tạo Chiến Dịch Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Chiến Dịch Đang Chạy', value: '3', icon: Megaphone, color: 'text-magenta', bg: 'bg-magenta/10 border border-magenta/20' },
          { label: 'Tổng Lượt Dùng Mã', value: '8,865', icon: Tag, color: 'text-cyan', bg: 'bg-cyan/10 border border-cyan/20' },
          { label: 'Khách Từ Referral', value: '120', icon: CheckCircle2, color: 'text-emerald', bg: 'bg-emerald/10 border border-emerald/20' },
          { label: 'Đã Hết Hạn', value: '1', icon: XCircle, color: 'text-admin-text-muted', bg: 'bg-admin-bg/10 border border-admin-border/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all bg-admin-panel/20 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border bg-admin-bg/5">
          <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Danh Sách Chiến Dịch</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border min-w-[220px]">Chiến Dịch</th>
                <th className="p-4 font-bold border-b border-admin-border">Loại</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Ưu Đãi</th>
                <th className="p-4 font-bold border-b border-admin-border">Tiến Độ</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border hidden sm:table-cell whitespace-nowrap">Hết Hạn</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c, i) => {
                const pct = Math.round((c.used / c.limit) * 100);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-mono font-black text-magenta text-sm">{c.name}</div>
                      <div className="text-xs text-admin-text-muted mt-1 line-clamp-1">{c.description}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-admin-text-muted">{getTypeIcon(c.type)} {c.type}</div>
                    </td>
                    <td className="p-4 text-center font-display font-black text-lg text-gold">{c.discount}</td>
                    <td className="p-4 min-w-[140px]">
                      <div className="text-[10px] text-admin-text-muted mb-1.5 font-bold">{c.used}/{c.limit} lượt</div>
                      <div className="h-2 rounded-full bg-admin-bg/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                        {c.status === 'Đang chạy' && <CheckCircle2 className="w-3 h-3" />}
                        {c.status === 'Hết hạn' && <Clock className="w-3 h-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-xs text-admin-text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.expires}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
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
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-magenta/10 border border-magenta/30"><Megaphone className="w-5 h-5 text-magenta" /></div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase">Tạo Chiến Dịch Mới</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên / Mã Chiến Dịch *</label>
                  <input type="text" placeholder="VD: EARLY10, VIP30..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text font-mono focus:outline-none focus:border-magenta" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mô Tả</label>
                  <input type="text" placeholder="Mô tả ngắn gọn về chiến dịch..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Loại Chiến Dịch</label>
                    <select className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none">
                      {['Mã Giảm Giá', 'Flash Sale', 'Email', 'Referral'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mức Giảm Giá (%)</label>
                    <input type="number" placeholder="10" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Giới Hạn Lượt Dùng</label>
                    <input type="number" placeholder="500" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Ngày Hết Hạn</label>
                    <input type="date" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-admin-border flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy</button>
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-magenta to-admin-panel text-admin-text font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
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

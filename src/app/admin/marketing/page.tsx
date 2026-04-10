'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, CheckCircle2, Clock, XCircle, Tag, Percent, Calendar, Save, X, Filter, Ban, Edit2, Trash2
} from 'lucide-react';

interface Campaign {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  used: number;
  limit: number;
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

const STATUS_FILTERS = [
  { key: 'ALL', label: 'Tất cả', icon: Filter, color: 'text-admin-text', activeBg: 'bg-white/10 border-white/30' },
  { key: 'ACTIVE', label: 'Đang chạy', icon: CheckCircle2, color: 'text-emerald', activeBg: 'bg-emerald/10 border-emerald/40' },
  { key: 'USED_UP', label: 'Hết lượt', icon: Ban, color: 'text-gold', activeBg: 'bg-gold/10 border-gold/40' },
  { key: 'EXPIRED', label: 'Hết hạn', icon: XCircle, color: 'text-red-500', activeBg: 'bg-red-500/10 border-red-500/40' },
  { key: 'INACTIVE', label: 'Tạm dừng', icon: Clock, color: 'text-admin-text-muted', activeBg: 'bg-admin-bg/10 border-admin-border/40' },
];

export default function AdminMarketingPage() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('ALL');
  
  const [formData, setFormData] = React.useState({
    code: '', name: '', description: '', type: 'PERCENT', value: '' as string | number, limit: '' as string | number, startDate: '', endDate: ''
  });

  const fetchCampaigns = async (status?: string) => {
    setLoading(true);
    try {
      const query = status && status !== 'ALL' ? `?status=${status}` : '';
      const res = await fetch(`/api/marketing${query}`);
      const data = await res.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCampaigns(activeFilter);
  }, [activeFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ code: '', name: '', description: '', type: 'PERCENT', value: '', limit: '', startDate: '', endDate: '' });
        fetchCampaigns(activeFilter);
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi tạo chiến dịch');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (s: string) => {
    if (s === 'ACTIVE') return 'bg-emerald/10 text-emerald border-emerald/30';
    if (s === 'USED_UP') return 'bg-gold/10 text-gold border-gold/30';
    if (s === 'EXPIRED') return 'bg-red-500/10 text-red-500 border-red-500/30';
    return 'bg-admin-text-muted/10 text-admin-text-muted border-admin-text-muted/30';
  };

  const getStatusLabel = (s: string) => {
    if (s === 'ACTIVE') return 'Đang chạy';
    if (s === 'USED_UP') return 'Hết lượt';
    if (s === 'EXPIRED') return 'Hết hạn';
    if (s === 'INACTIVE') return 'Tạm dừng';
    return s;
  };

  const getStatusIcon = (s: string) => {
    if (s === 'ACTIVE') return <CheckCircle2 className="w-3 h-3" />;
    if (s === 'USED_UP') return <Ban className="w-3 h-3" />;
    if (s === 'EXPIRED') return <XCircle className="w-3 h-3" />;
    if (s === 'INACTIVE') return <Clock className="w-3 h-3" />;
    return null;
  };

  const getTypeIcon = (t: string) => {
    if (t === 'PERCENT') return <Tag className="w-4 h-4 text-magenta" />;
    if (t === 'AMOUNT') return <Percent className="w-4 h-4 text-gold" />;
    return <Megaphone className="w-4 h-4 text-cyan" />;
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
          { label: 'Đang Chạy', value: campaigns.filter(c => c.status === 'ACTIVE').length.toString(), icon: Megaphone, color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20' },
          { label: 'Tổng Lượt Dùng Mã', value: campaigns.reduce((acc, c) => acc + c.used, 0).toLocaleString(), icon: Tag, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
          { label: 'Hết Lượt', value: campaigns.filter(c => c.status === 'USED_UP').length.toString(), icon: Ban, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
          { label: 'Hết Hạn', value: campaigns.filter(c => c.status === 'EXPIRED').length.toString(), icon: XCircle, color: 'text-admin-text-muted', bg: 'bg-admin-bg/10 border-admin-border/20' },
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

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeFilter === f.key
                ? `${f.activeBg} ${f.color} scale-[1.03] shadow-lg`
                : 'bg-white/5 border-white/10 text-admin-text-muted hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <f.icon className="w-3.5 h-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border bg-admin-bg/5 flex items-center justify-between">
          <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Danh Sách Chiến Dịch</h3>
          <span className="text-xs text-admin-text-muted">{campaigns.length} kết quả</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border min-w-[200px]">Chiến Dịch</th>
                <th className="p-4 font-bold border-b border-admin-border">Loại</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Ưu Đãi</th>
                <th className="p-4 font-bold border-b border-admin-border">Tiến Độ</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border hidden lg:table-cell">Hết Hạn</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center text-admin-text-muted">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
                    Đang tải dữ liệu...
                  </div>
                </td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-admin-text-muted">
                  Không có chiến dịch nào {activeFilter !== 'ALL' ? `với trạng thái "${getStatusLabel(activeFilter)}"` : 'được tạo'}.
                </td></tr>
              ) : campaigns.map((c, i) => {
                const pct = c.limit > 0 ? Math.round((c.used / c.limit) * 100) : 0;
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-mono font-black text-magenta text-sm">{c.code}</div>
                      <div className="text-xs text-admin-text-muted mt-1 line-clamp-1">{c.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-admin-text-muted">{getTypeIcon(c.type)} {c.type === 'PERCENT' ? 'Phần trăm' : 'Số tiền'}</div>
                    </td>
                    <td className="p-4 text-center font-display font-black text-lg text-gold">
                      {c.type === 'PERCENT' ? `${c.value}%` : `${c.value.toLocaleString()}₫`}
                    </td>
                    <td className="p-4 min-w-[140px]">
                      <div className="text-[10px] text-admin-text-muted mb-1.5 font-bold">{c.used}/{c.limit > 0 ? c.limit : '∞'} lượt</div>
                      <div className="h-2 rounded-full bg-admin-bg/20 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan" style={{ width: c.limit > 0 ? `${Math.min(pct, 100)}%` : '0%' }} />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                        {getStatusIcon(c.status)}
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-xs text-admin-text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(c.endDate)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"><Edit2 className="w-4 h-4" /></button>
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
              
              <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mã Giảm Giá *</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="VD: EARLY10, VIP30..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text font-mono focus:outline-none focus:border-magenta" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Chiến Dịch / Mô tả</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Khuyến mãi mừng Noel..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Loại Giảm Giá</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none">
                      <option value="PERCENT">Phần trăm (%)</option>
                      <option value="AMOUNT">Số tiền cố định (₫)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Giá trị giảm</label>
                    <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Giới Hạn Lượt Dùng <span className="text-admin-text-muted/50">(0 là vô hạn)</span></label>
                  <input type="number" value={formData.limit} onChange={e => setFormData({...formData, limit: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Ngày Mở Voucher</label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta [color-scheme:dark]" />
                    <p className="text-[9px] text-admin-text-muted/60 mt-1">Để trống = có hiệu lực ngay</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Ngày Hết Hạn</label>
                    <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta [color-scheme:dark]" />
                    <p className="text-[9px] text-admin-text-muted/60 mt-1">Để trống = không hết hạn</p>
                  </div>
                </div>
                
                <div className="p-6 border-t border-admin-border flex justify-end gap-4 shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy</button>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl bg-gradient-to-r from-magenta to-cyan text-admin-text font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta disabled:opacity-50">
                    <Save className="w-5 h-5" /> {isSubmitting ? 'Đang tạo...' : 'Tạo Chiến Dịch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

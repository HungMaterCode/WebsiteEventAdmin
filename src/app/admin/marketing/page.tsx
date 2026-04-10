'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
<<<<<<< HEAD
  Megaphone, Plus, CheckCircle2, Clock, XCircle, Tag, Percent, Calendar, Save, X, Filter, Ban, Edit2, Trash2
=======
  Megaphone, Plus, CheckCircle2, Clock, XCircle, Tag, Percent, Calendar,
  Save, X, Filter, Ban, Edit2, PauseCircle, AlertTriangle, Hourglass, Info
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
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
<<<<<<< HEAD
  { key: 'ALL', label: 'Tất cả', icon: Filter, color: 'text-admin-text', activeBg: 'bg-white/10 border-white/30' },
  { key: 'ACTIVE', label: 'Đang chạy', icon: CheckCircle2, color: 'text-emerald', activeBg: 'bg-emerald/10 border-emerald/40' },
  { key: 'USED_UP', label: 'Hết lượt', icon: Ban, color: 'text-gold', activeBg: 'bg-gold/10 border-gold/40' },
  { key: 'EXPIRED', label: 'Hết hạn', icon: XCircle, color: 'text-red-500', activeBg: 'bg-red-500/10 border-red-500/40' },
  { key: 'INACTIVE', label: 'Tạm dừng', icon: Clock, color: 'text-admin-text-muted', activeBg: 'bg-admin-bg/10 border-admin-border/40' },
=======
  { key: 'ALL', label: 'Tất cả', icon: Filter, color: 'text-white', activeBg: 'bg-white/10 border-white/30' },
  { key: 'SCHEDULED', label: 'Chưa bắt đầu', icon: Hourglass, color: 'text-[#A78BFA]', activeBg: 'bg-[#A78BFA]/10 border-[#A78BFA]/40' },
  { key: 'ACTIVE', label: 'Đang chạy', icon: CheckCircle2, color: 'text-[#00C099]', activeBg: 'bg-[#00C099]/10 border-[#00C099]/40' },
  { key: 'USED_UP', label: 'Hết lượt', icon: Ban, color: 'text-[#E6C753]', activeBg: 'bg-[#E6C753]/10 border-[#E6C753]/40' },
  { key: 'EXPIRED', label: 'Hết hạn', icon: XCircle, color: 'text-red-500', activeBg: 'bg-red-500/10 border-red-500/40' },
  { key: 'INACTIVE', label: 'Ngừng áp dụng', icon: Clock, color: 'text-[#8A8F98]', activeBg: 'bg-[#8A8F98]/10 border-[#8A8F98]/40' },
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
];

const emptyForm = {
  code: '', name: '', description: '', type: 'PERCENT',
  value: '' as string | number, limit: '' as string | number,
  startDate: '', endDate: '',
};

export default function AdminMarketingPage() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('ALL');
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null);
  const [formError, setFormError] = React.useState('');
  const [deactivatingId, setDeactivatingId] = React.useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingSubmitEvent, setPendingSubmitEvent] = React.useState<React.FormEvent | null>(null);

  // Deactivate confirmation dialog state
  const [showDeactivateDialog, setShowDeactivateDialog] = React.useState(false);
  const [campaignToDeactivate, setCampaignToDeactivate] = React.useState<Campaign | null>(null);

  // Toast notification
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [formData, setFormData] = React.useState(emptyForm);

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

  // Open modal for CREATE
  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for EDIT
  const openEditModal = (c: Campaign) => {
    setEditingCampaign(c);
    setFormData({
      code: c.code,
      name: c.name,
      description: c.description || '',
      type: c.type,
      value: c.value,
      limit: c.limit,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
      endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
    setFormData(emptyForm);
    setFormError('');
    setShowConfirmDialog(false);
    setPendingSubmitEvent(null);
  };

  // Client-side validation
  const validateForm = (): string | null => {
    const val = parseInt(formData.value?.toString() || '0');

    if (!formData.name.trim()) return 'Tên chiến dịch không được để trống.';
    if (!formData.code.trim()) return 'Mã khuyến mãi không được để trống.';
    if (!formData.startDate) return 'Ngày bắt đầu không được để trống.';
    if (!formData.endDate) return 'Ngày hết hạn không được để trống.';

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return 'Ngày bắt đầu phải trước ngày hết hạn.';
    }

    if (val <= 0) return 'Mức giảm phải lớn hơn 0.';

    if (formData.type === 'PERCENT' && val >= 100) {
      return 'Mức giảm phần trăm không được phép từ 100% trở lên.';
    }

    return null;
  };

  // The actual submit logic (called after validation + confirmation)
  const doSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isEdit = !!editingCampaign;
      const url = isEdit ? `/api/marketing/${editingCampaign!.id}` : '/api/marketing';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        fetchCampaigns(activeFilter);
      } else {
        const err = await res.json();
        setFormError(err.error || 'Lỗi khi lưu chiến dịch');
      }
    } catch (e) {
      console.error(e);
      setFormError('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submit with validation + confirmation for large FIXED discounts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const val = parseInt(formData.value?.toString() || '0');

    // If FIXED and value > 500,000đ → show confirmation dialog
    if (formData.type === 'FIXED' && val > 500000) {
      setPendingSubmitEvent(e);
      setShowConfirmDialog(true);
      return;
    }

    await doSubmit();
  };

  // User confirms the large discount
  const confirmLargeDiscount = async () => {
    setShowConfirmDialog(false);
    setPendingSubmitEvent(null);
    await doSubmit();
  };

  // Open deactivate confirmation dialog
  const handleDeactivate = (c: Campaign) => {
    setCampaignToDeactivate(c);
    setShowDeactivateDialog(true);
  };

  // Confirm deactivation
  const confirmDeactivate = async () => {
    if (!campaignToDeactivate) return;
    setShowDeactivateDialog(false);
    setDeactivatingId(campaignToDeactivate.id);
    try {
      const res = await fetch(`/api/marketing/${campaignToDeactivate.id}`, { method: 'PATCH' });
      if (res.ok) {
        showToast(`Đã ngừng áp dụng chiến dịch "${campaignToDeactivate.name}".`, 'success');
        fetchCampaigns(activeFilter);
      } else {
        const err = await res.json();
        showToast(err.error || 'Không thể ngừng áp dụng chiến dịch.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Đã xảy ra lỗi kết nối.', 'error');
    } finally {
      setDeactivatingId(null);
      setCampaignToDeactivate(null);
    }
  };

  const getStatusStyle = (s: string) => {
<<<<<<< HEAD
    if (s === 'ACTIVE') return 'bg-emerald/10 text-emerald border-emerald/30';
    if (s === 'USED_UP') return 'bg-gold/10 text-gold border-gold/30';
    if (s === 'EXPIRED') return 'bg-red-500/10 text-red-500 border-red-500/30';
    return 'bg-admin-text-muted/10 text-admin-text-muted border-admin-text-muted/30';
=======
    if (s === 'SCHEDULED') return 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30';
    if (s === 'ACTIVE') return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
    if (s === 'USED_UP') return 'bg-[#E6C753]/10 text-[#E6C753] border-[#E6C753]/30';
    if (s === 'EXPIRED') return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (s === 'INACTIVE') return 'bg-[#8A8F98]/10 text-[#8A8F98] border-[#8A8F98]/30';
    return 'bg-[#8A8F98]/10 text-[#8A8F98] border-[#8A8F98]/30';
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
  };

  const getStatusLabel = (s: string) => {
    if (s === 'SCHEDULED') return 'Chưa bắt đầu';
    if (s === 'ACTIVE') return 'Đang chạy';
    if (s === 'USED_UP') return 'Hết lượt';
    if (s === 'EXPIRED') return 'Hết hạn';
    if (s === 'INACTIVE') return 'Ngừng áp dụng';
    return s;
  };

  const getStatusIcon = (s: string) => {
    if (s === 'SCHEDULED') return <Hourglass className="w-3 h-3" />;
    if (s === 'ACTIVE') return <CheckCircle2 className="w-3 h-3" />;
    if (s === 'USED_UP') return <Ban className="w-3 h-3" />;
    if (s === 'EXPIRED') return <XCircle className="w-3 h-3" />;
    if (s === 'INACTIVE') return <Clock className="w-3 h-3" />;
    return null;
  };

  const getTypeLabel = (t: string) => {
    if (t === 'PERCENT') return 'Giảm %';
    if (t === 'FIXED') return 'Giảm tiền';
    return t;
  };

  const getTypeIcon = (t: string) => {
<<<<<<< HEAD
    if (t === 'PERCENT') return <Tag className="w-4 h-4 text-magenta" />;
    if (t === 'AMOUNT') return <Percent className="w-4 h-4 text-gold" />;
    return <Megaphone className="w-4 h-4 text-cyan" />;
=======
    if (t === 'PERCENT') return <Percent className="w-4 h-4 text-[#FF0088]" />;
    if (t === 'FIXED') return <Tag className="w-4 h-4 text-[#E6C753]" />;
    return <Megaphone className="w-4 h-4 text-[#00FFFF]" />;
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (v: number) => {
    return v.toLocaleString('vi-VN') + 'đ';
  };

  // Dynamic stats
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;
  const scheduledCount = campaigns.filter(c => c.status === 'SCHEDULED').length;
  const totalUsed = campaigns.reduce((sum, c) => sum + c.used, 0);
  const expiredCount = campaigns.filter(c => c.status === 'EXPIRED').length;

  // Derived form state
  const parsedValue = parseInt(formData.value?.toString() || '0');
  const isPercentTooHigh = formData.type === 'PERCENT' && parsedValue >= 100;
  const hasDateError = formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Marketing & Khuyến Mãi</h2>
          <p className="text-admin-text-muted text-sm mt-1">Tạo mã giảm giá, chiến dịch email và quản lý referral</p>
        </div>
        <button onClick={openCreateModal}
          className="px-6 py-3 bg-magenta hover:bg-magenta/80 text-admin-text font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta">
          <Plus className="w-5 h-5" /> Tạo Chiến Dịch Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
<<<<<<< HEAD
          { label: 'Đang Chạy', value: campaigns.filter(c => c.status === 'ACTIVE').length.toString(), icon: Megaphone, color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20' },
          { label: 'Tổng Lượt Dùng Mã', value: campaigns.reduce((acc, c) => acc + c.used, 0).toLocaleString(), icon: Tag, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
          { label: 'Hết Lượt', value: campaigns.filter(c => c.status === 'USED_UP').length.toString(), icon: Ban, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
          { label: 'Hết Hạn', value: campaigns.filter(c => c.status === 'EXPIRED').length.toString(), icon: XCircle, color: 'text-admin-text-muted', bg: 'bg-admin-bg/10 border-admin-border/20' },
=======
          { label: 'Đang Chạy', value: activeCount, icon: Megaphone, color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20' },
          { label: 'Chưa Bắt Đầu', value: scheduledCount, icon: Hourglass, color: 'text-[#A78BFA]', bg: 'bg-[#A78BFA]/10 border-[#A78BFA]/20' },
          { label: 'Tổng Lượt Dùng Mã', value: totalUsed.toLocaleString(), icon: Tag, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20' },
          { label: 'Đã Hết Hạn', value: expiredCount, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
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
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilter === f.key
                ? `${f.activeBg} ${f.color} scale-[1.03] shadow-lg`
<<<<<<< HEAD
                : 'bg-white/5 border-white/10 text-admin-text-muted hover:bg-white/10 hover:border-white/20'
            }`}
=======
                : 'bg-white/5 border-white/10 text-[#8A8F98] hover:bg-white/10 hover:border-white/20'
              }`}
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
          >
            <f.icon className="w-3.5 h-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
<<<<<<< HEAD
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border bg-admin-bg/5 flex items-center justify-between">
          <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Danh Sách Chiến Dịch</h3>
          <span className="text-xs text-admin-text-muted">{campaigns.length} kết quả</span>
=======
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/5">
          <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Danh Sách Chiến Dịch</h3>
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
<<<<<<< HEAD
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border min-w-[200px]">Chiến Dịch</th>
                <th className="p-4 font-bold border-b border-admin-border">Loại</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Ưu Đãi</th>
                <th className="p-4 font-bold border-b border-admin-border">Tiến Độ</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border hidden lg:table-cell">Hết Hạn</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
=======
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[220px]">Chiến Dịch</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Loại</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Ưu Đãi</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Tiến Độ</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden sm:table-cell whitespace-nowrap">Thời Gian</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao Tác</th>
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
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
                const isUnlimited = c.limit === 0;
                const canDeactivate = isUnlimited && (c.status === 'ACTIVE' || c.status === 'SCHEDULED');
                const canEdit = c.status !== 'INACTIVE';
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group">
                    <td className="p-4">
<<<<<<< HEAD
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
=======
                      <div className="font-mono font-black text-[#FF0088] text-sm">{c.name}</div>
                      <div className="text-[10px] text-[#00FFFF] font-mono mt-0.5">{c.code}</div>
                      {c.description && <div className="text-xs text-[#8A8F98] mt-1 line-clamp-1">{c.description}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[#8A8F98]">{getTypeIcon(c.type)} {getTypeLabel(c.type)}</div>
                    </td>
                    <td className="p-4 text-center font-display font-black text-lg text-[#E6C753]">
                      {c.type === 'PERCENT' ? `${c.value}%` : formatCurrency(c.value)}
                    </td>
                    <td className="p-4 min-w-[140px]">
                      {isUnlimited ? (
                        <div className="text-[10px] text-[#00FFFF] font-bold">♾️ Không giới hạn ({c.used} đã dùng)</div>
                      ) : (
                        <>
                          <div className="text-[10px] text-[#8A8F98] mb-1.5 font-bold">{c.used}/{c.limit} lượt</div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#FF0088] to-[#00FFFF]" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </>
                      )}
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                        {getStatusIcon(c.status)}
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
<<<<<<< HEAD
                    <td className="p-4 hidden lg:table-cell text-xs text-admin-text-muted whitespace-nowrap">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(c.endDate)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
=======
                    <td className="p-4 hidden sm:table-cell text-xs text-[#8A8F98] whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#00C099]" /> {formatDate(c.startDate)}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-red-400" /> {formatDate(c.endDate)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(c)}
                            title="Chỉnh sửa"
                            className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDeactivate && (
                          <button
                            onClick={() => handleDeactivate(c)}
                            disabled={deactivatingId === c.id}
                            title="Ngừng áp dụng"
                            className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#E6C753] hover:bg-[#E6C753]/10 transition-all disabled:opacity-50"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal — Create / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onSubmit={handleSubmit}
              className="relative w-full max-w-2xl bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${editingCampaign ? 'bg-[#00FFFF]/10 border-[#00FFFF]/30' : 'bg-magenta/10 border-magenta/30'}`}>
                    {editingCampaign
                      ? <Edit2 className="w-5 h-5 text-[#00FFFF]" />
                      : <Megaphone className="w-5 h-5 text-magenta" />
                    }
                  </div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase">
                    {editingCampaign ? 'Chỉnh Sửa Chiến Dịch' : 'Tạo Chiến Dịch Mới'}
                  </h3>
                </div>
                <button type="button" onClick={closeModal} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                {/* Error Banner */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-semibold"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <div>
<<<<<<< HEAD
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mã Giảm Giá *</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="VD: EARLY10, VIP30..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text font-mono focus:outline-none focus:border-magenta" />
=======
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tên Chiến Dịch <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => { setFormData({ ...formData, name: e.target.value }); setFormError(''); }}
                    placeholder="VD: Ưu Đãi Mùa Hè"
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] transition-colors"
                  />
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
                </div>

                {/* Code */}
                <div>
<<<<<<< HEAD
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Chiến Dịch / Mô tả</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Khuyến mãi mừng Noel..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
=======
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Mã Khuyến Mãi <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => { setFormData({ ...formData, code: e.target.value.toUpperCase() }); setFormError(''); }}
                    placeholder="VD: SUMMER2024"
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] font-mono focus:outline-none focus:border-[#FF0088] transition-colors"
                  />
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Mô Tả</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về chiến dịch..."
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] transition-colors"
                  />
                </div>

                {/* Type + Value */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
<<<<<<< HEAD
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
=======
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Loại Chiến Dịch</label>
                    <select
                      value={formData.type}
                      onChange={e => { setFormData({ ...formData, type: e.target.value, value: '' }); setFormError(''); }}
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] appearance-none transition-colors"
                    >
                      <option value="PERCENT">Giảm phần trăm (%)</option>
                      <option value="FIXED">Giảm số tiền cố định (đ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">
                      {formData.type === 'PERCENT' ? 'Mức Giảm (%)' : 'Mức Giảm (đ)'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={formData.type === 'PERCENT' ? 99 : undefined}
                      value={formData.value}
                      onChange={e => {
                        setFormData({ ...formData, value: e.target.value });
                        setFormError('');
                      }}
                      placeholder={formData.type === 'PERCENT' ? "VD: 10 (tối đa 99)" : "VD: 50000"}
                      className={`w-full bg-[#060010] border rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none transition-colors ${isPercentTooHigh
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#4F1F76]/50 focus:border-[#FF0088]'
                        }`}
                    />
                    {isPercentTooHigh && (
                      <p className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3 h-3" /> Không được phép giảm 100% trở lên
                      </p>
                    )}
                    {formData.type === 'FIXED' && parsedValue > 500000 && (
                      <p className="text-[#E6C753] text-[10px] mt-1.5 flex items-center gap-1 font-semibold">
                        <Info className="w-3 h-3" /> Số tiền giảm lớn — sẽ cần xác nhận khi lưu
                      </p>
                    )}
                  </div>
                </div>

                {/* Limit */}
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">
                    Giới Hạn Lượt Dùng <span className="text-[#8A8F98]/50">(0 = không giới hạn)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.limit}
                    onChange={e => setFormData({ ...formData, limit: e.target.value })}
                    placeholder="0 là không giới hạn"
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] transition-colors"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">
                      Ngày Bắt Đầu <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={e => { setFormData({ ...formData, startDate: e.target.value }); setFormError(''); }}
                      className={`w-full bg-[#060010] border rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none transition-colors ${hasDateError ? 'border-red-500' : 'border-[#4F1F76]/50 focus:border-[#FF0088]'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">
                      Ngày Hết Hạn <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={e => { setFormData({ ...formData, endDate: e.target.value }); setFormError(''); }}
                      className={`w-full bg-[#060010] border rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none transition-colors ${hasDateError ? 'border-red-500' : 'border-[#4F1F76]/50 focus:border-[#FF0088]'
                        }`}
                    />
                  </div>
                </div>
                {hasDateError && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5 font-semibold -mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Ngày bắt đầu phải trước ngày hết hạn
                  </p>
                )}

                {/* Info: auto SCHEDULED status */}
                {formData.startDate && new Date(formData.startDate) > new Date() && !hasDateError && (
                  <div className="flex items-center gap-2 text-[#A78BFA] text-xs bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl p-3">
                    <Hourglass className="w-4 h-4 shrink-0" />
                    Chiến dịch sẽ có trạng thái <strong>&quot;Chưa bắt đầu&quot;</strong> và tự động kích hoạt khi đến ngày bắt đầu.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#4F1F76]/30 flex justify-end gap-4 shrink-0">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy</button>
                <button
                  type="submit"
                  disabled={isSubmitting || isPercentTooHigh || !!hasDateError}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF0088] to-[#4F1F76] text-[#FFFFFF] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting
                    ? (editingCampaign ? 'Đang lưu...' : 'Đang tạo...')
                    : (editingCampaign ? 'Lưu Thay Đổi' : 'Tạo Chiến Dịch')
                  }
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog — Large FIXED discount */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-admin-panel border border-[#E6C753]/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-[#E6C753]/10 border-2 border-[#E6C753]/30 flex items-center justify-center mb-5">
                <AlertTriangle className="w-8 h-8 text-[#E6C753]" />
              </div>
              <h4 className="text-xl font-display font-bold text-admin-text mb-3">Xác Nhận Mức Giảm Lớn</h4>
              <p className="text-[#8A8F98] text-sm mb-2">
                Bạn đang đặt mức giảm trực tiếp là:
              </p>
              <p className="text-3xl font-display font-black text-[#E6C753] mb-4">
                {formatCurrency(parsedValue)}
              </p>
              <p className="text-[#8A8F98] text-sm mb-6">
                Đây là một số tiền giảm giá lớn. Bạn có chắc chắn muốn tiếp tục?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => { setShowConfirmDialog(false); setPendingSubmitEvent(null); }}
                  className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-white transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={confirmLargeDiscount}
                  className="px-6 py-3 rounded-xl bg-[#E6C753] text-[#0D0716] font-bold hover:bg-[#E6C753]/80 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Xác Nhận
                </button>
              </div>
>>>>>>> 9049999351c54312af955cf67b0e35271d6f4ad3
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deactivate Confirmation Dialog */}
      <AnimatePresence>
        {showDeactivateDialog && campaignToDeactivate && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowDeactivateDialog(false); setCampaignToDeactivate(null); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-admin-panel border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-5">
                <PauseCircle className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-xl font-display font-bold text-admin-text mb-3">Ngừng Áp Dụng Chiến Dịch</h4>
              <p className="text-[#8A8F98] text-sm mb-2">
                Bạn chắc chắn muốn ngừng áp dụng chiến dịch:
              </p>
              <p className="text-lg font-display font-black text-[#FF0088] mb-1">
                {campaignToDeactivate.name}
              </p>
              <p className="text-[10px] font-mono text-[#00FFFF] mb-4">
                {campaignToDeactivate.code}
              </p>
              <p className="text-[#8A8F98] text-xs mb-6 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 text-red-400" />
                Hành động này sẽ ngừng áp dụng chiến dịch. Khách hàng sẽ không thể sử dụng mã giảm giá này nữa.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => { setShowDeactivateDialog(false); setCampaignToDeactivate(null); }}
                  className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-white transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={confirmDeactivate}
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <PauseCircle className="w-5 h-5" /> Ngừng Áp Dụng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[700] px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-lg ${toast.type === 'success'
                ? 'bg-[#00C099]/10 border-[#00C099]/40 text-[#00C099]'
                : 'bg-red-500/10 border-red-500/40 text-red-400'
              }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 shrink-0" />
              : <AlertTriangle className="w-5 h-5 shrink-0" />
            }
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

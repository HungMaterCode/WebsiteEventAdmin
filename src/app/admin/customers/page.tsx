'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, Edit2, Trash2, ShieldAlert,
  Star, Mail, Phone, Calendar, Download, MoreVertical, X, Save,
  RefreshCw, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: string;
  rawTotalSpent: number;
  ticketCount: number;
  status: 'ACTIVE' | 'BANNED';
  rank: 'REGULAR' | 'VIP';
  lastActive: string;
}

interface Stats {
  totalCount: number;
  vipCount: number;
  lockedCount: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCount: 0, vipCount: 0, lockedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [filterRank, setFilterRank] = useState('ALL');

  const fetchCustomers = useCallback(async (query: string = '', rank: string = 'ALL') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?query=${encodeURIComponent(query)}&rank=${rank}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCustomers(data.customers);
      setStats(data.stats);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách khách hàng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(searchQuery, filterRank);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterRank, fetchCustomers]);

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['ID', 'Ho Ten', 'Email', 'So Dien Thoai', 'Tong Chi Tieu', 'So Giao Dich', 'Hang', 'Trang Thai', 'Hoat Dong Cuoi'];
    const csvContent = [
      headers.join(','),
      ...customers.map(c => [
        c.id,
        `"${c.name}"`,
        c.email,
        c.phone,
        `"${c.totalSpent.replace(/,/g, '')}"`,
        c.ticketCount,
        c.rank,
        c.status,
        c.lastActive
      ].join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `khach_hang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file CSV thành công');
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCustomer),
      });

      if (!res.ok) throw new Error('Update failed');
      
      toast.success('Cập nhật thông tin thành công');
      setIsModalOpen(false);
      fetchCustomers(searchQuery, filterRank);
    } catch (err) {
      toast.error('Lỗi khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusStyle = (status: string, rank: string) => {
    if (status === 'BANNED') return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (rank === 'VIP') return 'bg-gold/10 text-gold border-gold/30 glow-gold font-bold';
    return 'bg-cyan/10 text-cyan border-cyan/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Khách Hàng</h2>
          <p className="text-admin-text-muted text-sm mt-1">Cơ sở dữ liệu người dùng, hạng thành viên và lịch sử mua hàng</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchCustomers(searchQuery, filterRank)}
            className="p-3 border border-admin-border hover:bg-admin-bg/20 text-admin-text-muted rounded-xl transition-all"
            title="Làm mới"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-6 py-3 border border-cyan/50 hover:bg-cyan/10 text-cyan font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan/5 active:scale-95"
          >
            <Download className="w-5 h-5" /> Xuất Dữ Liệu (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-20 h-20 text-cyan" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Tổng Khách Hàng</div>
          <div className="text-3xl font-display font-black text-cyan glow-cyan">{stats.totalCount.toLocaleString()}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Star className="w-20 h-20 text-gold" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Khách Hàng VIP</div>
          <div className="text-3xl font-display font-black text-gold glow-gold">{stats.vipCount.toLocaleString()}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldAlert className="w-20 h-20 text-red-500" /></div>
          <div className="text-admin-text-muted text-xs font-bold uppercase tracking-widest mb-2">Tài Khoản Bị Khóa</div>
          <div className="text-3xl font-display font-black text-red-500">{stats.lockedCount.toLocaleString()}</div>
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
          <div className="relative w-full md:w-auto flex items-center gap-3">
            <span className="text-xs text-admin-text-muted font-bold uppercase tracking-widest hidden lg:block">Bộ lọc:</span>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan" />
              <select 
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value)}
                className="bg-admin-bg border border-admin-border rounded-xl pl-10 pr-8 py-3 text-admin-text focus:outline-none focus:border-cyan appearance-none cursor-pointer hover:bg-admin-bg/50 transition-all font-bold text-sm min-w-[200px]"
              >
                <option value="ALL">Tất cả hạng thành viên</option>
                <option value="VIP">Khách hàng VIP</option>
                <option value="REGULAR">Khách hàng Thường</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-admin-text-muted group-hover:text-cyan transition-colors">
                ▼
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading && customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-cyan animate-spin" />
              <p className="text-admin-text-muted font-display uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : (
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
                {customers.map((customer, i) => (
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
                          <div className="w-full h-full rounded-full bg-admin-bg/30 flex items-center justify-center text-admin-text font-bold uppercase transition-transform group-hover:scale-110">
                            {customer.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-admin-text group-hover:text-cyan transition-colors">{customer.name}</div>
                          <div className="text-[10px] text-admin-text-muted mt-1 font-mono uppercase opacity-50">{customer.id.substring(0, 13)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-admin-text-muted"><Mail className="w-3 h-3 text-magenta" /> {customer.email}</div>
                        <div className="flex items-center gap-2 text-xs text-admin-text-muted"><Phone className="w-3 h-3 text-cyan" /> {customer.phone}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] border uppercase tracking-widest ${getStatusStyle(customer.status, customer.rank)}`}>
                        {customer.rank === 'VIP' && customer.status !== 'BANNED' && <Star className="w-3 h-3 mr-1 fill-current" />}
                        {customer.status === 'BANNED' && <ShieldAlert className="w-3 h-3 mr-1" />}
                        {customer.status === 'BANNED' ? 'BANNED' : customer.rank}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-admin-text">{customer.totalSpent}</div>
                      <div className="text-[10px] text-admin-text-muted font-bold mt-1 uppercase tracking-widest">{customer.ticketCount} Giao Dịch</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-right text-xs text-admin-text-muted">
                      <div className="flex items-center justify-end gap-1"><Calendar className="w-3 h-3 text-cyan" /> {customer.lastActive}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(customer)} className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Chỉnh sửa">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all" title="Khác">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {!loading && customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-admin-text-muted uppercase tracking-[0.3em] font-display opacity-50">
                      Không tìm thấy khách hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10 shrink-0">
                <h3 className="text-xl font-display font-bold text-admin-text uppercase tracking-wider">Thông Tin Khách Hàng</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleUpdateCustomer} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Họ Tên</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.name} 
                      onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                      className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Số Điện Thoại</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.phone} 
                      onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                      className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Hạng Thành Viên</label>
                      <select 
                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none" 
                        value={selectedCustomer.rank}
                        onChange={(e) => setSelectedCustomer({...selectedCustomer, rank: e.target.value as any})}
                      >
                        <option value="REGULAR">Regular</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Trạng Thái</label>
                      <select 
                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none text-red-500" 
                        value={selectedCustomer.status}
                        onChange={(e) => setSelectedCustomer({...selectedCustomer, status: e.target.value as any})}
                      >
                        <option value="ACTIVE">Hoạt động (Active)</option>
                        <option value="BANNED">Khóa (Banned)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-admin-border bg-admin-bg/30 rounded-xl mt-6">
                    <div className="text-[10px] text-admin-text-muted uppercase tracking-widest mb-2 font-bold">Thống kê chi tiêu</div>
                    <div className="flex justify-between items-end">
                      <div className="text-2xl font-display font-black text-cyan">{selectedCustomer.totalSpent}</div>
                      <div className="text-xs text-admin-text-muted mb-1">{selectedCustomer.ticketCount} Giao dịch</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-admin-border bg-admin-panel flex justify-end gap-4 shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Đóng</button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-gradient-brand text-admin-text font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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

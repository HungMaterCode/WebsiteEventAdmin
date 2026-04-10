'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  Users, TrendingUp, Filter, Search, Award, 
  Crown, Star, UserPlus, Loader2, Mail, Phone,
  ChevronRight, Calendar, LogOut
} from 'lucide-react';

const COLORS = ['#00FFFF', '#E6C753', '#00C099', '#FF0088', '#8A8F98'];

export default function CustomerAnalytics() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/customers');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch customer analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan animate-spin" />
        <p className="text-admin-text-muted font-black uppercase tracking-[0.2em] text-sm">Đang định danh khách hàng...</p>
      </div>
    );
  }

  const { stats, segmentData, topCustomers } = data || {};
  
  const filteredCustomers = topCustomers?.filter((c: any) => 
    (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-cyan glow-cyan" />
            Phân tích Khách hàng
          </h2>
          <p className="text-admin-text-muted text-sm mt-1">Phân loại và thấu hiểu hành vi tệp khách hàng của sự kiện</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng số khách', value: stats.totalCustomers.toLocaleString(), icon: Users, color: 'var(--admin-text)', sub: 'Đã định danh qua email' },
          { label: 'Doanh thu TB/Khách', value: `${(stats.arpu / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'var(--cyan)', sub: 'VNĐ mỗi khách hàng' },
          { label: 'Tỉ lệ quay lại', value: `${stats.returningRate}%`, icon: UserPlus, color: 'var(--magenta)', sub: 'Khách mua nhiều hơn 1 lần' },
          { label: 'Vé TB / Đơn', value: stats.avgTicketsPerCustomer, icon: Star, color: 'var(--gold)', sub: 'Lượt mua trung bình' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
              <s.icon className="w-16 h-16" style={{ color: s.color }} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">{s.label}</div>
            <div className="text-3xl font-display font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-admin-text-muted mt-2 font-medium uppercase tracking-tight">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Segmentation Chart */}
        <div className="lg:col-span-1 glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30 flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-admin-text mb-8 flex items-center gap-2">
            <Filter className="w-5 h-5 text-magenta" />
            Phân loại khách hàng
          </h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {segmentData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '12px' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
             <p className="text-[11px] text-admin-text-muted leading-relaxed font-medium italic">
               Hệ thống tự động phân phối khách hàng dựa trên tổng chi tiêu và tần suất đặt vé. 
             </p>
             <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-tighter">
                <div className="p-2 rounded-lg bg-cyan/5 border border-cyan/10 text-cyan">Kim cương {'>'} 10M</div>
                <div className="p-2 rounded-lg bg-gold/5 border border-gold/10 text-gold">Vàng {'>'} 5M</div>
             </div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] bg-admin-panel/80 border border-admin-border/30 overflow-hidden flex flex-col shadow-2xl h-[550px]">
          <div className="p-6 border-b border-admin-border/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-admin-text">Khách hàng chi tiêu hàng đầu</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
              <input 
                type="text" 
                placeholder="Tìm email/tên..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-admin-bg/40 border border-admin-border/30 rounded-xl pl-10 pr-4 py-2 text-xs text-admin-text focus:outline-none focus:border-cyan transition-all"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-bg text-admin-text-muted text-[10px] uppercase font-black tracking-widest">
                  <th className="p-4 font-black border-b border-admin-border/20 pl-8 text-left">Thành viên</th>
                  <th className="p-4 font-black border-b border-admin-border/20 text-left">Chi tiêu</th>
                  <th className="p-4 font-black border-b border-admin-border/20 text-center">Vé</th>
                  <th className="p-4 font-black border-b border-admin-border/20 text-center">Nhãn</th>
                  <th className="p-4 font-black border-b border-admin-border/20 pr-8 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.map((c: any, i: number) => (
                  <motion.tr key={c.email} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border/5 hover:bg-admin-bg/5 transition-colors group">
                    <td className="p-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-admin-panel/20 border border-admin-border/50 flex items-center justify-center text-sm font-bold text-cyan">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-admin-text text-sm group-hover:text-cyan transition-colors">{c.name}</div>
                          <div className="text-[10px] text-admin-text-muted lowercase">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-black text-admin-text">{c.totalSpend.toLocaleString()}<span className="text-[9px] text-admin-text-muted ml-1 font-normal">đ</span></div>
                      <div className="text-[9px] text-admin-text-muted font-bold uppercase">{c.bookingCount} đơn hàng</div>
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-admin-text font-bold">{c.totalTickets}</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                        style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}40`, color: c.color }}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="p-4 pr-8 text-right">
                       <button className="p-2 rounded-lg bg-admin-panel/10 text-admin-text-muted hover:text-cyan hover:scale-110 transition-all">
                         <ChevronRight className="w-5 h-5" />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-6 rounded-[2rem] bg-gradient-to-r from-admin-panel to-admin-bg border border-admin-border/50 shadow-xl flex items-center gap-6">
            <div className="p-5 rounded-3xl bg-cyan/10 border border-cyan/20">
              <LogOut className="w-8 h-8 text-cyan rotate-180" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-admin-text mb-1">Khám phá tiềm năng</h4>
              <p className="text-xs text-admin-text-muted">Xác định những khách hàng 'Tiềm năng' thường xuyên lựa chọn hạng vé phổ thông để giới thiệu các gói nâng cấp GA lên VIP phù hợp.</p>
            </div>
         </div>
         <div className="p-6 rounded-[2rem] bg-gradient-to-r from-admin-panel to-admin-bg border border-admin-border/50 shadow-xl flex items-center gap-6">
            <div className="p-5 rounded-3xl bg-magenta/10 border border-magenta/20">
              <Mail className="w-8 h-8 text-magenta" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-admin-text mb-1">Chăm sóc hội viên Diamond</h4>
              <p className="text-xs text-admin-text-muted">Dành riêng các ưu đãi nghỉ dưỡng hoặc quà tặng cao cấp cho nhóm khách hàng chi tiêu trên 10,000,000 đ để tăng tính gắn kết.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

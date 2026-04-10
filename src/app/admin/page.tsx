'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Ticket, DollarSign, Users, Zap, TrendingUp, History,
  ArrowUpRight, RefreshCcw, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [analyticsRes, transactionsRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/transactions')
      ]);

      const analyticsData = await analyticsRes.json();
      const transactionsData = await transactionsRes.json();

      if (analyticsData.error) throw new Error(analyticsData.error);
      if (transactionsData.error) throw new Error(transactionsData.error);

      setAnalytics(analyticsData);
      setTransactions(transactionsData.transactions || []);
    } catch (error: any) {
      console.error('Fetch Dashboard Error:', error);
      toast.error('Không thể tải dữ liệu dashboard: ' + error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B VNĐ`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M VNĐ`;
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const stats = [
    { 
      label: 'Tổng số vé', 
      value: analytics ? formatNumber(analytics.totalTickets) : '...', 
      icon: Ticket, color: 'text-cyan', glow: 'glow-cyan', bg: 'bg-cyan/10 border-cyan/20' 
    },
    { 
      label: 'Tổng doanh thu', 
      value: analytics ? formatCurrency(analytics.totalRevenue) : '...', 
      icon: DollarSign, color: 'text-magenta', glow: 'glow-magenta', bg: 'bg-magenta/10 border-magenta/20' 
    },
    { 
      label: 'Tổng số giao dịch', 
      value: analytics ? formatNumber(analytics.totalTransactions) : '...', 
      icon: History, color: 'text-emerald', glow: 'glow-emerald', bg: 'bg-emerald/10 border-emerald/20' 
    },
    { 
      label: 'Tỷ lệ Check-in', 
      value: analytics ? `${analytics.checkInRate}%` : '...', 
      icon: Zap, color: 'text-gold', glow: 'glow-gold', bg: 'bg-gold/10 border-gold/20' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-admin-text uppercase tracking-widest">Tổng quan hệ thống</h1>
          <p className="text-xs text-admin-text-muted mt-1 uppercase tracking-widest">Chào mừng quay trở lại, Admin</p>
        </div>
        <button 
          onClick={() => fetchData(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-admin-panel border border-admin-border text-[10px] font-bold uppercase tracking-widest text-admin-text-muted hover:text-cyan hover:border-cyan/50 transition-all group active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan' : ''}`} />
          <span>{isRefreshing ? 'Đang làm mới...' : 'Làm mới dữ liệu'}</span>
        </button>
      </div>
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 bg-admin-panel backdrop-blur-md border border-admin-border shadow-lg`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <s.icon className={`w-24 h-24 ${s.color}`} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-admin-bg/5 border border-admin-border ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-[0.2em]">{s.label}</p>
              </div>
              <h3 className={`text-3xl sm:text-4xl font-display font-black tracking-tighter ${s.color} ${s.glow}`}>{s.value}</h3>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex items-center text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3 h-3 mr-1" /><span>+12.5%</span>
                </div>
                <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">so với hôm qua</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bento Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-10 rounded-[3rem] relative overflow-hidden bg-admin-panel backdrop-blur-md border border-admin-border shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan/10 border border-cyan/20">
                <TrendingUp className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-display font-black text-admin-text uppercase tracking-wider">Phân tích doanh thu</h3>
                <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mt-1">Dữ liệu thời gian thực</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['Ngày', 'Tuần', 'Tháng'].map((period, i) => (
                <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-cyan text-midnight' : 'bg-admin-bg/5 text-admin-text-muted hover:text-admin-text'}`}>{period}</button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            {mounted && analytics && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="day" stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `${v}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '15px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#00FFFF', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${value}M VNĐ`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#00FFFF" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-admin-panel/50 backdrop-blur-sm z-20">
                <Loader2 className="w-8 h-8 text-cyan animate-spin" />
              </div>
            )}

          </div>
        </div>

        <div className="glass-card p-6 md:p-10 rounded-[3rem] relative overflow-hidden bg-admin-panel backdrop-blur-md border border-admin-border shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-magenta/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-magenta/10 border border-magenta/20">
              <Zap className="w-6 h-6 text-magenta" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-admin-text uppercase tracking-wider">Lưu lượng</h3>
              <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mt-1">Người tham dự trực tiếp</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            {mounted && analytics && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="day" stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '15px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#FF00FF', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [value, 'Người tham dự']}
                  />
                  <Line 
                    type="step" 
                    dataKey="quantity" 
                    stroke="#FF00FF" 
                    strokeWidth={5} 
                    dot={{ r: 6, fill: '#FF00FF', strokeWidth: 0 }}
                    activeDot={{ r: 10, fill: '#FF00FF', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-admin-panel/50 backdrop-blur-sm z-20">
                <Loader2 className="w-8 h-8 text-magenta animate-spin" />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card p-6 md:p-10 rounded-[3rem] bg-admin-panel backdrop-blur-md border border-admin-border shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20">
              <History className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-display font-black text-admin-text uppercase tracking-wider">Hoạt động gần đây</h3>
              <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mt-1">Các giao dịch mới nhất</p>
            </div>
          </div>
          <Link 
            href="/admin/transactions" 
            className="text-[10px] font-bold text-cyan uppercase tracking-widest hover:underline transition-all"
          >
            Xem tất cả
          </Link>
        </div>
        
        <div className="space-y-4 relative min-h-[200px]">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-admin-bg/5 border border-admin-border hover:bg-admin-bg/10 transition-all group gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-admin-bg/10 flex items-center justify-center text-admin-text text-xs font-bold uppercase">
                  {tx.customer?.[0] || 'K'}
                </div>
                <div>
                  <div className="text-sm font-bold text-admin-text group-hover:text-cyan transition-colors">{tx.customer}</div>
                  <div className="text-xs text-admin-text-muted mt-1">
                    {new Date(tx.time).toLocaleString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                <div className="text-sm font-bold text-admin-text">{formatCurrency(tx.amount)}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                  tx.status === 'COMPLETED' || tx.status === 'SUCCESS' 
                    ? 'text-cyan bg-cyan/10 border-cyan/20' 
                    : 'text-gold bg-gold/10 border-gold/20'
                }`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
          {transactions.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-admin-text-muted italic">
              Không có giao dịch nào gần đây
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-admin-panel/50 backdrop-blur-sm z-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

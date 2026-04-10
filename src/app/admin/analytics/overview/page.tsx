'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, Calendar, Globe, Zap,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface AnalyticsData {
  totalRevenue: number;
  totalTickets: number;
  totalParticipants: number;
  checkInRate: number;
  ticketDistribution: Array<{ name: string; value: number; color: string }>;
  revenueTrend: Array<{ day: string; revenue: number }>;
}

export default function AnalyticsOverviewPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [range, setRange] = React.useState<'7' | '30'>('7');

  const fetchAnalytics = async (selectedRange: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/overview?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  if (isLoading && !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-cyan animate-spin" />
        <p className="text-admin-text-muted font-display font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu thực tế...</p>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'Tổng Doanh Thu', value: `${(data.totalRevenue).toLocaleString()}đ`, icon: DollarSign, color: 'text-cyan', trend: '+12%', up: true },
    { label: 'Tỷ Lệ Check-In', value: `${data.checkInRate}%`, icon: Zap, color: 'text-magenta', trend: '+5%', up: true },
    { label: 'Người Tham Gia', value: data.totalParticipants.toLocaleString(), icon: Users, color: 'text-emerald', trend: '+8%', up: true },
    { label: 'Vé Đã Bán', value: data.totalTickets.toLocaleString(), icon: Ticket, color: 'text-gold', trend: '+24%', up: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Tổng Quan Phân Tích</h2>
          <p className="text-admin-text-muted text-sm mt-1">Dữ liệu được cập nhật trực tiếp từ hệ thống đặt vé</p>
        </div>
        <div className="flex p-1 rounded-xl bg-admin-bg/20 border border-admin-border">
          {[
            { id: '7', label: '7 Ngày' },
            { id: '30', label: '30 Ngày' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setRange(option.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                range === option.id 
                  ? 'bg-gold text-midnight shadow-[0_0_10px_#E6C753]' 
                  : 'text-admin-text-muted hover:text-admin-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>


      {/* Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="p-5 rounded-3xl bg-admin-panel border border-admin-border backdrop-blur-md relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${s.color.replace('text-', 'bg-')}`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-xl bg-admin-bg/5 backdrop-blur-md ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? 'text-teal-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.trend}
              </div>
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">{s.label}</div>
            <div className={`text-2xl font-display font-black text-admin-text relative z-10`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-[2rem] bg-admin-panel border border-admin-border">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan/10 border border-cyan/20 rounded-xl"><BarChart3 className="w-5 h-5 text-cyan" /></div>
              <h3 className="font-display font-black text-admin-text uppercase tracking-wider text-sm">Biến Động Doanh Thu</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="day" stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `${v}M`} />
                <Tooltip cursor={{ fill: 'var(--admin-bg)', fillOpacity: 0.1 }} contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#00FFFF" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ticket Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 md:p-8 rounded-[2rem] bg-admin-panel border border-admin-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-magenta/10 border border-magenta/20 rounded-xl"><Ticket className="w-5 h-5 text-magenta" /></div>
            <h3 className="font-display font-black text-admin-text uppercase tracking-wider text-sm">Cơ Cấu Vé Đã Bán</h3>
          </div>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.ticketDistribution} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {data.ticketDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <div className="text-3xl font-display font-black text-admin-text">{data.totalTickets}</div>
              <div className="text-[10px] text-admin-text-muted uppercase font-bold tracking-widest">Tổng vé</div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {data.ticketDistribution.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                <span className="text-[10px] text-admin-text-muted font-bold uppercase">{t.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

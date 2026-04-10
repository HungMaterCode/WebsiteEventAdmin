'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  Users, LogIn, LogOut, Clock, Activity, Calendar, 
  ArrowRightLeft, UserCheck, Loader2, Info
} from 'lucide-react';

const COLORS = ['#00FFFF', '#FF0088', '#E6C753', '#00C099'];

export default function CheckinFlowAnalytics() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [range, setRange] = React.useState('1');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/checkin-checkout?range=${range}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [range]);

  if (isLoading && !data) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan animate-spin" />
        <p className="text-admin-text-muted font-black uppercase tracking-[0.2em] text-sm">Đang phân tích luồng khách...</p>
      </div>
    );
  }

  const { summary, hourlyData, typeStats } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-gold glow-gold" />
            Phân tích Check-in & Check-out
          </h2>
          <p className="text-admin-text-muted text-sm mt-1">Theo dõi thời gian khách ở lại và lưu lượng người thực tế</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Đang hiện diện', value: summary.currentlyPresent.toLocaleString(), icon: Users, color: 'var(--gold)', sub: 'Khách đang ở sự kiện' },
          { label: 'Tổng Check-in', value: summary.totalIn.toLocaleString(), icon: LogIn, color: 'var(--cyan)', sub: 'Lượt vào từ đầu ngày' },
          { label: 'Thời gian ở lại TB', value: `${summary.avgStayHours}h`, icon: Clock, color: 'var(--emerald)', sub: `Xấp xỉ ${Math.round(summary.avgStayMinutes)} phút` },
          { label: 'Tổng Check-out', value: summary.totalOut.toLocaleString(), icon: LogOut, color: 'var(--magenta)', sub: 'Lượt khách đã ra về' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
              <s.icon className="w-16 h-16" style={{ color: s.color }} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">{s.label}</div>
            <div className="text-3xl font-display font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-admin-text-muted mt-2 font-medium uppercase">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Trend chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30 min-h-[450px]">
          <h3 className="text-sm font-black uppercase tracking-widest text-admin-text mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" />
            Biểu đồ Lấp đầy Theo Thời Gian (Real-time Flow)
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" opacity={0.1} vertical={false} />
                <XAxis dataKey="time" stroke="var(--admin-text-muted)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--admin-text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="occupancy" name="Khách hiện diện" stroke="var(--gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorOcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance by Type */}
        <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30">
          <h3 className="text-xs font-black uppercase tracking-widest text-admin-text mb-8 flex items-center justify-between">
            Tỉ lệ tham dự theo hạng vé
            <UserCheck className="w-4 h-4 text-cyan" />
          </h3>
          
          <div className="space-y-8">
            {typeStats.map((s: any, i: number) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="text-sm font-bold text-admin-text">{s.type}</div>
                  <div className="text-right">
                    <div className="text-xs text-admin-text-muted uppercase font-bold tracking-widest mb-1">Check-in Rate</div>
                    <div className={`text-xl font-display font-black ${i === 0 ? 'text-magenta' : 'text-cyan'}`}>{s.rate}%</div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${s.rate}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full" 
                    style={{ background: i === 0 ? 'var(--magenta)' : 'var(--cyan)' }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-admin-text-muted uppercase">
                  <span>{s.checkedIn} đã vào</span>
                  <span>Tổng {s.total} vé</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 rounded-2xl border border-admin-border/5 bg-admin-bg/5 space-y-4">
             <div className="flex items-start gap-3">
               <Info className="w-4 h-4 text-admin-text-muted shrink-0 mt-0.5" />
               <p className="text-[10px] text-admin-text-muted leading-relaxed">
                 Hệ thống tính toán tỉ lệ tham dự dựa trên tổng số vé đã bán (không tính vé đã hủy).
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Entry vs Exit Flow Chart */}
      <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30 h-[400px]">
        <h3 className="text-sm font-black uppercase tracking-widest text-admin-text mb-6 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald" />
          Lưu lượng Vào - Ra mỗi giờ
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" opacity={0.1} vertical={false} />
              <XAxis dataKey="time" stroke="var(--admin-text-muted)" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--admin-text-muted)" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '12px', fontSize: '11px' }}
              />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="entries" name="Vào" fill="var(--cyan)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exits" name="Ra" fill="var(--magenta)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

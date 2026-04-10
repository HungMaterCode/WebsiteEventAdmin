'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  DollarSign, Activity, TrendingUp, Calendar, 
  Loader2, Info
} from 'lucide-react';

const COLORS = ['#FF0088', '#00FFFF', '#E6C753', '#00C099'];

export default function TicketsRevenueAnalytics() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [range, setRange] = React.useState('7');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/tickets-revenue?range=${range}`);
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
        <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin" />
        <p className="text-admin-text-muted font-black uppercase tracking-[0.2em] text-sm animate-pulse">Đang nạp dữ liệu chi tiết...</p>
      </div>
    );
  }

  const { stats, typeSummary, sourceData, zones, trends } = data || {};

  // Find VIP and GA summary
  const vipSum = typeSummary?.find((s: any) => s.ticketType === 'VIP')?._sum?.totalPrice || 0;
  const gaSum = typeSummary?.find((s: any) => s.ticketType === 'GA')?._sum?.totalPrice || 0;
  
  const ticketDist = typeSummary?.map((s: any) => ({
    name: s.ticketType,
    value: s._sum.quantity
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Header & Range Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#00FFFF] glow-cyan" />
            Chi tiết Vé & Doanh thu
          </h2>
          <p className="text-admin-text-muted text-sm mt-1">Phân tích hiệu quả kinh doanh và tình trạng lấp đầy 2 khu vực</p>
        </div>
        
        <div className="flex bg-admin-panel/80 p-1.5 rounded-2xl border border-admin-border/30 backdrop-blur-md self-end lg:self-auto">
          {['7', '30'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
                ${range === r 
                  ? 'bg-gradient-to-r from-[#00FFFF] to-[#00C099] text-[#060010] shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
                  : 'text-admin-text-muted hover:text-admin-text opacity-50 hover:opacity-100'
                }`}
            >
              {r} NGÀY
            </button>
          ))}
        </div>
      </div>

      {/* Top Cards: Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Doanh thu VIP', value: `${(vipSum / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#FF0088', sub: 'Hạng vé cao cấp' },
          { label: 'Doanh thu GA', value: `${(gaSum / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#00FFFF', sub: 'Hạng vé phổ thông' },
          { label: 'Giá vé trung bình', value: `${(stats?.aov / 1000).toFixed(0)}K`, icon: TrendingUp, color: '#E6C753', sub: 'VNĐ / Đơn hàng' },
          { label: 'Tốc độ bán', value: `${stats?.velocity.toFixed(1)}`, icon: Calendar, color: '#00C099', sub: 'Vé / Ngày' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all transform group-hover:scale-110 group-hover:-rotate-12">
              <s.icon className="w-16 h-16" style={{ color: s.color }} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </div>
            <div className="text-3xl font-display font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-admin-text-muted mt-2 font-medium uppercase tracking-tight">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30 h-[500px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-admin-text mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#00FFFF] rounded-full" />
              So sánh Doanh thu (Triệu VNĐ)
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8A8F98" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#8A8F98" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D0716', border: '1px solid #4F1F76', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="VIP" name="Doanh thu VIP" fill="#FF0088" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GA" name="Doanh thu GA" fill="#00FFFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-admin-text mb-4 text-center">Phân bổ Số lượng Vé</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ticketDist} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={8} dataKey="value">
                      {ticketDist.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0D0716', border: '1px solid #4F1F76', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 border border-admin-border/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-admin-text mb-4 text-center">Nguồn Phát hành</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={8} dataKey="value">
                      {sourceData?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#00FFFF' : '#E6C753'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0D0716', border: '1px solid #4F1F76', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Analysis Column */}
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-[2rem] bg-gradient-to-br from-admin-panel to-admin-bg border border-admin-border/50 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF00881a] rounded-full blur-3xl" />
            
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-admin-text mb-8 flex items-center justify-between">
              Giám sát lấp đầy
              <Info className="w-4 h-4 text-admin-text-muted cursor-help" />
            </h3>

            <div className="space-y-10">
              {zones?.map((zone: any, i: number) => {
                const pct = Math.round((zone.booked / zone.capacity) * 100);
                const color = zone.name.includes('VIP') ? '#FF0088' : '#00FFFF';
                
                return (
                  <div key={zone.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-admin-text-muted mb-1">{zone.name}</div>
                        <div className="text-sm font-bold text-admin-text">{zone.booked.toLocaleString()} / <span className="text-admin-text-muted font-medium">{zone.capacity.toLocaleString()}</span> vé</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-display font-black" style={{ color }}>{pct}%</div>
                      </div>
                    </div>
                    <div className="h-4 rounded-full bg-black/40 border border-admin-border/30 p-1 relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: color, boxShadow: `0 0 10px ${color}80` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-4 rounded-2xl bg-admin-bg/5 border border-admin-border/10">
              <div className="text-[10px] text-admin-text-muted font-bold uppercase tracking-widest mb-2">Chỉ dẫn</div>
              <ul className="space-y-2 text-[10px] font-medium text-admin-text-muted/70">
                <li className="flex items-center gap-2 pr-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF0088]" />
                  VIP: Tối đa 500 người
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFFF]" />
                  GA: Tối đa 2,000 người
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] border border-[#00FFFF33] bg-[#00FFFF0d] backdrop-blur-sm">
            <h4 className="text-[11px] font-black uppercase text-[#00FFFF] mb-2">Thông tin tối ưu</h4>
            <p className="text-[10px] text-admin-text-muted leading-relaxed">
              Dữ liệu được cập nhật dựa trên thời gian thực từ database. 
              Các vé trạng thái <span className="text-admin-text">CANCELLED</span> không được tính vào doanh thu và sức chứa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

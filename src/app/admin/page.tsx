'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, DollarSign, Users, Zap, TrendingUp, History,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const mockTransactions = [
  { id: '1', date: '5 phút trước', user: 'nguyen.van.a@gmail.com', amount: '1,500,000 VNĐ', status: 'Thành công' },
  { id: '2', date: '15 phút trước', user: 'hoang.thu@gmail.com', amount: '750,000 VNĐ', status: 'Thành công' },
  { id: '3', date: '1 giờ trước', user: 'tran.b@gmail.com', amount: '3,000,000 VNĐ', status: 'Thành công' },
  { id: '4', date: '2 giờ trước', user: 'le.c@gmail.com', amount: '750,000 VNĐ', status: 'Thành công' },
];

const mockChartData = [
  { name: '10:00', value: 400, quantity: 4 },
  { name: '12:00', value: 300, quantity: 2 },
  { name: '14:00', value: 550, quantity: 5 },
  { name: '16:00', value: 450, quantity: 3 },
  { name: '18:00', value: 700, quantity: 8 },
  { name: '20:00', value: 650, quantity: 6 },
  { name: '22:00', value: 900, quantity: 10 },
];

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Tổng số vé', value: 1250, icon: Ticket, color: 'text-cyan', glow: 'glow-cyan', bg: 'bg-cyan/10 border-cyan/20' },
    { label: 'Tổng doanh thu', value: `3.5B VNĐ`, icon: DollarSign, color: 'text-magenta', glow: 'glow-magenta', bg: 'bg-magenta/10 border-magenta/20' },
    { label: 'Số người tham dự', value: 856, icon: Users, color: 'text-emerald', glow: 'glow-emerald', bg: 'bg-emerald/10 border-emerald/20' },
    { label: 'Tỷ lệ Check-in', value: `68%`, icon: Zap, color: 'text-gold', glow: 'glow-gold', bg: 'bg-gold/10 border-gold/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `${v}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--cyan)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--admin-border)" tick={{ fontSize: 10, fill: 'var(--admin-text-muted)' }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--admin-panel)', border: '1px solid var(--admin-border)', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: 'var(--magenta)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line 
                  type="step" 
                  dataKey="quantity" 
                  stroke="var(--magenta)" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'var(--magenta)', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: 'var(--magenta)', stroke: 'var(--admin-border)', strokeWidth: 10 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
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
          <button className="text-[10px] font-bold text-cyan uppercase tracking-widest hover:underline">Xem tất cả</button>
        </div>
        
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-admin-bg/5 border border-admin-border hover:bg-admin-bg/10 transition-all group gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-admin-bg/10 flex items-center justify-center text-admin-text text-xs font-bold">
                  {tx.user[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-admin-text group-hover:text-cyan transition-colors">{tx.user}</div>
                  <div className="text-xs text-admin-text-muted mt-1">{tx.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                <div className="text-sm font-bold text-admin-text">{tx.amount}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan bg-cyan/10 px-3 py-1.5 rounded-xl border border-cyan/20">
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

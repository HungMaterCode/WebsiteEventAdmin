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
    { label: 'Tổng số vé', value: 1250, icon: Ticket, color: 'text-[#00FFFF]', glow: 'glow-cyan', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20' },
    { label: 'Tổng doanh thu', value: `3.5B VNĐ`, icon: DollarSign, color: 'text-[#FF0088]', glow: 'glow-magenta', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20' },
    { label: 'Số người tham dự', value: 856, icon: Users, color: 'text-[#00C099]', glow: 'glow-teal', bg: 'bg-[#00C099]/10 border-[#00C099]/20' },
    { label: 'Tỷ lệ Check-in', value: `68%`, icon: Zap, color: 'text-[#E6C753]', glow: 'glow-gold', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <s.icon className={`w-24 h-24 ${s.color}`} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
              </div>
              <h3 className={`text-3xl sm:text-4xl font-display font-black tracking-tighter ${s.color} ${s.glow}`}>{s.value}</h3>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex items-center text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3 h-3 mr-1" /><span>+12.5%</span>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">so với hôm qua</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bento Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-10 rounded-[3rem] relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFFF]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20">
                <TrendingUp className="w-6 h-6 text-[#00FFFF]" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wider">Phân tích doanh thu</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dữ liệu thời gian thực</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['Ngày', 'Tuần', 'Tháng'].map((period, i) => (
                <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-[#00FFFF] text-[#060010]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>{period}</button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `${v}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0510', border: '1px solid #ffffff10', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: '#00FFFF', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00FFFF" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 md:p-10 rounded-[3rem] relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0088]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-[#FF0088]/10 border border-[#FF0088]/20">
              <Zap className="w-6 h-6 text-[#FF0088]" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">Lưu lượng</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Người tham dự trực tiếp</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0510', border: '1px solid #ffffff10', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: '#FF0088', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line 
                  type="step" 
                  dataKey="quantity" 
                  stroke="#FF0088" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#FF0088', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: '#FF0088', stroke: '#ffffff20', strokeWidth: 10 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card p-6 md:p-10 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#E6C753]/10 border border-[#E6C753]/20">
              <History className="w-6 h-6 text-[#E6C753]" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wider">Hoạt động gần đây</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Các giao dịch mới nhất</p>
            </div>
          </div>
          <button className="text-[10px] font-bold text-[#00FFFF] uppercase tracking-widest hover:underline">Xem tất cả</button>
        </div>
        
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                  {tx.user[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#00FFFF] transition-colors">{tx.user}</div>
                  <div className="text-xs text-gray-400 mt-1">{tx.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                <div className="text-sm font-bold text-white">{tx.amount}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#00FFFF] bg-[#00FFFF]/10 px-3 py-1.5 rounded-xl border border-[#00FFFF]/20">
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

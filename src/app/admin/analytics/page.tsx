'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, Calendar, Globe, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const ticketData = [
  { name: 'VIP', value: 400, color: '#FF0088' },
  { name: 'Standard', value: 850, color: '#00FFFF' },
  { name: 'Early Bird', value: 300, color: '#E6C753' },
];

const revenueData = [
  { day: 'Thứ 2', revenue: 120 }, { day: 'Thứ 3', revenue: 150 },
  { day: 'Thứ 4', revenue: 180 }, { day: 'Thứ 5', revenue: 220 },
  { day: 'Thứ 6', revenue: 350 }, { day: 'Thứ 7', revenue: 580 },
  { day: 'Chủ Nhật', revenue: 490 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Phân Tích & Báo Cáo</h2>
        <p className="text-[#8A8F98] text-sm mt-1">Dữ liệu chi tiết về doanh thu, lượt khách và hiệu quả chiến dịch</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Doanh Thu Tháng', value: '3.2B', icon: DollarSign, color: 'text-[#00FFFF]', trend: '+12%', up: true },
          { label: 'Tỷ Lệ Check-In', value: '68%', icon: Zap, color: 'text-[#FF0088]', trend: '+5%', up: true },
          { label: 'Khách Mới', value: '1,240', icon: Users, color: 'text-[#00C099]', trend: '-2%', up: false },
          { label: 'Vé Đã Bán', value: '1,550', icon: Ticket, color: 'text-[#E6C753]', trend: '+24%', up: true },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-white/5 ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? 'text-[#00C099]' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.trend}
              </div>
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-2xl font-display font-black text-white`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-[#0D0716]/80 border border-[#4F1F76]/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00FFFF]/10 border border-[#00FFFF]/20 rounded-xl"><BarChart3 className="w-5 h-5 text-[#00FFFF]" /></div>
              <h3 className="font-display font-black text-white uppercase tracking-wider text-sm">Doanh Thu 7 Ngày Qua</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `${v}M`} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0a0510', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#00FFFF" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Distribution */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-[#0D0716]/80 border border-[#4F1F76]/30">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#FF0088]/10 border border-[#FF0088]/20 rounded-xl"><Ticket className="w-5 h-5 text-[#FF0088]" /></div>
            <h3 className="font-display font-black text-white uppercase tracking-wider text-sm">Cơ Cấu Loại Vé</h3>
          </div>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ticketData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {ticketData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <div className="text-3xl font-display font-black text-white">1,550</div>
              <div className="text-[10px] text-[#8A8F98] uppercase font-bold tracking-widest">Tổng vé</div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {ticketData.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                <span className="text-[10px] text-[#8A8F98] font-bold uppercase">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2,
  XCircle, Search, Filter, ArrowUpRight, ArrowDownRight, Ticket, ShoppingBag
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminTransactionsPage() {
  const [data, setData] = useState<any>({ transactions: [], stats: { revenueToday: 0, gaTickets: 0, vipTickets: 0, totalOrders: 0 } });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch transactions:', err);
        setLoading(false);
      });
  }, []);

  const filteredTransactions = data.transactions.filter((tx: any) => {
    const matchesSearch = 
      tx.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.bookingCode && tx.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.gateway.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || tx.type.includes(filterType);
    
    return matchesSearch && matchesType;
  });

  const chartData = [
    { time: '08:00', value: 0 }, 
    { time: '12:00', value: data.stats.revenueToday / 2000000 }, 
    { time: '16:00', value: data.stats.revenueToday / 1500000 }, 
    { time: '20:00', value: data.stats.revenueToday / 1000000 }
  ];

  const getStatusStyle = (s: string) => {
    if (s === 'Thành công') return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
    if (s === 'Đã hoàn') return 'bg-[#FF0088]/10 text-[#FF0088] border-[#FF0088]/30';
    if (s === 'Thất bại') return 'bg-red-500/10 text-red-500 border-red-500/30';
    return 'bg-[#8A8F98]/10 text-[#8A8F98] border-[#8A8F98]/30';
  };

  const stats = [
    { label: 'Doanh Thu Hôm Nay', value: `${(data.stats.revenueToday / 1000000).toFixed(1)}M VNĐ`, icon: DollarSign, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20', trend: '+100%', up: true },
    { label: 'Vé GA Đã Bán', value: data.stats.gaTickets.toString(), icon: Ticket, color: 'text-[#00C099]', bg: 'bg-[#00C099]/10 border-[#00C099]/20', trend: 'Live', up: true },
    { label: 'Vé VIP Đã Bán', value: data.stats.vipTickets.toString(), icon: Ticket, color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20', trend: 'Live', up: true },
    { label: 'Tổng Giao Dịch', value: data.stats.totalOrders.toString(), icon: ArrowUpRight, color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20', trend: 'Total', up: true },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-[#8A8F98] animate-pulse">Đang tải dữ liệu giao dịch...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Giao Dịch</h2>
        <p className="text-[#8A8F98] text-sm mt-1">Lịch sử thanh toán thời gian thực và thống kê lượng vé đã bán</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md bg-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
            <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${s.up ? 'text-[#00C099]' : 'text-red-400'}`}>
              {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Chart - Simplified for real data */}
      <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20">
            <TrendingUp className="w-6 h-6 text-[#00FFFF]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Luồng Tiền Hôm Nay</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Giao dịch theo khung giờ (x1M VNĐ)</p>
          </div>
        </div>
        <div className="h-[200px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="txnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fill: '#8A8F98' }} tickLine={false} axisLine={false} dx={-10} tickFormatter={v => `${v}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0510', border: '1px solid #ffffff10', borderRadius: '16px', padding: '12px' }} itemStyle={{ color: '#00FFFF', fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="#00FFFF" strokeWidth={3} fillOpacity={1} fill="url(#txnGrad)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input 
              type="text" 
              placeholder="Tìm theo mã vé hoặc tên"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98] pointer-events-none" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-10 pr-8 py-3 text-xs font-bold text-[#8A8F98] hover:text-[#FFFFFF] appearance-none cursor-pointer outline-none focus:border-[#00FFFF]"
              >
                <option value="ALL">TẤT CẢ LOẠI</option>
                <option value="GA">VÉ GA</option>
                <option value="VIP">VÉ VIP</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 whitespace-nowrap">Mã GD</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Loại</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[180px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Cổng TT</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Số Tiền</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden md:table-cell text-right whitespace-nowrap">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8A8F98] italic">Không tìm thấy giao dịch nào phù hợp.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx: any, i: number) => (
                  <motion.tr key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group">
                    <td className="p-4"><span className="font-mono text-sm font-bold text-[#00FFFF]">TXN-{tx.displayId}</span></td>
                    <td className="p-4 text-sm text-[#8A8F98]">
                      <div className="flex items-center gap-2">
                        {tx.type.includes('Hoàn tiền') ? <TrendingDown className="w-4 h-4 text-[#FF0088]" /> : <TrendingUp className="w-4 h-4 text-[#00C099]" />}
                        {tx.type}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-[#FFFFFF]">
                      {tx.customer}
                      {tx.bookingCode && (
                        <div className="text-[10px] font-mono text-[#00FFFF] mt-1 opacity-70">Vé: {tx.bookingCode}</div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#8A8F98] uppercase font-bold">{tx.gateway}</td>
                    <td className={`p-4 text-right font-bold ${tx.amount > 0 ? 'text-[#00C099]' : 'text-[#FF0088]'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} VNĐ
                    </td>
                    <td className="p-4 hidden md:table-cell text-right text-xs text-[#8A8F98] whitespace-nowrap">
                      {new Date(tx.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(tx.time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

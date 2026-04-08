'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2,
  XCircle, Search, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTransactions = [
  { id: 'TXN-9941', type: 'Mua vé', customer: 'Nguyễn Văn A', amount: '+3,500,000 VNĐ', gateway: 'VNPay', status: 'Thành công', time: '22:14 - 05/04' },
  { id: 'TXN-9940', type: 'Mua vé', customer: 'Trần Thị B', amount: '+1,500,000 VNĐ', gateway: 'MoMo', status: 'Thành công', time: '21:50 - 05/04' },
  { id: 'TXN-9939', type: 'Hoàn tiền', customer: 'Lê Văn C', amount: '-3,000,000 VNĐ', gateway: 'Chuyển khoản', status: 'Đã hoàn', time: '20:33 - 05/04' },
  { id: 'TXN-9938', type: 'Mua vé', customer: 'Hoàng Minh D', amount: '+7,000,000 VNĐ', gateway: 'VNPay', status: 'Thành công', time: '19:22 - 05/04' },
  { id: 'TXN-9937', type: 'Mua vé', customer: 'Phạm Thị E', amount: '+1,200,000 VNĐ', gateway: 'MoMo', status: 'Thất bại', time: '18:10 - 05/04' },
  { id: 'TXN-9936', type: 'Mua vé', customer: 'Đỗ Văn F', amount: '+3,500,000 VNĐ', gateway: 'VNPay', status: 'Thành công', time: '17:05 - 05/04' },
];

const chartData = [
  { time: '08:00', value: 15 }, { time: '10:00', value: 55 }, { time: '12:00', value: 30 },
  { time: '14:00', value: 80 }, { time: '16:00', value: 60 }, { time: '18:00', value: 120 },
  { time: '20:00', value: 90 }, { time: '22:00', value: 150 },
];

export default function AdminTransactionsPage() {
  const getStatusStyle = (s: string) => {
    if (s === 'Thành công') return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
    if (s === 'Đã hoàn') return 'bg-[#FF0088]/10 text-[#FF0088] border-[#FF0088]/30';
    if (s === 'Thất bại') return 'bg-red-500/10 text-red-500 border-red-500/30';
    return 'bg-[#8A8F98]/10 text-admin-text-muted border-[#8A8F98]/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Giao Dịch</h2>
        <p className="text-admin-text-muted text-sm mt-1">Lịch sử thanh toán thời gian thực, hoàn tiền và xuất báo cáo tài chính</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Doanh Thu Hôm Nay', value: '156.5M VNĐ', icon: DollarSign, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20', trend: '+18.2%', up: true },
          { label: 'Giao Dịch Thành Công', value: '248', icon: CheckCircle2, color: 'text-[#00C099]', bg: 'bg-[#00C099]/10 border-[#00C099]/20', trend: '+5.4%', up: true },
          { label: 'Đang Xử Lý', value: '12', icon: Clock, color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20', trend: '-2', up: false },
          { label: 'Thất Bại / Hoàn Tiền', value: '7', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', trend: '-3', up: true },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md bg-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
            <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${s.up ? 'text-[#00C099]' : 'text-red-400'}`}>
              {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Chart */}
      <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20">
            <TrendingUp className="w-6 h-6 text-[#00FFFF]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Luồng Tiền Hôm Nay</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Giao dịch theo khung giờ (x1M VNĐ)</p>
          </div>
        </div>
        <div className="h-[200px]">
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
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
            <input type="text" placeholder="Tìm mã giao dịch, khách hàng..."
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF] transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-[#4F1F76]/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Cổng Thanh Toán
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border whitespace-nowrap">Mã GD</th>
                <th className="p-4 font-bold border-b border-admin-border">Loại</th>
                <th className="p-4 font-bold border-b border-admin-border min-w-[180px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-admin-border">Cổng TT</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Số Tiền</th>
                <th className="p-4 font-bold border-b border-admin-border hidden md:table-cell text-right whitespace-nowrap">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx, i) => (
                <motion.tr key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-admin-border hover:bg-[#4F1F76]/5 transition-colors group">
                  <td className="p-4"><span className="font-mono text-sm font-bold text-[#00FFFF]">{tx.id}</span></td>
                  <td className="p-4 text-sm text-admin-text-muted">
                    <div className="flex items-center gap-2">
                      {tx.type === 'Hoàn tiền' ? <TrendingDown className="w-4 h-4 text-[#FF0088]" /> : <TrendingUp className="w-4 h-4 text-[#00C099]" />}
                      {tx.type}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-admin-text">{tx.customer}</td>
                  <td className="p-4 text-sm text-admin-text-muted">{tx.gateway}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold ${tx.amount.startsWith('+') ? 'text-[#00C099]' : 'text-[#FF0088]'}`}>
                    {tx.amount}
                  </td>
                  <td className="p-4 hidden md:table-cell text-right text-xs text-admin-text-muted whitespace-nowrap">{tx.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

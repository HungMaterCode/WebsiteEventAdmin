'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CreditCard, CheckCircle2, XCircle,
  Clock, Eye, X, Package, User, Calendar, DollarSign
} from 'lucide-react';

const mockOrders = [
  { id: 'ORD-00421', customer: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', items: 3, total: '10,500,000 VNĐ', status: 'Đã thanh toán', method: 'VNPay', date: '2026-04-05 10:32' },
  { id: 'ORD-00420', customer: 'Trần Thị B', email: 'tranthib@gmail.com', items: 1, total: '1,500,000 VNĐ', status: 'Chờ thanh toán', method: 'Chuyển khoản', date: '2026-04-05 09:15' },
  { id: 'ORD-00419', customer: 'Lê Văn C', email: 'levanc@gmail.com', items: 2, total: '3,000,000 VNĐ', status: 'Đã hủy', method: 'MoMo', date: '2026-04-04 21:50' },
  { id: 'ORD-00418', customer: 'Hoàng Minh D', email: 'hoangminhd@gmail.com', items: 4, total: '14,000,000 VNĐ', status: 'Đã thanh toán', method: 'VNPay', date: '2026-04-04 18:40' },
  { id: 'ORD-00417', customer: 'Phạm Thị E', email: 'phamthie@gmail.com', items: 1, total: '1,200,000 VNĐ', status: 'Hoàn tiền', method: 'MoMo', date: '2026-04-03 14:22' },
  { id: 'ORD-00416', customer: 'Đỗ Văn F', email: 'dovanf@gmail.com', items: 2, total: '7,000,000 VNĐ', status: 'Đã thanh toán', method: 'VNPAY', date: '2026-04-03 11:05' },
];

const statusConfig: Record<string, { style: string; icon: React.ElementType }> = {
  'Đã thanh toán': { style: 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30', icon: CheckCircle2 },
  'Chờ thanh toán': { style: 'bg-[#E6C753]/10 text-[#E6C753] border-[#E6C753]/30', icon: Clock },
  'Đã hủy':         { style: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle },
  'Hoàn tiền':      { style: 'bg-[#FF0088]/10 text-[#FF0088] border-[#FF0088]/30', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [selected, setSelected] = React.useState<typeof mockOrders[0] | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Đơn Hàng</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Theo dõi, duyệt và quản lý toàn bộ đơn đặt vé của khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Đơn Hàng', value: '2,841', color: 'text-[#00FFFF]', glow: 'glow-cyan', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20', icon: Package },
          { label: 'Đã Thanh Toán', value: '2,612', color: 'text-[#00C099]', glow: '', bg: 'bg-[#00C099]/10 border-[#00C099]/20', icon: CheckCircle2 },
          { label: 'Chờ Thanh Toán', value: '189', color: 'text-[#E6C753]', glow: 'glow-gold', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20', icon: Clock },
          { label: 'Đã Hoàn Tiền', value: '40', color: 'text-red-500', glow: '', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md bg-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color} ${s.glow}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input type="text" placeholder="Tìm mã đơn, khách hàng, email..."
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#4F1F76]/50 text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Trạng Thái
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 whitespace-nowrap">Mã Đơn</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[200px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Phương Thức</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Tổng Tiền</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden md:table-cell whitespace-nowrap">Thời Gian</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => {
                const cfg = statusConfig[order.status] ?? { style: 'bg-[#8A8F98]/10 text-[#8A8F98] border-[#8A8F98]/30', icon: Clock };
                const Icon = cfg.icon;
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-[#00FFFF]">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#4F1F76]/30 border border-[#4F1F76]/50 flex items-center justify-center text-[#FFFFFF] font-bold text-sm shrink-0">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#FFFFFF] text-sm">{order.customer}</div>
                          <div className="text-xs text-[#8A8F98]">{order.items} vé</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[#8A8F98]">
                        <CreditCard className="w-4 h-4 text-[#4F1F76]" /> {order.method}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${cfg.style}`}>
                        <Icon className="w-3 h-3" /> {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-[#FFFFFF]">{order.total}</td>
                    <td className="p-4 hidden md:table-cell text-xs text-[#8A8F98] whitespace-nowrap">{order.date}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelected(order)}
                        className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                    <Package className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-[#FFFFFF] uppercase tracking-wider">Chi Tiết Đơn Hàng</h3>
                    <p className="text-[10px] text-[#8A8F98] font-mono mt-0.5">{selected.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { icon: User, label: 'Khách hàng', value: selected.customer },
                  { icon: Calendar, label: 'Email', value: selected.email },
                  { icon: CreditCard, label: 'Phương thức', value: selected.method },
                  { icon: DollarSign, label: 'Tổng tiền', value: selected.total },
                  { icon: Calendar, label: 'Thời gian', value: selected.date },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 text-[#8A8F98] text-sm"><Icon className="w-4 h-4" /> {label}</div>
                    <div className="font-bold text-[#FFFFFF] text-sm">{value}</div>
                  </div>
                ))}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${statusConfig[selected.status]?.style ?? ''}`}>
                  <span className="text-sm font-bold">Trạng thái</span>
                  <span className="text-sm font-black uppercase tracking-widest">{selected.status}</span>
                </div>
              </div>
              <div className="p-6 border-t border-[#4F1F76]/30 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-8 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Đóng</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

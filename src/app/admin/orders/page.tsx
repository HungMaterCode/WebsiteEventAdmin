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
  'Đã thanh toán': { style: 'bg-emerald/10 text-emerald border-emerald/30', icon: CheckCircle2 },
  'Chờ thanh toán': { style: 'bg-gold/10 text-gold border-gold/30', icon: Clock },
  'Đã hủy':         { style: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle },
  'Hoàn tiền':      { style: 'bg-magenta/10 text-magenta border-magenta/30', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [selected, setSelected] = React.useState<typeof mockOrders[0] | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Đơn Hàng</h2>
          <p className="text-admin-text-muted text-sm mt-1">Theo dõi, duyệt và quản lý toàn bộ đơn đặt vé của khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Đơn Hàng', value: '2,841', color: 'text-cyan', glow: 'glow-cyan', bg: 'bg-cyan/10 border-cyan/20', icon: Package },
          { label: 'Đã Thanh Toán', value: '2,612', color: 'text-emerald', glow: '', bg: 'bg-emerald/10 border-emerald/20', icon: CheckCircle2 },
          { label: 'Chờ Thanh Toán', value: '189', color: 'text-gold', glow: 'glow-gold', bg: 'bg-gold/10 border-gold/20', icon: Clock },
          { label: 'Đã Hoàn Tiền', value: '40', color: 'text-red-500', glow: '', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md bg-admin-panel/20 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color} ${s.glow}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between items-center bg-admin-bg/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
            <input type="text" placeholder="Tìm mã đơn, khách hàng, email..."
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-bg/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Trạng Thái
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border whitespace-nowrap">Mã Đơn</th>
                <th className="p-4 font-bold border-b border-admin-border min-w-[200px]">Khách Hàng</th>
                <th className="p-4 font-bold border-b border-admin-border">Phương Thức</th>
                <th className="p-4 font-bold border-b border-admin-border text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Tổng Tiền</th>
                <th className="p-4 font-bold border-b border-admin-border hidden md:table-cell whitespace-nowrap">Thời Gian</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => {
                const cfg = statusConfig[order.status] ?? { style: 'bg-admin-text-muted/10 text-admin-text-muted border-admin-text-muted/30', icon: Clock };
                const Icon = cfg.icon;
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-cyan">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-admin-bg/30 border border-admin-border flex items-center justify-center text-admin-text font-bold text-sm shrink-0">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-admin-text text-sm">{order.customer}</div>
                          <div className="text-xs text-admin-text-muted">{order.items} vé</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-admin-text-muted">
                        <CreditCard className="w-4 h-4 opacity-50" /> {order.method}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${cfg.style}`}>
                        <Icon className="w-3 h-3" /> {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-admin-text">{order.total}</td>
                    <td className="p-4 hidden md:table-cell text-xs text-admin-text-muted whitespace-nowrap">{order.date}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelected(order)}
                        className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all" title="Xem chi tiết">
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
              onClick={() => setSelected(null)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                    <Package className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-admin-text uppercase tracking-wider">Chi Tiết Đơn Hàng</h3>
                    <p className="text-[10px] text-admin-text-muted font-mono mt-0.5">{selected.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { icon: User, label: 'Khách hàng', value: selected.customer },
                  { icon: Calendar, label: 'Email', value: selected.email },
                  { icon: CreditCard, label: 'Phương thức', value: selected.method },
                  { icon: DollarSign, label: 'Tổng tiền', value: selected.total },
                  { icon: Calendar, label: 'Thời gian', value: selected.date },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-admin-bg/5 border border-admin-border">
                    <div className="flex items-center gap-3 text-admin-text-muted text-sm"><Icon className="w-4 h-4" /> {label}</div>
                    <div className="font-bold text-admin-text text-sm">{value}</div>
                  </div>
                ))}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${statusConfig[selected.status]?.style ?? ''}`}>
                  <span className="text-sm font-bold">Trạng thái</span>
                  <span className="text-sm font-black uppercase tracking-widest">{selected.status}</span>
                </div>
              </div>
              <div className="p-6 border-t border-admin-border flex justify-end">
                <button onClick={() => setSelected(null)} className="px-8 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Đóng</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

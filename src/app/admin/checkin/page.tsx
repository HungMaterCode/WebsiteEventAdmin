'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle2, XCircle, Clock, Search, Zap, Users, TrendingUp } from 'lucide-react';

const mockCheckins = [
  { id: 'TKT-827391', guestName: 'Nguyễn Văn A', type: 'VIP', zone: 'Khu A - Sân khấu chính', checkedAt: '19:42:05', status: 'Thành công' },
  { id: 'TKT-827392', guestName: 'Trần Thị B', type: 'GA', zone: 'Khu B - Trải nghiệm', checkedAt: '19:41:33', status: 'Thành công' },
  { id: 'TKT-827393', guestName: 'Lê Văn C', type: 'GA', zone: 'Khu B - Trải nghiệm', checkedAt: '19:40:58', status: 'Thành công' },
  { id: 'TKT-827394', guestName: 'Hoàng Minh D', type: 'VIP', zone: 'Khu A - Sân khấu chính', checkedAt: '19:40:12', status: 'Vé đã dùng' },
  { id: 'TKT-827395', guestName: 'Phạm Thị E', type: 'GA', zone: 'Cổng vào', checkedAt: '19:39:44', status: 'Vé không hợp lệ' },
];

export default function AdminCheckinPage() {
  const [scanInput, setScanInput] = React.useState('');
  const [lastScan, setLastScan] = React.useState<{ status: string; guest: string } | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const found = mockCheckins.find(t => t.id.toLowerCase() === scanInput.toLowerCase());
    setLastScan(found ? { status: found.status, guest: found.guestName } : { status: 'Không tìm thấy', guest: scanInput });
    setScanInput('');
  };

  const getStatusStyle = (s: string) => {
    if (s === 'Thành công') return { style: 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30', icon: CheckCircle2 };
    if (s === 'Vé đã dùng') return { style: 'bg-[#E6C753]/10 text-[#E6C753] border-[#E6C753]/30', icon: Clock };
    return { style: 'bg-red-500/10 text-red-500 border-red-500/30', icon: XCircle };
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Hệ Thống Check-In</h2>
        <p className="text-[#8A8F98] text-sm mt-1">Quét mã QR, xác thực vé và kiểm soát lối vào theo thời gian thực</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Đã Check-In', value: '856', color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20', icon: CheckCircle2 },
          { label: 'Tổng Vé Bán', value: '1,250', color: 'text-[#FFFFFF]', bg: 'bg-white/5 border-white/10', icon: Users },
          { label: 'Tỷ Lệ Check-In', value: '68%', color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20', icon: TrendingUp },
          { label: 'Vé Lỗi', value: '14', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Scanner Panel */}
        <div className="lg:col-span-1 glass-card p-6 rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20">
              <QrCode className="w-6 h-6 text-[#00FFFF]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Quét QR / Mã Vé</h3>
              <p className="text-[10px] text-[#8A8F98] tracking-widest font-bold uppercase mt-0.5">Nhập thủ công hoặc dùng máy quét</p>
            </div>
          </div>

          {/* Scan Box */}
          <div className="aspect-square rounded-2xl bg-[#060010] border-2 border-dashed border-[#4F1F76]/50 flex flex-col items-center justify-center mb-6 relative overflow-hidden group hover:border-[#00FFFF]/50 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,255,255,0.03)_0%,_transparent_70%)]" />
            <QrCode className="w-24 h-24 text-[#4F1F76] group-hover:text-[#00FFFF]/30 transition-colors mb-4" />
            <p className="text-[#8A8F98] text-xs font-bold uppercase tracking-widest">Khu Vực Quét QR</p>
            <p className="text-[#4F1F76] text-[10px] mt-1">Kết nối thiết bị quét để bắt đầu</p>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent animate-pulse" />
          </div>

          <form onSubmit={handleScan} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
              <input type="text" value={scanInput} onChange={e => setScanInput(e.target.value)}
                placeholder="Nhập mã vé (VD: TKT-827391)..."
                className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#00C099] text-[#060010] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform glow-cyan">
              <Zap className="w-5 h-5" /> Kiểm Tra Vé
            </button>
          </form>

          {/* Last Scan Result */}
          {lastScan && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl border ${lastScan.status === 'Thành công' ? 'bg-[#00C099]/10 border-[#00C099]/40 text-[#00C099]' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}>
              <div className="flex items-center gap-2 font-bold">
                {lastScan.status === 'Thành công' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {lastScan.status}
              </div>
              <div className="text-sm mt-1 opacity-75">{lastScan.guest}</div>
            </motion.div>
          )}
        </div>

        {/* Recent Checkins Feed */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/5">
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">Log Check-In Thời Gian Thực</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-pulse" />
              <p className="text-[10px] text-[#00FFFF] font-bold uppercase tracking-widest">Live Feed</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-[#4F1F76]/30">Khách Hàng</th>
                  <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden sm:table-cell">Hạng Vé</th>
                  <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden md:table-cell">Khu Vực</th>
                  <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Kết Quả</th>
                  <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Giờ</th>
                </tr>
              </thead>
              <tbody>
                {mockCheckins.map((c, i) => {
                  const { style, icon: Icon } = getStatusStyle(c.status);
                  return (
                    <motion.tr key={c.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#FFFFFF] text-sm">{c.guestName}</div>
                        <div className="text-xs text-[#8A8F98] font-mono mt-0.5">{c.id}</div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`text-xs font-black ${c.type === 'VIP' ? 'text-[#FF0088]' : 'text-[#FFFFFF]'}`}>{c.type}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-xs text-[#8A8F98]">{c.zone}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${style}`}>
                          <Icon className="w-3 h-3" /> {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-xs text-[#8A8F98]">{c.checkedAt}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

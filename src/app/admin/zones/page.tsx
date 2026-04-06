'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users, Ticket, Zap, Edit2 } from 'lucide-react';

const mockZones = [
  { id: 'ZA', name: 'Khu A – Sân Khấu Chính', capacity: 2000, current: 1450, type: 'Biểu diễn', color: '#FF0088', glow: 'glow-magenta' },
  { id: 'ZB', name: 'Khu B – Trải Nghiệm', capacity: 1500, current: 900, type: 'Triển lãm', color: '#00FFFF', glow: 'glow-cyan' },
  { id: 'ZC', name: 'Khu C – Ẩm Thực Di Sản', capacity: 800, current: 500, type: 'Ẩm thực', color: '#E6C753', glow: 'glow-gold' },
  { id: 'ZD', name: 'Khu D – Khu Vip Lounge', capacity: 300, current: 210, type: 'VIP', color: '#00C099', glow: '' },
  { id: 'ZE', name: 'Khu E – Loto & Game Zone', capacity: 500, current: 180, type: 'Giải trí', color: '#4F1F76', glow: '' },
];

export default function AdminZonesPage() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Khu Vực</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Theo dõi sức chứa và luồng người tham dự theo từng khu vực trải nghiệm</p>
        </div>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Khu Vực', value: '5', icon: Map, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20' },
          { label: 'Tổng Sức Chứa', value: '5,100', icon: Ticket, color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20' },
          { label: 'Đang Hiện Diện', value: '3,240', icon: Users, color: 'text-[#00C099]', bg: 'bg-[#00C099]/10 border-[#00C099]/20' },
          { label: 'Tỷ Lệ Lấp Đầy', value: '63.5%', icon: Zap, color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20' },
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

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockZones.map((zone, i) => {
          const pct = Math.round((zone.current / zone.capacity) * 100);
          const barColor = pct >= 90 ? '#FF0088' : pct >= 70 ? '#E6C753' : zone.color;
          return (
            <motion.div key={zone.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] -mr-20 -mt-20 opacity-10" style={{ background: zone.color }} />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ color: zone.color, borderColor: zone.color + '40', background: zone.color + '15' }}>
                    {zone.type} · {zone.id}
                  </span>
                  <h3 className="text-lg font-display font-black text-[#FFFFFF] mt-3 leading-tight">{zone.name}</h3>
                </div>
                <button className="p-2 rounded-xl bg-white/5 text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-white/10 transition-all shrink-0 ml-2">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest">Lấp Đầy</span>
                  <span className="font-display font-black text-lg" style={{ color: barColor }}>{pct}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full shadow-lg"
                    style={{ background: `linear-gradient(90deg, ${barColor}80, ${barColor})`, boxShadow: `0 0 12px ${barColor}60` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8A8F98] font-bold">
                  <span><span className="text-[#FFFFFF]">{zone.current.toLocaleString()}</span> người</span>
                  <span>Tối đa <span className="text-[#FFFFFF]">{zone.capacity.toLocaleString()}</span></span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: barColor }} />
                <span className="text-xs font-bold" style={{ color: barColor }}>
                  {pct >= 90 ? '⚠ Sắp đầy' : pct >= 70 ? 'Đông khách' : 'Đang hoạt động'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

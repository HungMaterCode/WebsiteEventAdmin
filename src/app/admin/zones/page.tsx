'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Users, Ticket, Zap, Edit2, Plus, X, Save, Trash2, Loader2 } from 'lucide-react';

interface Zone {
  id: number;
  name: string;
  capacity: number;
  booked: number;
  status: string;
}

export default function AdminZonesPage() {
  const [zones, setZones] = React.useState<Zone[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [selectedZone, setSelectedZone] = React.useState<Partial<Zone>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/zones');
      if (res.ok) {
        const data = await res.json();
        setZones(data);
      }
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchZones();
  }, []);

  const handleOpenModal = (zone: Zone | null = null) => {
    if (zone) {
      setEditMode(true);
      setSelectedZone({ ...zone });
    } else {
      setEditMode(false);
      setSelectedZone({ name: '', capacity: 100, booked: 0, status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editMode ? `/api/admin/zones/${selectedZone.id}` : '/api/admin/zones';
      const method = editMode ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedZone),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchZones();
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.error || 'Không thể lưu khu vực'}\nChi tiết: ${errorData.details || 'Vui lòng kiểm tra lại dữ liệu'}`);
      }
    } catch (error: any) {
      console.error('Failed to save zone:', error);
      alert('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khu vực này?')) return;
    
    try {
      const res = await fetch(`/api/admin/zones/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setZones(prev => prev.filter(z => z.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  // Calculations
  const totalZones = zones.length;
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const totalBooked = zones.reduce((sum, z) => sum + z.booked, 0);
  const totalOccupancy = totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0;

  const getZoneColor = (name: string, index: number) => {
    if (name.toUpperCase().includes('VIP')) return '#FF0088';
    if (name.toUpperCase().includes('GA') || name.toUpperCase().includes('THƯỜNG')) return '#00FFFF';
    const colors = ['#00FFFF', '#FF0088', '#E6C753', '#00C099', '#4F1F76'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Khu Vực</h2>
          <p className="text-admin-text-muted text-sm mt-1">Sức chứa và luồng người tham dự cho 2 khu vực cố định (VIP và GA)</p>
        </div>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Khu Vực', value: totalZones.toString(), icon: Map, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
          { label: 'Tổng Sức Chứa', value: totalCapacity.toLocaleString(), icon: Ticket, color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20' },
          { label: 'Đang Hiện Diện', value: totalBooked.toLocaleString(), icon: Users, color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/20' },
          { label: 'Tỷ Lệ Lấp Đầy', value: `${totalOccupancy.toFixed(1)}%`, icon: Zap, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Zone Cards Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-cyan animate-spin" />
          <p className="text-admin-text-muted font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu từ database...</p>
        </div>
      ) : zones.length === 0 ? (
        <div className="text-center p-20 glass-card rounded-[2rem] border border-admin-border/10">
          <p className="text-admin-text-muted/50">Chưa có khu vực nào được tạo. Hãy thêm "Khu VIP" và "Khu GA" ngay!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {zones.map((zone, i) => {
            const pct = zone.capacity > 0 ? Math.round((zone.booked / zone.capacity) * 100) : 0;
            const zoneColor = getZoneColor(zone.name, i);
            const barColor = pct >= 90 ? '#FF0088' : pct >= 70 ? '#E6C753' : zoneColor;
            
            return (
              <motion.div key={zone.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 shadow-xl relative overflow-hidden group hover:border-admin-text/20 transition-all">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] -mr-20 -mt-20 opacity-10" style={{ background: zoneColor }} />

                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ color: zoneColor, borderColor: zoneColor + '40', background: zoneColor + '15' }}>
                      {zone.name.toUpperCase().includes('VIP') ? 'Premium' : 'Standard'} · ID: {zone.id}
                    </span>
                    <h3 className="text-lg font-display font-black text-admin-text mt-3 leading-tight">{zone.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(zone)}
                      className="p-2 rounded-xl bg-admin-bg/5 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">Lấp Đầy</span>
                    <span className="font-display font-black text-lg" style={{ color: barColor }}>{pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-admin-bg/5 border border-admin-border/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full shadow-lg"
                      style={{ background: `linear-gradient(90deg, ${barColor}80, ${barColor})`, boxShadow: `0 0 12px ${barColor}60` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-admin-text-muted font-bold">
                    <span><span className="text-admin-text">{zone.booked.toLocaleString()}</span> người</span>
                    <span>Sức chứa <span className="text-admin-text">{zone.capacity.toLocaleString()}</span></span>
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
      )}

      {/* Modal - Thêm / Sửa Khu Vực */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-admin-panel border border-admin-border/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-admin-border/30 bg-admin-bg/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                    <Map className="w-5 h-5 text-cyan" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase tracking-wider">{editMode ? 'Chỉnh Sửa Khu Vực' : 'Thêm Khu Vực Mới'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Khu Vực *</label>
                  <input 
                    type="text" 
                    required
                    value={selectedZone.name || ''}
                    onChange={(e) => setSelectedZone({ ...selectedZone, name: e.target.value })}
                    placeholder="Ví dụ: Khu VIP – Gần Sân Khấu" 
                    className="w-full bg-admin-bg border border-admin-border/50 rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Sức Chứa Tối Đa *</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={selectedZone.capacity || ''}
                      onChange={(e) => setSelectedZone({ ...selectedZone, capacity: parseInt(e.target.value) })}
                      className="w-full bg-admin-bg border border-admin-border/50 rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Hiện Có (Tự động)</label>
                    <input 
                      type="number" 
                      readOnly
                      title="Số lượng này được tổng hợp tự động từ danh sách vé"
                      value={selectedZone.booked || 0}
                      className="w-full bg-admin-bg/50 border border-admin-border/30 rounded-xl px-4 py-3 text-admin-text-muted cursor-not-allowed outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Trạng Thái</label>
                  <select 
                    value={selectedZone.status || 'ACTIVE'}
                    onChange={(e) => setSelectedZone({ ...selectedZone, status: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border/50 rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan appearance-none"
                  >
                    <option value="ACTIVE">⚡ Đang hoạt động</option>
                    <option value="MAINTENANCE">🛠 Bảo trì / Chuẩn bị</option>
                    <option value="CLOSED">🔒 Đã đóng</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy Bỏ</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan to-emerald text-midnight font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-cyan disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )} 
                    {editMode ? 'Lưu Thay Đổi' : 'Tạo Khu Vực'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

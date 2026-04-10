'use client';

import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Clock, Plus, Trash2, Edit3, X,
  GripVertical, ArrowUp, ArrowDown
} from 'lucide-react';

export default function TimelineManagement() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);


  const fetchData = async () => {
    try {
      const resTimeline = await fetch('/api/timeline');
      if (resTimeline.ok) {
        setItems(await resTimeline.json());
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa mốc thời gian này?')) return;
    try {
      const res = await fetch(`/api/timeline?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleAddEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const res = await fetch('/api/timeline', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        setEditingItem(null);
        fetchData();
      }
    } catch (error) {
      console.error('Save item failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = (newOrder: any[]) => {
    // 1. Cập nhật giao diện lập thức (Optimistic UI)
    setItems(newOrder);

    // 2. Xóa timeout cũ
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    // 3. Thiết lập timeout mới để đồng bộ hóa (Debounce)
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      const itemsToSync = newOrder.map((item, index) => ({ 
        id: item.id, 
        sortOrder: index 
      }));

      try {
        const res = await fetch('/api/timeline', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemsToSync)
        });
        if (!res.ok) throw new Error('Sync failed');
      } catch (error) {
        console.error('Failed to save order:', error);
      } finally {
        setIsSyncing(false);
        syncTimeoutRef.current = null;
      }
    }, 1200); // Đợi 1.2s sau khi ngừng kéo để lưu
  };


  const moveManual = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    handleReorder(newItems);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse font-display text-sm tracking-widest uppercase">Đang tải lộ trình...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tight italic text-glow-cyan flex items-center gap-4">
            Quản Lý Lộ Trình
            {isSyncing && (
              <span className="flex items-center gap-2 text-[10px] font-bold text-cyan animate-pulse bg-cyan/10 px-3 py-1 rounded-full border border-cyan/20 normal-case italic tracking-normal">
                <div className="w-1.5 h-1.5 bg-cyan rounded-full" />
                Đang lưu thứ tự...
              </span>
            )}
          </h2>
          <p className="text-admin-text-muted text-sm mt-1">Sử dụng thanh nắm kéo hoặc nút mũi tên để thay đổi thứ tự</p>
        </div>

        <button
          onClick={() => setEditingItem({ time: '', title: '', description: '', sortOrder: items.length })}
          className="px-8 py-4 bg-gradient-to-r from-cyan to-royal text-midnight font-black rounded-xl flex items-center gap-3 hover:scale-[1.05] transition-all glow-cyan shadow-lg uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" /> THÊM MỐC HOẠT ĐỘNG
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-4">
          {items.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              initial={false}
              whileDrag={{ 
                scale: 1.02, 
                boxShadow: "0 25px 60px -15px rgba(0,255,255,0.25)",
                zIndex: 50 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 35,
                mass: 1 
              }}
              className="glass-card p-5 md:p-6 rounded-3xl bg-admin-panel border border-admin-border flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-cyan/40 shadow-2xl relative overflow-hidden"
            >

              <div className="absolute top-0 left-0 w-1 h-full bg-cyan/50 group-hover:bg-cyan transition-colors" />

              <div className="flex items-center gap-5 shrink-0">
                <div className="text-admin-text-muted group-hover:text-cyan transition-colors cursor-grab active:cursor-grabbing p-2 hover:bg-admin-bg/5 rounded-lg">
                  <GripVertical className="w-6 h-6" />
                </div>
                <div className="p-3.5 rounded-2xl bg-cyan/10 border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-3xl font-display font-black text-admin-text italic tracking-tighter text-glow-cyan">{item.time}</div>
              </div>

              <motion.div className="flex-1 min-w-0" layout="position">
                <h4 className="text-xl font-bold text-admin-text uppercase tracking-widest mb-1.5 line-clamp-1 group-hover:text-cyan transition-colors">{item.title}</h4>
                <p className="text-admin-text-muted text-sm leading-relaxed line-clamp-2 pr-4">{item.description}</p>
              </motion.div>



              <div className="flex items-center gap-2 shrink-0 self-end md:self-center bg-black/40 p-2 rounded-2xl border border-white/5">
                <div className="flex flex-col gap-1 mr-2 border-r border-white/10 pr-2">
                  <button onClick={() => moveManual(index, 'up')} disabled={index === 0} className="p-2 text-gray-400 hover:text-cyan disabled:opacity-0 transition-all rounded-lg hover:bg-cyan/10"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveManual(index, 'down')} disabled={index === items.length - 1} className="p-2 text-gray-400 hover:text-cyan disabled:opacity-0 transition-all rounded-lg hover:bg-cyan/10"><ArrowDown className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setEditingItem(item)} className="p-3 rounded-xl bg-royal/40 text-white hover:bg-cyan hover:text-midnight transition-all shadow-lg border border-white/5"><Edit3 className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 rounded-xl bg-red-500/40 text-white hover:bg-red-500 transition-all shadow-lg border border-white/5"><Trash2 className="w-5 h-5" /></button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {items.length === 0 && (
          <div className="text-center py-24 bg-admin-bg/50 border-2 border-dashed border-admin-border rounded-[3rem] text-admin-text-muted italic font-medium">
            Chưa có hoạt động nào trong lộ trình. Hãy bắt đầu xây dựng sự kiện của bạn!
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-admin-panel border border-admin-border rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.15)]"
            >
              <div className="p-8 border-b border-admin-border flex justify-between items-center bg-admin-bg/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                    <Clock className="w-5 h-5 text-cyan" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase italic tracking-wider">{editingItem.id ? 'Sửa mốc thời gian' : 'Thêm mốc mới'}</h3>
                </div>
                <button type="button" onClick={() => setEditingItem(null)} className="p-2 text-admin-text-muted hover:text-admin-text hover:bg-admin-bg/5 rounded-full transition-all relative z-10"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddEdit} className="p-8 space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block pl-1">Mốc thời gian (VD: 18:00, 20:30...)</label>
                      <input
                        required
                        type="text"
                        value={editingItem.time}
                        onChange={e => setEditingItem({ ...editingItem, time: e.target.value })}
                        placeholder="18:00"
                        className="w-full bg-admin-bg border border-admin-border rounded-2xl px-6 py-5 text-admin-text focus:outline-none focus:border-cyan text-2xl font-black italic outline-none transition-all placeholder:opacity-10 text-glow-cyan shadow-[inset_0_0_20px_rgba(0,255,255,0.02)]"
                      />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block pl-1">Hoạt động diễn ra</label>
                    <input
                      required
                      type="text"
                      value={editingItem.title}
                      onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="VD: Đón Khách, Đại tiệc âm nhạc..."
                      className="w-full bg-admin-bg border border-admin-border rounded-2xl px-6 py-4 text-admin-text font-bold outline-none transition-all placeholder:font-normal placeholder:opacity-30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block pl-1">Phần mô tả thêm</label>
                    <textarea
                      value={editingItem.description}
                      onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={4}
                      placeholder="Chi tiết về hoạt động này sẽ được hiển thị trên trang chủ..."
                      className="w-full bg-admin-bg border border-admin-border rounded-2xl px-6 py-4 text-admin-text text-sm leading-relaxed outline-none transition-all resize-none shadow-[inset_0_0_20px_rgba(0,255,255,0.02)]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-5 rounded-2xl border border-admin-border text-admin-text font-black hover:bg-admin-bg/5 transition-all text-sm uppercase tracking-widest">HỦY BỎ</button>
                  <button type="submit" disabled={saving} className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-cyan to-royal text-midnight font-black hover:scale-[1.02] transition-all glow-cyan text-sm uppercase tracking-widest disabled:opacity-50">
                    {saving ? 'ĐANG LƯU...' : (editingItem.id ? 'LƯU THAY ĐỔI' : 'THÊM MỐC MỚI')}
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

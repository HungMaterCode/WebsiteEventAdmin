'use client';

import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  MessageSquare, Plus, Trash2, Edit3, X,
  GripVertical, ArrowUp, ArrowDown, User, Hash, Users, Save
} from 'lucide-react';

export default function CommunityManagement() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [communitySettings, setCommunitySettings] = React.useState({ communityHashtag: '#NeonHeritage2024', communityFollowers: '25K+', communityMentions: '150K+' });
  const [savingSettings, setSavingSettings] = React.useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetch('/api/settings/landing-page').then(r => r.ok ? r.json() : null).then(data => {
      if (data) setCommunitySettings({ communityHashtag: data.communityHashtag || '#NeonHeritage2024', communityFollowers: data.communityFollowers || '25K+', communityMentions: data.communityMentions || '150K+' });
    }).catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await fetch('/api/settings/landing-page', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(communitySettings) });
    } catch (e) { console.error(e); }
    finally { setSavingSettings(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    try {
      const res = await fetch(`/api/community?id=${id}`, { method: 'DELETE' });
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
      const res = await fetch('/api/community', {
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
    setItems(newOrder);
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      const itemsToSync = newOrder.map((item, index) => ({ 
        id: item.id, 
        sortOrder: index 
      }));

      try {
        const res = await fetch('/api/community', {
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
    }, 1200);
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

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse font-display text-sm tracking-widest uppercase">Đang tải cộng đồng...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-white tracking-tight italic text-glow-cyan flex items-center gap-4">
            Quản Lý Cộng Đồng
            {isSyncing && (
              <span className="flex items-center gap-2 text-[10px] font-bold text-cyan animate-pulse bg-cyan/10 px-3 py-1 rounded-full border border-cyan/20 normal-case italic tracking-normal">
                <div className="w-1.5 h-1.5 bg-cyan rounded-full" />
                Đang lưu thứ tự...
              </span>
            )}
          </h2>
          <p className="text-[#8A8F98] text-sm mt-1">Quản lý các bài đăng/phản hồi từ cộng đồng trên Landing Page</p>
        </div>
        <button
          onClick={() => setEditingItem({ username: '', content: '', timestamp: 'Vừa xong', sortOrder: items.length })}
          className="px-8 py-4 bg-gradient-to-r from-cyan to-royal text-midnight font-black rounded-xl flex items-center gap-3 hover:scale-[1.05] transition-all glow-cyan shadow-lg uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" /> THÊM BÀI ĐĂNG MỚI
        </button>
      </div>

      {/* Cấu hình hiển thị */}
      <div className="glass-card p-6 rounded-3xl bg-[#0D0716]/90 border border-[#4F1F76]/40 space-y-5">
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2"><Hash className="w-5 h-5 text-magenta" /> Cấu hình hiển thị</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Hashtag</label>
            <input value={communitySettings.communityHashtag} onChange={e => setCommunitySettings({...communitySettings, communityHashtag: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-cyan font-bold focus:outline-none focus:border-cyan transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Followers</label>
            <input value={communitySettings.communityFollowers} onChange={e => setCommunitySettings({...communitySettings, communityFollowers: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-magenta font-bold focus:outline-none focus:border-cyan transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Mentions</label>
            <input value={communitySettings.communityMentions} onChange={e => setCommunitySettings({...communitySettings, communityMentions: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-cyan font-bold focus:outline-none focus:border-cyan transition-all" />
          </div>
        </div>
        <button onClick={saveSettings} disabled={savingSettings} className="px-6 py-3 bg-gradient-to-r from-magenta to-royal text-white font-black rounded-xl flex items-center gap-2 hover:scale-[1.03] transition-all text-xs uppercase tracking-widest disabled:opacity-50">
          <Save className="w-4 h-4" /> {savingSettings ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
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
              className="glass-card p-5 md:p-6 rounded-3xl bg-[#0D0716]/90 backdrop-blur-xl border border-[#4F1F76]/40 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-cyan/40 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan/50 group-hover:bg-cyan transition-colors" />

              <div className="flex items-center gap-5 shrink-0">
                <div className="text-gray-600 group-hover:text-cyan transition-colors cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg">
                  <GripVertical className="w-6 h-6" />
                </div>
                <div className="p-3.5 rounded-2xl bg-royal/20 border border-royal/30 text-magenta shadow-[0_0_15px_rgba(255,0,136,0.1)]">
                  <User className="w-6 h-6" />
                </div>
              </div>

              <motion.div className="flex-1 min-w-0" layout="position">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-cyan font-bold tracking-wide">{item.username}</span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-tighter">{item.timestamp}</span>
                </div>
                <p className="text-silver/80 text-sm leading-relaxed italic">&quot;{item.content}&quot;</p>
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
          <div className="text-center py-24 bg-royal/5 border-2 border-dashed border-[#4F1F76]/20 rounded-[3rem] text-gray-600 italic font-medium">
            Chưa có bài đăng nào từ cộng đồng. Hãy khởi tạo những phản hồi đầu tiên!
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.15)]"
            >
              <div className="p-8 border-b border-[#4F1F76]/30 flex justify-between items-center bg-[#4F1F76]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                    <MessageSquare className="w-5 h-5 text-cyan" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white uppercase italic tracking-wider">{editingItem.id ? 'Sửa bài đăng' : 'Thêm bài đăng mới'}</h3>
                </div>
                <button type="button" onClick={() => setEditingItem(null)} className="p-2 text-[#8A8F98] hover:text-white hover:bg-white/5 rounded-full transition-all relative z-10"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddEdit} className="p-8 space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Tên người dùng (Username - VD: @minh_anh)</label>
                    <input
                      required
                      type="text"
                      value={editingItem.username}
                      onChange={e => setEditingItem({ ...editingItem, username: e.target.value })}
                      placeholder="@username"
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan font-bold outline-none transition-all placeholder:opacity-30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Thời gian hiển thị (VD: 2m ago, Vừa xong...)</label>
                    <input
                      required
                      type="text"
                      value={editingItem.timestamp}
                      onChange={e => setEditingItem({ ...editingItem, timestamp: e.target.value })}
                      placeholder="Vừa xong"
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan outline-none transition-all placeholder:opacity-30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Nội dung phản hồi</label>
                    <textarea
                      required
                      value={editingItem.content}
                      onChange={e => setEditingItem({ ...editingItem, content: e.target.value })}
                      rows={4}
                      placeholder="Nhập nội dung cộng đồng đang nói gì..."
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan text-sm leading-relaxed outline-none transition-all resize-none shadow-[inset_0_0_20px_rgba(0,255,255,0.02)]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-5 rounded-2xl border border-[#4F1F76] text-white font-black hover:bg-white/5 transition-all text-sm uppercase tracking-widest">HỦY BỎ</button>
                  <button type="submit" disabled={saving} className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-cyan to-royal text-midnight font-black hover:scale-[1.02] transition-all glow-cyan text-sm uppercase tracking-widest disabled:opacity-50">
                    {saving ? 'ĐANG LƯU...' : (editingItem.id ? 'LƯU THAY ĐỔI' : 'THÊM MỚI')}
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

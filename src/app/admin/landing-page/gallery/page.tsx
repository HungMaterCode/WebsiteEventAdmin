'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Plus, Trash2, Save, 
  Layout, Type, CheckCircle2, AlertCircle, 
  HelpCircle, Edit3, X
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

export default function GalleryManagement() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingItem, setEditingItem] = React.useState<any>(null);

  const fetchData = async () => {
    try {
      const resGallery = await fetch('/api/gallery');
      if (resGallery.ok) {
        setItems(await resGallery.json());
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
    if (!confirm('Bạn có chắc muốn xóa khoảnh khắc này?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
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
      const res = await fetch('/api/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        setEditingItem(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi lưu');
      }
    } catch (error) {
      console.error('Save item failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse font-display text-sm tracking-widest uppercase">Đang tải khoảnh khắc...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-white tracking-tight italic">Khoảnh Khắc Di Sản</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Quản lý tối đa 6 hình ảnh đẹp nhất hiển thị trên trang chủ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Gallery Items Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Gallery Item Cards */}
            {items.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
                className="glass-card relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-[#4F1F76]/30 group shadow-2xl hover:border-cyan/50 transition-all duration-500"
              >
                <img src={item.url} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-midnight/90 border border-cyan/30 rounded-full text-[10px] font-black text-cyan shadow-lg">#{index+1}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
                      <button onClick={() => setEditingItem(item)} className="p-2 rounded-xl bg-royal/80 text-white hover:bg-cyan hover:text-midnight transition-all shadow-xl"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-all shadow-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider text-glow-cyan drop-shadow-lg">{item.title}</h4>
                    <div className="w-12 h-1 bg-cyan mt-1 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add More Placeholder */}
            {items.length < 6 && (
              <button 
                onClick={() => setEditingItem({ url: '', title: '', sortOrder: items.length })}
                className="aspect-[4/3] rounded-[2rem] border-2 border-dashed border-[#4F1F76]/40 bg-royal/5 flex flex-col items-center justify-center gap-4 text-[#4F1F76] hover:border-cyan hover:text-cyan hover:bg-cyan/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 relative z-10">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Thêm khoảnh khắc #{items.length + 1}</span>
              </button>
            )}
          </div>
          
          <div className="mt-8 p-6 bg-cyan/5 rounded-[2rem] border border-cyan/10 flex items-start gap-4">
             <div className="p-2 rounded-xl bg-cyan/10">
               <HelpCircle className="w-6 h-6 text-cyan shrink-0" />
             </div>
             <p className="text-[11px] text-[#8A8F98] leading-relaxed font-medium">
               <strong className="text-cyan uppercase tracking-wider font-black">Lưu ý:</strong> Để có chất lượng tốt nhất trên trang chủ, hãy chọn các hình ảnh có tỉ lệ <strong className="text-white">4:3</strong> (ví dụ: 1200x900px) và dung lượng dưới <strong className="text-white">500KB</strong>. Hệ thống chỉ cho phép tối đa 6 tấm ảnh đẹp nhất để duy trì giao diện Cyberpunk sang trọng.
             </p>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.15)] flex flex-col"
            >
              <div className="p-8 border-b border-[#4F1F76]/30 flex justify-between items-center bg-[#4F1F76]/10">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                      <ImageIcon className="w-5 h-5 text-cyan" />
                   </div>
                   <h3 className="text-xl font-display font-bold text-white uppercase italic tracking-wider">{editingItem.id ? 'Sửa khoảnh khắc' : 'Thêm khoảnh khắc mới'}</h3>
                </div>
                <button type="button" onClick={() => setEditingItem(null)} className="p-2 text-[#8A8F98] hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center justify-center"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddEdit} className="p-8 space-y-6">
                <div className="space-y-5">
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Tiêu đề ảnh</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        value={editingItem.title} 
                        onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                        placeholder="VD: Vũ Điệu Neon..." 
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan outline-none transition-all font-medium pl-12" 
                      />
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block pl-1">Hình ảnh khoảnh khắc</label>
                    <div className="flex gap-3">
                       <div className="relative flex-1">
                        <input 
                          required
                          type="text" 
                          value={editingItem.url} 
                          onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                          placeholder="Link ảnh (https://...)" 
                          className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan outline-none transition-all text-xs font-medium" 
                        />
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
                       </div>
                      <CldUploadWidget 
                        uploadPreset="ml_default"
                        onSuccess={(result: any) => {
                          if (result?.info?.secure_url) setEditingItem((prev: any) => ({ ...prev, url: result.info.secure_url }));
                        }}
                      >
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="px-5 bg-royal/30 border border-royal/50 rounded-xl text-cyan hover:bg-cyan/10 transition-all flex items-center justify-center gap-2 group">
                             <Plus className="w-5 h-5 group-hover:scale-120 transition-transform" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Tải lên</span>
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>

                  {editingItem.url ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-cyan/30 group">
                       <img src={editingItem.url} className="w-full h-full object-cover" alt="Preview" />
                       <div className="absolute inset-0 bg-cyan/10 hidden group-hover:block transition-all" />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-2xl border-2 border-dashed border-[#4F1F76]/20 bg-[#060010] flex flex-col items-center justify-center gap-3 text-[#4F1F76]/40 italic">
                       <ImageIcon className="w-10 h-10 opacity-20" />
                       <span className="text-[10px] uppercase font-bold tracking-widest">Ảnh xem trước sẽ hiện ở đây</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 rounded-xl border border-[#4F1F76] text-white font-black hover:bg-white/5 transition-all text-sm uppercase tracking-widest">Hủy</button>
                   <button type="submit" disabled={saving} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan to-royal text-midnight font-black hover:scale-[1.02] transition-all glow-cyan text-sm uppercase tracking-widest disabled:opacity-50">
                      {saving ? 'Đang lưu...' : (editingItem.id ? 'Lưu thay đổi' : 'Thêm ngay')}
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

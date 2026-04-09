'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit2, Trash2, Search, X, Save, 
  ImageIcon, Star, Clock, ListOrdered, ChevronUp, ChevronDown, Upload
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

export default function ArtistManagement() {
  const [artists, setArtists] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editArtist, setEditArtist] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    genre: '',
    image: '',
    performanceTime: '',
    bio: '',
    sortOrder: 0
  });

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/artists');
      const data = await res.json();
      setArtists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch artists:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchArtists();
  }, []);

  const handleOpenModal = (artist: any = null) => {
    if (artist) {
      setEditArtist(artist);
      setForm({
        name: artist.name,
        genre: artist.genre,
        image: artist.image,
        performanceTime: artist.performanceTime || '',
        bio: artist.bio || '',
        sortOrder: artist.sortOrder || 0
      });
    } else {
      setEditArtist(null);
      setForm({ name: '', genre: '', image: '', performanceTime: '', bio: '', sortOrder: artists.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editArtist ? `/api/artists/${editArtist.id}` : '/api/artists';
      const method = editArtist ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchArtists();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nghệ sĩ này không?')) return;
    try {
      const res = await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      if (res.ok) fetchArtists();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredArtists = artists.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
      <p className="text-cyan font-display tracking-widest uppercase text-sm animate-pulse">Đang tải danh sách nghệ sĩ...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Dàn Nghệ Sĩ Tham Gia</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Quản lý danh sách các nghệ sĩ biểu diễn tại sự kiện</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#FF0088] hover:bg-[#FF0088]/80 text-[#FFFFFF] font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta"
        >
          <Plus className="w-5 h-5" /> Thêm Nghệ Sĩ
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/5">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nghệ sĩ theo tên hoặc thể loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
            />
          </div>
        </div>

        {/* Artist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 w-16 text-center">Thứ tự</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[200px]">Nghệ Sĩ</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Thể Loại</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Thời Gian</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists.map((artist, index) => (
                <motion.tr 
                  key={artist.id} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group"
                >
                  <td className="p-4 text-center font-mono text-[#E6C753]">{artist.sortOrder}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#4F1F76]/20 border border-[#4F1F76]/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {artist.image ? (
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-[#4F1F76]" />
                        )}
                      </div>
                      <div className="font-bold text-[#FFFFFF] text-sm group-hover:text-[#00FFFF] transition-colors">{artist.name}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border bg-[#FF0088]/10 text-[#FF0088] border-[#FF0088]/30">
                      {artist.genre}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#8A8F98] text-xs">
                      <Clock className="w-3 h-3" /> {artist.performanceTime || '--:--'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(artist)}
                        className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all font-display"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(artist.id)}
                        className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-red-500 hover:bg-red-500/10 transition-all font-display"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredArtists.length === 0 && (
            <div className="p-20 text-center text-[#8A8F98]">Không tìm thấy nghệ sĩ nào.</div>
          )}
        </div>
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                    <Users className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#FFFFFF] uppercase">
                    {editArtist ? 'Chỉnh Sửa Nghệ Sĩ' : 'Thêm Nghệ Sĩ Mới'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Tên Nghệ Sĩ *</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="VD: Hồ Ngọc Hà..." 
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Thể Loại *</label>
                    <input 
                      type="text" 
                      value={form.genre} 
                      onChange={e => setForm({ ...form, genre: e.target.value })}
                      placeholder="VD: Pop / Dance..." 
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Thời Gian Biểu Diễn</label>
                    <input 
                      type="text" 
                      value={form.performanceTime} 
                      onChange={e => setForm({ ...form, performanceTime: e.target.value })}
                      placeholder="VD: 22:30 - 23:15" 
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Thứ tự (Sort Order)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={form.sortOrder} 
                        onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                        placeholder="0" 
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
                      />
                      <ListOrdered className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Xem trước hình ảnh</label>
                  <div className="w-full h-40 rounded-2xl bg-[#060010] border border-[#4F1F76]/50 flex items-center justify-center overflow-hidden group/preview relative">
                    {form.image ? (
                      <>
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setForm(prev => ({ ...prev, image: '' }))} className="p-2 bg-red-500 rounded-lg text-white hover:scale-110 transition-transform">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#4F1F76]/40">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">URL Hình Ảnh Nghệ Sĩ</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={form.image} 
                        onChange={e => setForm({ ...form, image: e.target.value })}
                        placeholder="https://..." 
                        className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all font-medium" 
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
                    </div>
                    
                    <CldUploadWidget 
                      uploadPreset="ml_default"
                      onSuccess={(result: any) => {
                        if (result?.info && typeof result.info !== 'string') {
                          const url = result.info.secure_url;
                          setForm(prev => ({ ...prev, image: url }));
                        }
                      }}
                    >
                      {({ open }) => (
                        <button 
                          type="button"
                          onClick={() => open()}
                          className="px-4 py-3 bg-[#4F1F76]/30 border border-[#4F1F76]/50 rounded-xl text-cyan hover:bg-[#00FFFF]/10 transition-all flex items-center gap-2 group"
                        >
                          <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold whitespace-nowrap">Chọn ảnh</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Tiểu Sử / Thông Tin Thêm</label>
                  <textarea 
                    value={form.bio} 
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Giới thiệu ngắn gọn về nghệ sĩ..." 
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] min-h-[120px] resize-none transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#4F1F76]/30 flex justify-end gap-4 shrink-0 bg-[#4F1F76]/5">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.genre}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#4F1F76] text-[#000000] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-50"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                  {editArtist ? 'Lưu Thay Đổi' : 'Tạo Nghệ Sĩ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

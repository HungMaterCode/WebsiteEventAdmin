'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Music, Star, Heart, Mic, 
  Save, Layout, Type, AlignLeft, 
  ImageIcon, Plus, Trash2, CheckCircle2, AlertCircle,
  Drum, Guitar, Radio, Disc, X
} from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

const AVAILABLE_ICONS: Record<string, React.ReactNode> = {
  'Music': <Music className="w-4 h-4" />,
  'Sparkles': <Sparkles className="w-4 h-4" />,
  'Star': <Star className="w-4 h-4" />,
  'Mic': <Mic className="w-4 h-4" />,
  'Drum': <Drum className="w-4 h-4" />,
  'Guitar': <Guitar className="w-4 h-4" />,
  'Radio': <Radio className="w-4 h-4" />,
  'Disc': <Disc className="w-4 h-4" />,
  'Heart': <Heart className="w-4 h-4" />,
};

export default function ArtManagement() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [form, setForm] = React.useState({
    artTitle: '',
    artSubtitle: '',
    artDescription: '',
    artImage: '',
    artItems: [] as any[]
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/landing-page');
        if (res.ok) {
          const data = await res.json();
          setForm({
            artTitle: data.artTitle || 'Nghệ Thuật',
            artSubtitle: data.artSubtitle || 'Di Sản Cyber',
            artDescription: data.artDescription || '',
            artImage: data.artImage || '',
            artItems: Array.isArray(data.artItems) ? data.artItems : [
              { name: 'Đàn Tính', desc: '', icon: 'Music' },
              { name: 'Trống Hội', desc: '', icon: 'Sparkles' },
              { name: 'Khèn Mông', desc: '', icon: 'Music' }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/landing-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Cấu hình nghệ thuật đã được cập nhật thành công!' });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi lưu cấu hình.' });
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...form.artItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, artItems: newItems });
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse font-display text-sm tracking-widest uppercase">Đang tải cấu hình nghệ thuật...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-white tracking-tight italic">Quản Lý Nghệ Thuật</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Cấu hình phần giới thiệu nghệ thuật di sản trên trang chủ</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: General Section Settings */}
        <div className="xl:col-span-1 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full blur-[80px] -mr-16 -mt-16" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                  <Layout className="w-5 h-5 text-cyan" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Thông tin chung</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Tiêu đề (VD: Nghệ Thuật)</label>
                  <input 
                    type="text" 
                    value={form.artTitle} 
                    onChange={e => setForm({ ...form, artTitle: e.target.value })}
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Nổi bật (VD: Di Sản Cyber)</label>
                  <input 
                    type="text" 
                    value={form.artSubtitle} 
                    onChange={e => setForm({ ...form, artSubtitle: e.target.value })}
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Mô tả văn bản</label>
                  <textarea 
                    value={form.artDescription} 
                    onChange={e => setForm({ ...form, artDescription: e.target.value })}
                    rows={4}
                    className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-all resize-none text-sm leading-relaxed" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block">Hình ảnh đại diện (Vòng tròn)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={form.artImage} 
                      onChange={e => setForm({ ...form, artImage: e.target.value })}
                      className="flex-1 bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-all text-xs" 
                    />
                    <CldUploadWidget 
                      uploadPreset="ml_default"
                      onSuccess={(result: any) => {
                        if (result?.info?.secure_url) setForm(prev => ({ ...prev, artImage: result.info.secure_url }));
                      }}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="px-3 bg-royal/30 border border-royal/50 rounded-xl text-cyan hover:bg-cyan/10 transition-all flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                  {form.artImage && (
                    <div className="mt-4 relative group w-24 h-24 mx-auto">
                      <img src={form.artImage} alt="Art Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gold/30 shadow-[0_0_20px_rgba(230,199,83,0.2)]" />
                      <button onClick={() => setForm({ ...form, artImage: '' })} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Items Management */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[120px] -mr-32 -mt-32" />
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gold/10 border border-gold/30">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Chi tiết 3 mục nghệ thuật</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {form.artItems.map((item, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-[#060010]/80 border border-[#4F1F76]/30 space-y-6 hover:border-gold/40 transition-all group relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gold text-midnight text-[10px] font-black uppercase rounded-full shadow-[0_0_15px_rgba(230,199,83,0.4)]">Mục #{index + 1}</div>
                    
                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-3">Biểu tượng</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(AVAILABLE_ICONS).map(([iconName, iconNode]) => (
                          <button 
                            key={iconName}
                            type="button"
                            onClick={() => updateItem(index, 'icon', iconName)}
                            className={`p-2.5 rounded-xl border transition-all ${item.icon === iconName ? 'bg-gold border-gold text-midnight shadow-[0_0_15px_rgba(230,199,83,0.3)] scale-110' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
                            title={iconName}
                          >
                            {iconNode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest block">Tên nhạc cụ / nghệ thuật</label>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={e => updateItem(index, 'name', e.target.value)}
                          placeholder="VD: Đàn Tính..."
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest block">Mô tả ngắn gọn</label>
                        <textarea 
                          value={item.desc} 
                          onChange={e => updateItem(index, 'desc', e.target.value)}
                          placeholder="Nhập mô tả..."
                          rows={3}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-gold/50 transition-all resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className={`px-4 py-3 rounded-xl flex items-center gap-3 border text-xs font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                    >
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      {message.text}
                    </motion.div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-gold to-yellow-600 text-midnight font-black rounded-xl flex items-center justify-center gap-3 hover:scale-[1.05] transition-all glow-gold shadow-[0_0_30px_rgba(230,199,83,0.3)] disabled:opacity-50"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                  CẬP NHẬT GIAO DIỆN NGHỆ THUẬT
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-gray-400 italic leading-relaxed">
               <strong>Mẹo:</strong> Bạn nên chọn ảnh đại diện có độ phân giải ít nhất 800x800px và là ảnh hình vuông để hiển thị đẹp nhất trong vòng tròn. Các mô tả cho 3 mục nhạc cụ nên có độ dài tương đồng để đảm bảo sự cân đối cho giao diện.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}

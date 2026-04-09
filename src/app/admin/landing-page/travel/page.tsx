'use client';

import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Car, Plane, Hotel, Info, Save, Plus, Trash2, 
  GripVertical, Image as ImageIcon, Type, AlignLeft,
  Search, Palette, ChevronDown, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

const ICON_OPTIONS = [
  { label: 'Ô tô', value: 'Car', icon: <Car className="w-4 h-4" /> },
  { label: 'Máy bay', value: 'Plane', icon: <Plane className="w-4 h-4" /> },
  { label: 'Khách sạn', value: 'Hotel', icon: <Hotel className="w-4 h-4" /> },
  { label: 'Thông tin', value: 'Info', icon: <Info className="w-4 h-4" /> },
  { label: 'Lửa', value: 'Flame', icon: <Sparkles className="w-4 h-4" /> },
];

const COLOR_OPTIONS = [
  { label: 'Cyan', value: 'text-cyan', bg: 'bg-cyan/10' },
  { label: 'Magenta', value: 'text-magenta', bg: 'bg-magenta/10' },
  { label: 'Vàng', value: 'text-gold', bg: 'bg-gold/10' },
  { label: 'Xanh lá', value: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Cam', value: 'text-orange-400', bg: 'bg-orange-400/10' },
];

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Car': return <Car className={className} />;
    case 'Plane': return <Plane className={className} />;
    case 'Hotel': return <Hotel className={className} />;
    case 'Info': return <Info className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function TravelManagement() {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/settings/landing-page')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        setItems(data.travelItems || []);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings/landing-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          travelItems: items
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu.' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems([...items, { title: 'Mục mới', desc: 'Mô tả ngắn gọn...', icon: 'Car', color: 'text-cyan', bg: 'bg-cyan/10' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-update bg if color changes
    if (field === 'color') {
      const option = COLOR_OPTIONS.find(o => o.value === value);
      if (option) newItems[index].bg = option.bg;
    }
    
    setItems(newItems);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse uppercase tracking-widest font-display">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0D0716]/50 p-8 rounded-[2.5rem] border border-[#4F1F76]/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 blur-[100px] -z-10" />
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-white tracking-widest italic text-glow-cyan flex items-center gap-4">
            <Car className="text-cyan w-8 h-8" />
            Di Chuyển & Lưu Trú
          </h2>
          <p className="text-[#8A8F98] text-sm mt-2 font-medium tracking-wide">Quản lý cách thức di chuyển và thông tin lưu trú cho khách hàng</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-5 bg-gradient-to-r from-cyan to-royal text-midnight font-black rounded-2xl flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all glow-cyan shadow-lg uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-midnight border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
        </button>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl flex items-center gap-4 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <span className="font-bold tracking-wide">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Basic Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] bg-[#0D0716]/80 border border-[#4F1F76]/30 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-6 border-b border-[#4F1F76]/30">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Thông tin chung</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Tiêu đề chính</label>
                <input
                  type="text"
                  value={settings?.travelTitle || ''}
                  onChange={e => setSettings({ ...settings, travelTitle: e.target.value })}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan transition-all font-bold tracking-wide shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Tiêu đề phụ</label>
                <input
                  type="text"
                  value={settings?.travelSubtitle || ''}
                  onChange={e => setSettings({ ...settings, travelSubtitle: e.target.value })}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan transition-all font-bold tracking-wide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Mô tả ngắn</label>
                <textarea
                  value={settings?.travelDescription || ''}
                  onChange={e => setSettings({ ...settings, travelDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-black text-cyan uppercase tracking-widest block pl-1 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Lời khuyên (Advice)
                </label>
                <textarea
                  value={settings?.travelAdvice || ''}
                  onChange={e => setSettings({ ...settings, travelAdvice: e.target.value })}
                  rows={4}
                  className="w-full bg-[#060010] border border-cyan/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> URL Hình ảnh
                </label>
                <input
                  type="text"
                  value={settings?.travelImage || ''}
                  onChange={e => setSettings({ ...settings, travelImage: e.target.value })}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-xs text-cyan focus:outline-none focus:border-cyan transition-all"
                />
                {settings?.travelImage && (
                  <div className="mt-4 rounded-3xl overflow-hidden border border-[#4F1F76]/30 aspect-video">
                    <img src={settings.travelImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories / Items Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] bg-[#0D0716]/80 border border-[#4F1F76]/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-[#4F1F76]/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-magenta/10 border border-magenta/30 text-magenta">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Các phương thức & Lưu trú</h3>
              </div>
              <button 
                onClick={addItem}
                className="px-6 py-3 bg-magenta/10 text-magenta border border-magenta/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-magenta hover:text-white transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm mục
              </button>
            </div>

            <div className="mt-8">
              <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-6">
                {items.map((item, index) => (
                  <Reorder.Item 
                    key={index} 
                    value={item}
                    className="p-8 rounded-[2rem] bg-[#060010]/50 border border-[#4F1F76]/30 hover:border-cyan/30 transition-all group relative"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="cursor-grab active:cursor-grabbing text-[#8A8F98] hover:text-cyan transition-colors p-2">
                          <GripVertical className="w-6 h-6" />
                        </div>
                        <div className={`w-20 h-20 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} border border-current/20 shadow-lg`}>
                          <IconRenderer name={item.icon} className="w-10 h-10" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block">Tiêu đề mục</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={e => updateItem(index, 'title', e.target.value)}
                              className="w-full bg-[#0D0716] border border-[#4F1F76]/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-cyan"
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block">Icon</label>
                              <div className="relative">
                                <select 
                                  value={item.icon}
                                  onChange={e => updateItem(index, 'icon', e.target.value)}
                                  className="w-full bg-[#0D0716] border border-[#4F1F76]/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-cyan appearance-none"
                                >
                                  {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-[#8A8F98] pointer-events-none" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block">Màu sắc</label>
                              <div className="relative">
                                <select 
                                  value={item.color}
                                  onChange={e => updateItem(index, 'color', e.target.value)}
                                  className="w-full bg-[#0D0716] border border-[#4F1F76]/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-cyan appearance-none"
                                >
                                  {COLOR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-[#8A8F98] pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block">Mô tả nội dung</label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={e => updateItem(index, 'desc', e.target.value)}
                            className="w-full bg-[#0D0716] border border-[#4F1F76]/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-cyan"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(index)}
                        className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all self-start md:self-center"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {items.length === 0 && (
                <div className="text-center py-20 bg-[#060010]/30 rounded-[2rem] border-2 border-dashed border-[#4F1F76]/20 text-[#8A8F98] italic font-medium">
                  Chưa có mục nào. Nhấn "Thêm mục" để bắt đầu.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Save, Type, AlignLeft, Globe, 
  CheckCircle2, AlertCircle, Info, Sparkles
} from 'lucide-react';

export default function LocationManagement() {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/settings/landing-page')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
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
        body: JSON.stringify(settings),
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

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse uppercase tracking-widest font-display">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0D0716]/50 p-8 rounded-[2.5rem] border border-[#4F1F76]/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-magenta/5 blur-[100px] -z-10" />
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-white tracking-widest italic text-glow-magenta flex items-center gap-4">
            <MapPin className="text-magenta w-8 h-8" />
            Địa Điểm Tổ Chức
          </h2>
          <p className="text-[#8A8F98] text-sm mt-2 font-medium tracking-wide">Quản lý nội dung địa điểm và bản đồ Google Maps</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-5 bg-gradient-to-r from-magenta to-cyan text-white font-black rounded-2xl flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all glow-magenta shadow-lg uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Basic Info */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] bg-[#0D0716]/80 border border-[#4F1F76]/30 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-6 border-b border-[#4F1F76]/30">
              <div className="p-2.5 rounded-xl bg-magenta/10 border border-magenta/30 text-magenta">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Nội dung văn bản</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Tiêu đề chính</label>
                <input
                  type="text"
                  value={settings?.mapTitle || ''}
                  onChange={e => setSettings({ ...settings, mapTitle: e.target.value })}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-magenta transition-all font-bold tracking-wide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Tên địa điểm (Tiêu đề phụ)</label>
                <input
                  type="text"
                  value={settings?.mapSubtitle || ''}
                  onChange={e => setSettings({ ...settings, mapSubtitle: e.target.value })}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-magenta transition-all font-bold tracking-wide"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Địa chỉ chi tiết
                </label>
                <textarea
                  value={settings?.mapAddress || ''}
                  onChange={e => setSettings({ ...settings, mapAddress: e.target.value })}
                  rows={3}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-magenta transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Mô tả không gian
                </label>
                <textarea
                  value={settings?.mapDescription || ''}
                  onChange={e => setSettings({ ...settings, mapDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-magenta transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Integration */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] bg-[#0D0716]/80 border border-[#4F1F76]/30 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-6 border-b border-[#4F1F76]/30">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Tích hợp Google Maps</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan uppercase tracking-widest block pl-1 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Link mã nhúng (Embed URL)
                </label>
                <div className="p-4 bg-cyan/5 border border-cyan/20 rounded-xl mb-4">
                  <p className="text-[10px] text-cyan leading-relaxed font-medium">
                    Hướng dẫn: Vào Google Maps {'>'} Chia sẻ {'>'} Nhúng bản đồ {'>'} Copy URL trong thẻ src.
                  </p>
                </div>
                <textarea
                  value={settings?.mapGoogleUrl || ''}
                  onChange={e => setSettings({ ...settings, mapGoogleUrl: e.target.value })}
                  rows={4}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full bg-[#060010] border border-cyan/30 rounded-2xl px-6 py-4 text-xs text-cyan focus:outline-none focus:border-cyan transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8A8F98] uppercase tracking-widest block pl-1">Xem trước bản đồ</label>
                <div className="rounded-3xl overflow-hidden border border-[#4F1F76]/30 aspect-video relative bg-[#060010]">
                  {settings?.mapGoogleUrl ? (
                    <iframe
                      src={settings.mapGoogleUrl}
                      className="w-full h-full border-none opacity-80"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#4F1F76]">
                      <MapPin className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

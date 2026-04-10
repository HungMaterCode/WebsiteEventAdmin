'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Save, Layout, Type, AlignLeft, 
  ExternalLink, Play, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function VideoManagement() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [form, setForm] = React.useState({
    videoUrl: '',
    videoTitle: '',
    videoSubtitle: ''
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/landing-page');
        if (res.ok) {
          const data = await res.json();
          setForm({
            videoUrl: data.videoUrl || '',
            videoTitle: data.videoTitle || 'THE CINEMATIC TEASER',
            videoSubtitle: data.videoSubtitle || 'CHẠM ĐỂ TRẢI NGHIỆM KHÔNG GIAN 3D MAPPING'
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
        setMessage({ type: 'success', text: 'Cấu hình video đã được cập nhật thành công!' });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu cấu hình.' });
    } finally {
      setSaving(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch {
      return '';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-cyan animate-pulse font-display text-sm tracking-widest uppercase">Đang tải cấu hình video...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tight italic">Quản Lý Video</h2>
          <p className="text-admin-text-muted text-sm mt-1">Cấu hình video teaser và nội dung hiển thị trên trang chủ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Settings */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-admin-panel border border-admin-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/30">
                  <Layout className="w-5 h-5 text-cyan" />
                </div>
                <h3 className="text-lg font-display font-bold text-admin-text uppercase tracking-wider">Thông tin hiển thị</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Tiêu đề Video</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={form.videoTitle} 
                      onChange={e => setForm({ ...form, videoTitle: e.target.value })}
                      placeholder="VD: THE CINEMATIC TEASER" 
                      className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all font-medium" 
                    />
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Mô tả phụ</label>
                  <div className="relative">
                    <textarea 
                      value={form.videoSubtitle} 
                      onChange={e => setForm({ ...form, videoSubtitle: e.target.value })}
                      placeholder="VD: CHẠM ĐỂ TRẢI NGHIỆM..." 
                      rows={2}
                      className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all resize-none font-medium" 
                    />
                    <AlignLeft className="absolute left-4 top-6 w-4 h-4 text-admin-text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Link Video (Youtube)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={form.videoUrl} 
                      onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..." 
                      className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-magenta transition-all font-medium" 
                    />
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
                  </div>
                  <p className="text-[10px] text-magenta italic mt-1 font-bold">* Hỗ trợ link Youtube rút gọn (youtu.be) hoặc link đầy đủ</p>
                </div>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span className="text-sm font-bold">{message.text}</span>
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-cyan to-magenta text-midnight font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all glow-cyan shadow-[0_0_20px_rgba(0,255,255,0.2)] disabled:opacity-50"
              >
                {saving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                LƯU CẤU HÌNH VIDEO
              </button>
            </div>
          </div>
        </form>

        {/* Video Preview */}
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-admin-panel border border-admin-border shadow-2xl h-full flex flex-col relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
             
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-xl bg-magenta/10 border border-magenta/30">
                <Play className="w-5 h-5 text-magenta" />
              </div>
              <h3 className="text-lg font-display font-bold text-admin-text uppercase tracking-wider">Xem trước hiển thị</h3>
            </div>

            <div className="flex-1 flex flex-col gap-6 relative z-10">
              {/* Fake UI Preview */}
              <div className="relative aspect-video rounded-2xl border border-admin-border bg-black overflow-hidden group shadow-inner">
                {getYoutubeEmbedUrl(form.videoUrl) ? (
                  <iframe 
                    src={getYoutubeEmbedUrl(form.videoUrl)} 
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-admin-text-muted gap-3">
                    <Video className="w-12 h-12 opacity-20" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Chưa có video hợp lệ</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Text Preview Overlay simulation */}
              <div className="p-6 rounded-2xl bg-admin-bg border border-admin-border space-y-3 shadow-2xl">
                <div className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mb-1 opacity-60">Mô phỏng giao diện chính:</div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-display font-black text-admin-text italic tracking-tighter uppercase whitespace-pre-line leading-none">
                    {form.videoTitle || 'THE CINEMATIC TEASER'}
                  </h4>
                  <p className="text-[10px] text-cyan font-bold tracking-[0.2em] uppercase mt-2">
                    {form.videoSubtitle || 'CHẠM ĐỂ TRẢI NGHIỆM...'}
                  </p>
                </div>
              </div>

              <div className="mt-auto p-4 bg-magenta/5 rounded-xl border border-magenta/20">
                 <p className="text-[10px] text-admin-text-muted leading-relaxed">
                   <strong className="text-magenta uppercase tracking-wider">Lưu ý:</strong> Mọi thay đổi sẽ được áp dụng ngay lập tức cho phần <strong>Cinematic Experience</strong> trên trang chủ sau khi bạn nhấn Lưu.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

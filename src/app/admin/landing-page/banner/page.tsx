'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, CheckCircle2, Calendar, Type, MapPin, Clock, X, Star } from 'lucide-react';

export default function BannerManagement() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [settings, setSettings] = React.useState({
    title: '',
    subtitle: '',
    eventDate: '',
    location: '',
    timeRange: '',
  });

  React.useEffect(() => {
    fetch('/api/settings/landing-page')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            title: data.title || '',
            subtitle: data.subtitle || '',
            eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 16) : '',
            location: data.location || '',
            timeRange: data.timeRange || '',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải cấu hình:', err);
        setNotification({ type: 'error', message: 'Không thể tải cấu hình từ máy chủ.' });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const res = await fetch('/api/settings/landing-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Cập nhật Banner thành công!' });
        // Tự động đóng thông báo sau 5 giây
        setTimeout(() => setNotification(null), 5000);
      } else {
        const errorData = await res.json();
        setNotification({ type: 'error', message: errorData.error || 'Có lỗi xảy ra khi cập nhật.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Lỗi kết nối máy chủ.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-cyan font-display tracking-widest uppercase text-sm animate-pulse">Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-admin-text uppercase tracking-tighter">
            Quản lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">Banner</span>
          </h2>
          <p className="text-admin-text-muted mt-2 font-medium">Tùy chỉnh thông điệp chính và đồng hồ đếm ngược trên trang chủ sự kiện.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF0088] to-[#9D00FF] rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(255,0,136,0.3)] hover:shadow-[0_0_30px_rgba(255,0,136,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'ĐANG LƯU HỆ THỐNG...' : 'LƯU THAY ĐỔI'}
          </span>
        </button>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] 
              ${notification.type === 'success' 
                ? 'bg-[#00C099]/10 border-[#00C099]/30 text-[#00C099]' 
                : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="font-bold text-sm tracking-wide">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-auto hover:scale-110 transition-transform">
              <X className="w-5 h-5 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content Settings */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-admin-panel border border-admin-border rounded-[2rem] p-8 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Type className="w-24 h-24 text-gold" />
            </div>
            
            <div className="flex items-center gap-4 text-gold mb-8">
              <div className="p-3 bg-gold/10 rounded-2xl border border-gold/20">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold uppercase tracking-widest text-lg">Nội dung hiển thị</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" /> 
                  Tiêu đề chính (Main Title)
                </label>
                <textarea
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full bg-admin-bg border border-admin-border rounded-[1.5rem] px-6 py-5 text-admin-text text-lg focus:border-cyan focus:ring-4 focus:ring-cyan/5 outline-none transition-all min-h-[160px] leading-relaxed resize-none font-medium"
                  placeholder="Nhập tiêu đề chính hiển thị trên banner..."
                />
                <p className="text-[10px] text-admin-text-muted italic">* Gợi ý: Nên ngắn gọn, súc tích và mang tính biểu tượng.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-magenta" />
                  Tiêu đề phụ / Badge (Sub-title)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.subtitle}
                    onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-2xl pl-14 pr-6 py-4 text-admin-text focus:border-magenta focus:ring-4 focus:ring-magenta/5 outline-none transition-all font-bold tracking-wide"
                    placeholder="VD: NEON HERITAGE FESTIVAL"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-magenta">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-admin-bg/50 border border-admin-border rounded-[2rem] p-8 flex items-start gap-6 border-l-4 border-l-gold">
            <div className="p-3 bg-gold/10 rounded-2xl shrink-0">
              <AlertCircle className="w-6 h-6 text-gold" />
            </div>
            <div className="space-y-2">
              <p className="text-admin-text font-black uppercase tracking-widest text-sm">Hướng dẫn cấu hình</p>
              <p className="text-admin-text-muted text-sm leading-relaxed">
                Nội dung tiêu đề chính nên được trình bày rõ ràng. Hệ thống tự động tối ưu hiển thị trên cả thiết bị di động và máy tính. Tránh sử dụng quá nhiều ký tự đặc biệt để đảm bảo tính thẩm mỹ của thiết kế Cyberpunk.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Time & Location Settings */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-admin-panel border border-admin-border rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center gap-4 text-cyan mb-8">
              <div className="p-3 bg-cyan/10 rounded-2xl border border-cyan/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold uppercase tracking-widest text-lg">Thông tin sự kiện</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan glow-cyan" />
                  Thời điểm đếm ngược (Countdown)
                </label>
                <div className="relative group">
                  <input
                    type="datetime-local"
                    value={settings.eventDate}
                    onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-2xl px-6 py-4 text-admin-text focus:border-cyan outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em]">Khung giờ diễn ra</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.timeRange}
                    onChange={(e) => setSettings({ ...settings, timeRange: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-2xl pl-14 pr-6 py-4 text-admin-text focus:border-cyan outline-none transition-all font-medium"
                    placeholder="VD: 20:00 - 00:30"
                  />
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em]">Địa điểm tổ chức</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    className="w-full bg-admin-bg border border-admin-border rounded-2xl pl-14 pr-6 py-4 text-admin-text focus:border-cyan outline-none transition-all font-medium"
                    placeholder="VD: Thung Nham, Ninh Bình"
                  />
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Preview Card */}
          <div className="bg-admin-panel border border-admin-border rounded-[2rem] p-8 space-y-4">
            <h4 className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em]">Xem trước trạng thái</h4>
            <div className="p-4 bg-admin-bg/50 rounded-2xl border border-admin-border space-y-3">
              <div className="text-xs text-cyan font-bold tracking-widest">{settings.subtitle || 'NO SUBTITLE'}</div>
              <div className="text-sm font-bold text-admin-text line-clamp-2">{settings.title || 'NO TITLE'}</div>
              <div className="flex items-center gap-4 text-[10px] text-admin-text-muted">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {settings.timeRange || '--:--'}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {settings.location || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

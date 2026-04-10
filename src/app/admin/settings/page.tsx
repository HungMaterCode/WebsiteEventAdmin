'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Lock, Smartphone, Database, Save, Loader2 
} from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from './actions';

import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import AppearanceSettings from '@/components/admin/settings/AppearanceSettings';
import SystemSettings from '@/components/admin/settings/SystemSettings';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'general', icon: Globe, label: 'Cấu hình chung', desc: 'Tên trang web, mô tả và ngôn ngữ hệ thống' },
    { id: 'security', icon: Lock, label: 'Bảo mật & Tài khoản', desc: 'Mật khẩu admin, xác thực 2 lớp và phiên đăng nhập' },
    { id: 'app', icon: Smartphone, label: 'Giao diện & Trải nghiệm', desc: 'Chủ đề và giao diện hệ thống' },
    { id: 'system', icon: Database, label: 'Hệ thống & Dữ liệu', desc: 'Sao lưu DB, nhật ký hoạt động và dọn dẹp cache' },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const settings = await getSystemSettings();
      setData(settings || {});
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSystemSettings(data);
    setSaving(false);
    if (res.success) {
      alert("Đã lưu cấu hình hệ thống thành công!");
    } else {
      alert("Lỗi khi lưu: " + res.error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings data={data} onChange={setData} />;
      case 'security':
        return <SecuritySettings data={data} onChange={setData} />;
      case 'app':
        return <AppearanceSettings data={data} onChange={setData} />;
      case 'system':
        return <SystemSettings data={data} onChange={setData} />;
      default:
        return null;
    }
  };

  const activeSection = sections.find(s => s.id === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
          <div className="text-admin-text-muted text-sm uppercase tracking-widest font-bold">Đang tải cấu hình...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Cài Đặt Hệ Thống</h2>
          <p className="text-admin-text-muted text-sm mt-1">Tùy chỉnh thông số vận hành lễ hội, giao diện và bảo mật tài khoản</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform shadow-lg ${
            saving 
            ? 'bg-admin-bg/50 text-admin-text-muted cursor-not-allowed border border-admin-border' 
            : 'bg-gradient-to-r from-cyan to-teal text-[#060010] hover:scale-[1.02] glow-cyan shadow-cyan/20'
          }`}
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Đang lưu...' : 'Lưu Tất Cả'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((s) => {
            const isActive = activeTab === s.id;
            return (
              <button 
                key={s.id} 
                onClick={() => setActiveTab(s.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${
                  isActive 
                  ? 'bg-admin-accent/10 border-admin-accent/40 text-admin-accent' 
                  : 'bg-admin-bg/5 border-admin-border text-admin-text-muted hover:bg-admin-bg/10 hover:text-admin-text'
                }`}
              >
                <div className={`p-2 rounded-xl transition-transform ${
                  isActive ? 'bg-admin-accent/20 scale-110' : 'bg-admin-bg/5 border border-admin-border group-hover:scale-110'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest">{s.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5 line-clamp-1">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6 md:p-10 rounded-[2.5rem] bg-admin-panel/80 border border-admin-border overflow-hidden relative min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--tw-gradient-stops)] from-[#00FFFF]/5 to-[#4F1F76]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            
            <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-[0.2em] mb-8 border-b border-admin-border pb-4">
              {activeSection?.label}
            </h3>
            
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActiveTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

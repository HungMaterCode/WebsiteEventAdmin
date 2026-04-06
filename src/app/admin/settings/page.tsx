'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Globe, Shield, Bell, Database, 
  Palette, Smartphone, Save, RefreshCw, Lock, Trash2
} from 'lucide-react';

export default function AdminSettingsPage() {
  const sections = [
    { id: 'general', icon: Globe, label: 'Cấu hình chung', desc: 'Tên trang web, mô tả và ngôn ngữ hệ thống' },
    { id: 'security', icon: Lock, label: 'Bảo mật & Tài khoản', desc: 'Mật khẩu admin, xác thực 2 lớp và phiên đăng nhập' },
    { id: 'app', icon: Smartphone, label: 'Giao diện & Trải nghiệm', desc: 'Chủ đề (Dark/Light), màu sắc chủ đạo và logo' },
    { id: 'notif', icon: Bell, label: 'Thông báo & Email', desc: 'Cấu hình gửi email tự động, thông báo đẩy' },
    { id: 'system', icon: Database, label: 'Hệ thống & Dữ liệu', desc: 'Sao lưu DB, nhật ký hoạt động và dọn dẹp cache' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Cài Đặt Hệ Thống</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Tùy chỉnh thông số vận hành lễ hội, giao diện và bảo mật tài khoản</p>
        </div>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#00C099] text-[#060010] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-cyan shadow-lg shadow-cyan/20">
          <Save className="w-5 h-5" /> Lưu Tất Cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((s, i) => (
            <button key={s.id} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${i === 0 ? 'bg-[#00FFFF]/10 border-[#00FFFF]/40 text-[#00FFFF]' : 'bg-white/5 border-white/5 text-[#8A8F98] hover:bg-white/10 hover:border-white/10 hover:text-white'}`}>
              <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${i === 0 ? 'bg-[#00FFFF]/20' : 'bg-white/5 border border-white/10'}`}><s.icon className="w-5 h-5" /></div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">{s.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5 line-clamp-1">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6 md:p-10 rounded-[2.5rem] bg-[#0D0716]/80 border border-[#4F1F76]/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFFF]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <h3 className="text-lg font-display font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-[#4F1F76]/30 pb-4">Cấu Hình Website Chung</h3>
            
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tên Sự Kiện / Website *</label>
                  <input type="text" defaultValue="Neon Heritage Festival" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Slogan / Headline</label>
                  <input type="text" defaultValue="Dòng Chảy Di Sản" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Mô Tả Website (SEO Meta)</label>
                <textarea rows={3} defaultValue="Đêm nhạc bế mạc Festival Ninh Bình 2024 tại Thung Nham. Dàn line-up đỉnh cao, 3D Mapping, pháo hoa countdown." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">URL Website Chính</label>
                  <input type="text" defaultValue="https://neonheritage.vn" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Email Quản Trị</label>
                  <input type="email" defaultValue="admin@neon.vn" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20"><Trash2 className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Xóa Dữ Liệu Tạm</div>
                    <div className="text-[10px] text-[#8A8F98] mt-1">Xóa sạch cache hình ảnh và dữ liệu CMS tạm thời</div>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Thực hiện xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

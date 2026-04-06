'use client';
import React from 'react';
import { Globe, Camera, Tv } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="bg-[#0D0716] pt-16 pb-8 border-t border-royal/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-display font-black uppercase tracking-widest mb-4"><span className="text-gradient">Neon Heritage</span></h3>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">Sự kiện âm nhạc bế mạc Festival Ninh Bình 2024. Nơi giao thoa giữa di sản văn hóa truyền thống và nghệ thuật đương đại.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-royal/20 flex items-center justify-center text-cyan hover:bg-cyan hover:text-midnight transition-colors border border-cyan/30"><Globe className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-royal/20 flex items-center justify-center text-magenta hover:bg-magenta hover:text-white transition-colors border border-magenta/30"><Camera className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-royal/20 flex items-center justify-center text-gold hover:bg-gold hover:text-midnight transition-colors border border-gold/30"><Tv className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-silver font-bold uppercase tracking-wider mb-4">Sitemap</h4>
            <ul className="space-y-3">
              <li><a href="#lineup" className="text-gray-400 hover:text-cyan transition-colors">Dàn Nghệ Sĩ</a></li>
              <li><a href="#timeline" className="text-gray-400 hover:text-cyan transition-colors">Lộ Trình</a></li>
              <li><a href="#merch" className="text-gray-400 hover:text-cyan transition-colors">Quà Tặng</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-cyan transition-colors">Câu Hỏi</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-cyan transition-colors">Liên Hệ</a></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-cyan transition-colors">Tin Tức</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-silver font-bold uppercase tracking-wider mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Hotline: 1900 xxxx</li>
              <li>Email: info@newdaymedia.vn</li>
              <li className="pt-4">
                <div className="text-silver/50 text-xs tracking-widest uppercase mb-1">Tổ chức bởi</div>
                <div className="text-gold font-bold tracking-wider">NEWDAY MEDIA</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-royal/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; 2024 Neon Heritage Festival. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 items-center justify-center md:justify-end">
            <a href="#" className="hover:text-silver transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-silver transition-colors">Bảo mật</a>
            <Link href="/admin" className="px-6 py-2 bg-[#E6C753]/10 border border-[#E6C753]/50 text-[#E6C753] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#E6C753] hover:text-midnight transition-all shadow-[0_0_15px_rgba(230,199,83,0.2)]">Trang Quản Trị</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

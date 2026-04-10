'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileDown, ShieldCheck, Database, 
  BarChart3, Layers, Loader2, CheckCircle2,
  AlertCircle, Download
} from 'lucide-react';
import { saveAs } from 'file-saver';

export default function ExportCenterPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setIsDone(false);

    try {
      const response = await fetch('/api/admin/analytics/export');
      
      if (!response.ok) {
        throw new Error('Không thể tạo file báo cáo. Vui lòng thử lại sau.');
      }

      const blob = await response.blob();
      const fileName = `Bao-cao-su-kien-Neon-Heritage-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
      
      saveAs(blob, fileName);
      setIsDone(true);
      
      // Reset status after 5s
      setTimeout(() => setIsDone(false), 5000);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Lỗi kết nối server.');
    } finally {
      setIsExporting(false);
    }
  };

  const modules = [
    { name: 'Vé & Doanh thu', icon: Database, color: '#00FFFF' },
    { name: 'Báo cáo Ngày/Giờ', icon: BarChart3, color: '#FF0088' },
    { name: 'Check-in/Out', icon: ShieldCheck, color: '#00FF66' },
    { name: 'Đánh giá khách hàng', icon: Layers, color: '#FFAA00' },
    { name: 'Vé & Doanh thu', icon: Database, color: 'var(--cyan)' },
    { name: 'Báo cáo Ngày/Giờ', icon: BarChart3, color: 'var(--magenta)' },
    { name: 'Check-in/Out', icon: ShieldCheck, color: 'var(--green)' },
    { name: 'Đánh giá khách hàng', icon: Layers, color: 'var(--orange)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-admin-text">
          Trung tâm <span className="text-gradient">Xuất báo cáo</span>
        </h2>
        <p className="text-admin-text-muted font-mono text-sm uppercase tracking-[0.4em]">Integrated Data Export Protocol // v2.0</p>
      </div>

      {/* Main Export Card */}
      <div className="glass-card p-12 rounded-[3.5rem] bg-admin-panel/60 border border-admin-border/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magenta to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-admin-text flex items-center gap-3">
              <FileDown className="text-cyan animate-bounce" />
              Báo cáo Tổng hợp (Excel)
            </h3>
            
            <p className="text-admin-text-muted leading-relaxed text-sm">
              Hệ thống sẽ tổng hợp toàn bộ dữ liệu từ trước đến nay vào một file Excel duy nhất với 5 Tab trình bày chuyên nghiệp. 
              Dữ liệu bao gồm các chỉ số tài chính, nhật ký vận hành và phản hồi chi tiết từ khách hàng.
            </p>

            <ul className="space-y-3">
              {modules.map((m, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-admin-text-muted">
                  <m.icon size={14} style={{ color: m.color }} />
                  {m.name}
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                  isExporting ? 'bg-admin-bg/5 text-admin-text-muted/20' : 'bg-gradient-primary text-white hover:glow-magenta'
                }`}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Đang trích xuất dữ liệu...</span>
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle2 size={20} className="text-cyan" />
                    <span className="text-cyan">Tải xuống thành công!</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Xác nhận xuất báo cáo</span>
                  </>
                )}
                
                {/* Visual scanline effect in button */}
                {!isExporting && <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wide animate-pulse">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Visual Side */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6 relative">
             <div className="relative">
                <div className="absolute inset-0 bg-magenta/20 blur-[100px] animate-pulse" />
                <div className="w-56 h-72 border-2 border-admin-border/10 rounded-[2.5rem] bg-admin-bg/40 relative z-10 flex flex-col items-center justify-center p-8 text-center group hover:border-cyan/50 transition-colors">
                   <div className="w-20 h-20 rounded-2xl bg-admin-bg/5 border border-admin-border/10 flex items-center justify-center mb-6 text-cyan group-hover:bg-cyan/20 transition-all">
                      <FileDown size={40} />
                   </div>
                   <div className="text-[10px] font-mono text-admin-text-muted/30 font-bold uppercase tracking-tighter mb-2">OUTPUT FORMAT</div>
                   <div className="text-3xl font-black text-admin-text italic">.XLSX</div>
                   <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={isExporting ? { width: '100%' } : { width: 0 }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-cyan shadow-[0_0_10px_#00ffff]"
                      />
                   </div>
                </div>
             </div>
             <p className="text-[10px] font-mono text-admin-text-muted/20 uppercase tracking-[0.5em]">Heritage Data Node // Secure Channel</p>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         <div className="p-8 rounded-[2.5rem] bg-admin-bg/5 border border-admin-border/5 flex gap-5 items-start">
            <ShieldCheck className="text-cyan shrink-0 mt-1" />
            <div>
               <h4 className="text-sm font-bold text-admin-text uppercase mb-2">Bảo mật dữ liệu</h4>
               <p className="text-xs text-admin-text-muted leading-relaxed font-mono">Báo cáo chứa các thông tin nhạy cảm về doanh thu và thông tin cá nhân khách hàng. Vui lòng chỉ chia sẻ với những người có thẩm quyền.</p>
            </div>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-admin-bg/5 border border-admin-border/5 flex gap-5 items-start">
            <BarChart3 className="text-magenta shrink-0 mt-1" />
            <div>
               <h4 className="text-sm font-bold text-admin-text uppercase mb-2">Định dạng báo cáo</h4>
               <p className="text-xs text-admin-text-muted leading-relaxed font-mono">File Excel đã được định dạng sẵn kiểu Bảng (Table). Bạn có thể dễ dàng sử dụng bộ lọc (Filter) trong Excel để truy vấn dữ liệu nhanh.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

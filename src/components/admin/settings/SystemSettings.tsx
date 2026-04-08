import React, { useState } from 'react';
import { Trash2, Database, Download, Loader2 } from 'lucide-react';
import { clearSystemCache } from '@/app/admin/settings/actions';

export default function SystemSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const [clearing, setClearing] = useState(false);

  const handleClearCache = async (e: React.MouseEvent) => {
    e.preventDefault();
    setClearing(true);
    const res = await clearSystemCache();
    setClearing(false);
    if (res.success) {
      alert("Đã xóa hoàn toàn bộ nhớ cache của toàn hệ thống!");
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleDownloadBackup = (e: React.MouseEvent) => {
    e.preventDefault();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neon-heritage-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Maintenance Mode */}
      <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#E6C753]/10 rounded-xl border border-[#E6C753]/20">
            <Database className="w-5 h-5 text-[#E6C753]" />
          </div>
          <div>
            <div className="text-xs font-bold text-admin-text uppercase tracking-wider">Chế độ bảo trì</div>
            <div className="text-[10px] text-admin-text-muted mt-1">Tạm dừng hoạt động website đối với khách hàng (Chỉ Admin truy cập được)</div>
          </div>
        </div>
        <select 
          value={data.maintenanceMode ? 'on' : 'off'} 
          onChange={(e) => onChange({...data, maintenanceMode: e.target.value === 'on'})}
          className="bg-admin-bg border border-admin-border rounded-xl px-4 py-2 text-admin-text focus:outline-none focus:border-[#00FFFF]"
        >
          <option value="off">Tắt</option>
          <option value="on">Bật bảo trì</option>
        </select>
      </div>

      {/* Clear Cache */}
      <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-admin-text uppercase tracking-wider">Xóa Dữ Liệu Tạm</div>
            <div className="text-[10px] text-admin-text-muted mt-1">Xóa sạch cache hình ảnh và dữ liệu CMS tạm thời</div>
          </div>
        </div>
        <button 
          onClick={handleClearCache}
          disabled={clearing}
          className="px-4 py-2 rounded-xl flex items-center gap-2 border border-red-500/30 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-admin-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing && <Loader2 className="w-3 h-3 animate-spin" />}
          {clearing ? 'Đang xóa...' : 'Thực hiện xóa'}
        </button>
      </div>

      {/* Export Log/Data */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00FFFF]/10 rounded-xl border border-[#00FFFF]/20">
            <Download className="w-5 h-5 text-[#00FFFF]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Xuất dữ liệu dự phòng</div>
            <div className="text-[10px] text-[#8A8F98] mt-1">Tải xuống báo cáo JSON toàn bộ dữ liệu cấu hình để backup</div>
          </div>
        </div>
        <button 
          onClick={handleDownloadBackup}
          className="px-4 py-2 rounded-xl border border-[#00FFFF]/30 text-[#00FFFF] font-bold text-[10px] uppercase tracking-widest hover:bg-[#00FFFF] hover:text-[#060010] transition-all"
        >
          Tải xuống Backup
        </button>
      </div>

    </div>
  );
}

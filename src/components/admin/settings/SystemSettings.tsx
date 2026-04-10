'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trash2, Database, Download, Loader2, Upload, 
  Activity, ShieldAlert, CheckCircle2, AlertTriangle,
  Users, Ticket, Calendar, BarChart, Clock, MessageSquare
} from 'lucide-react';
import { 
  clearSystemCache, exportFullData, restoreFullData, 
  getSystemStats, getAuditLogs 
} from '@/app/admin/settings/actions';

export default function SystemSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      const [s, l] = await Promise.all([getSystemStats(), getAuditLogs()]);
      setStats(s);
      setLogs(l);
      setIsLoadingData(false);
    }
    loadData();
  }, []);

  const handleClearCache = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ cache hệ thống?")) return;
    setClearing(true);
    const res = await clearSystemCache();
    setClearing(false);
    if (res.success) {
      alert("Đã xóa hoàn toàn bộ nhớ cache của toàn hệ thống!");
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  const handleFullBackup = async (e: React.MouseEvent) => {
    e.preventDefault();
    setExporting(true);
    try {
      const res = await exportFullData();
      setExporting(false);
      
      if (res.success && res.data) {
        const jsonStr = JSON.stringify(res.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neon-heritage-FULL-BACKUP-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Lỗi khi xuất dữ liệu: " + res.error);
      }
    } catch (err) {
      setExporting(false);
      alert("Lỗi hệ thống khi xuất dữ liệu");
    }
  };

  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("CẢNH BÁO: Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại bằng dữ liệu từ file backup. Bạn có chắc chắn muốn tiếp tục?")) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const backup = JSON.parse(event.target?.result as string);
          const res = await restoreFullData(backup);
          if (res.success) {
            alert("Khôi phục dữ liệu thành công! Trang web sẽ được tải lại.");
            window.location.reload();
          } else {
            alert("Lỗi khôi phục: " + res.error);
          }
        } catch (err) {
          alert("File JSON không hợp lệ!");
        } finally {
          setRestoring(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* System Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nghệ sĩ', value: stats?.artists || 0, icon: Users, color: 'text-cyan' },
          { label: 'Đơn hàng', value: stats?.bookings || 0, icon: Ticket, color: 'text-magenta' },
          { label: 'Chiến dịch', value: stats?.campaigns || 0, icon: BarChart, color: 'text-gold' },
          { label: 'Đánh giá', value: stats?.reviews || 0, icon: MessageSquare, color: 'text-cyan' },
        ].map((stat, i) => (
          <div key={i} className="bg-admin-bg/10 border border-admin-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-xl font-black text-admin-text">{stat.value}</div>
            <div className="text-[10px] uppercase font-bold text-admin-text-muted tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Mode Advanced */}
        <div className="space-y-4 p-6 rounded-[2rem] bg-admin-bg/5 border border-admin-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <Database className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-admin-text uppercase tracking-wider">Chế độ bảo trì</div>
              <div className="text-[10px] text-admin-text-muted font-bold uppercase tracking-widest">Trạng thái: {data.maintenanceMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}</div>
            </div>
            <div className="ml-auto">
              <select 
                value={data.maintenanceMode ? 'on' : 'off'} 
                onChange={(e) => onChange({...data, maintenanceMode: e.target.value === 'on'})}
                className="bg-admin-panel border border-admin-border rounded-xl px-4 py-2 text-xs font-bold text-admin-text focus:outline-none focus:border-yellow-500/50"
              >
                <option value="off">Mở Website</option>
                <option value="on">Đóng Bảo trì</option>
              </select>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-admin-text-muted tracking-widest block mb-1.5 ml-1">Thông báo bảo trì</label>
              <textarea 
                value={data.maintenanceMessage || ''}
                onChange={(e) => onChange({...data, maintenanceMessage: e.target.value})}
                placeholder="vd: Hệ thống đang nâng cấp phiên bản 2.0..."
                className="w-full bg-admin-panel border border-admin-border rounded-xl p-3 text-xs text-admin-text focus:outline-none focus:border-cyan min-h-[80px] resize-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-admin-text-muted tracking-widest block mb-1.5 ml-1">Ngày hoàn thành dự kiến</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
                <input 
                  type="datetime-local"
                  value={data.maintenanceEnd || ''}
                  onChange={(e) => onChange({...data, maintenanceEnd: e.target.value})}
                  className="w-full bg-admin-panel border border-admin-border rounded-xl p-3 pl-10 text-xs text-admin-text focus:outline-none focus:border-cyan"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Tools */}
        <div className="space-y-4 p-6 rounded-[2rem] bg-admin-bg/5 border border-admin-border flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-cyan/10 rounded-xl border border-cyan/20">
              <Activity className="w-5 h-5 text-cyan" />
            </div>
            <div className="text-xs font-bold text-admin-text uppercase tracking-wider">Công cụ dữ liệu</div>
          </div>

          <div className="grid grid-cols-1 gap-3 flex-1">
            <button 
              onClick={handleFullBackup}
              disabled={exporting}
              className="w-full p-4 rounded-xl border border-admin-border bg-admin-panel/50 flex items-center justify-between hover:border-cyan/50 hover:bg-cyan/5 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-cyan group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-admin-text uppercase tracking-widest">Sao lưu toàn bộ</div>
                  <div className="text-[9px] text-admin-text-muted mt-0.5">Xuất file JSON chứa tất cả Artists, Campaigns, FAQ...</div>
                </div>
              </div>
              {exporting && <Loader2 className="w-4 h-4 animate-spin text-cyan" />}
            </button>

            <label className="w-full p-4 rounded-xl border border-admin-border bg-admin-panel/50 flex items-center justify-between hover:border-magenta/50 hover:bg-magenta/5 transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-magenta group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-admin-text uppercase tracking-widest">Khôi phục dữ liệu</div>
                  <div className="text-[9px] text-admin-text-muted mt-0.5">Nạp lại dữ liệu từ file backup (Ghi đè dữ liệu cũ)</div>
                </div>
              </div>
              {restoring && <Loader2 className="w-4 h-4 animate-spin text-magenta" />}
              <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" disabled={restoring} />
            </label>

            <button 
              onClick={handleClearCache}
              disabled={clearing}
              className="w-full p-4 rounded-xl border border-admin-border bg-admin-panel/50 flex items-center justify-between hover:border-red-500/50 hover:bg-red-500/5 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-admin-text uppercase tracking-widest">Làm sạch Cache</div>
                  <div className="text-[9px] text-admin-text-muted mt-0.5">Dọn dẹp bộ nhớ đệm hình ảnh và CMS tạm thời</div>
                </div>
              </div>
              {clearing && <Loader2 className="w-4 h-4 animate-spin text-red-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="p-6 rounded-[2rem] bg-admin-bg/5 border border-admin-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl border border-gold/20">
              <Activity className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-xs font-bold text-admin-text uppercase tracking-wider">Nhật ký hoạt động</div>
              <div className="text-[9px] text-admin-text-muted font-bold uppercase tracking-widest">20 hoạt động gần nhất</div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-admin-bg rounded-lg text-admin-text-muted transition-colors">
            <Loader2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-admin-text-muted text-[10px] uppercase font-bold tracking-widest">Chưa có hoạt động nào được ghi lại</div>
          ) : logs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-admin-panel/40 border border-admin-border/50 hover:border-admin-border transition-all">
              <div className={`p-1.5 rounded-lg ${log.action.includes('Lỗi') ? 'bg-red-500/10 text-red-500' : 'bg-cyan/10 text-cyan'}`}>
                {log.action.includes('Lỗi') ? <AlertTriangle className="w-3.3 h-3.3" /> : <CheckCircle2 className="w-3.3 h-3.3" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-admin-text tracking-wide">{log.action}</span>
                  <span className="text-[8px] text-admin-text-muted font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-admin-text-muted">{log.userEmail}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-admin-bg rounded-full text-gold font-bold uppercase tracking-widest">{log.module}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

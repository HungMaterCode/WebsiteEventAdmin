import React from 'react';

export default function SecuritySettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Yêu cầu xác thực 2 lớp (2FA)</label>
          <select 
            value={data.require2FA ? 'yes' : 'no'} 
            onChange={(e) => onChange({...data, require2FA: e.target.value === 'yes'})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]"
          >
            <option value="no">Không bắt buộc</option>
            <option value="yes">Bắt buộc cho quản trị viên</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Thời gian tự động đăng xuất</label>
          <select 
            value={data.sessionTimeout || '24h'} 
            onChange={(e) => onChange({...data, sessionTimeout: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]"
          >
            <option value="1h">1 Giờ</option>
            <option value="12h">12 Giờ</option>
            <option value="24h">24 Giờ</option>
            <option value="7d">7 Ngày</option>
          </select>
        </div>
      </div>
    </div>
  );
}

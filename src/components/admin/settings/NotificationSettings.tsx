import React from 'react';

export default function NotificationSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Máy chủ SMTP (Email Server)</label>
          <input 
            type="text" 
            placeholder="smtp.gmail.com"
            value={data.smtpServer || ''} 
            onChange={(e) => onChange({...data, smtpServer: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Cổng SMTP (Port)</label>
          <input 
            type="text" 
            placeholder="587"
            value={data.smtpPort || ''} 
            onChange={(e) => onChange({...data, smtpPort: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Email gửi đi mặc định</label>
          <input 
            type="email" 
            placeholder="noreply@domain.com"
            value={data.senderEmail || ''} 
            onChange={(e) => onChange({...data, senderEmail: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Gửi email khi có đăng ký mới</label>
          <select 
            value={data.notifyOnRegister ? 'yes' : 'no'} 
            onChange={(e) => onChange({...data, notifyOnRegister: e.target.value === 'yes'})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all"
          >
            <option value="yes">Bật thông báo</option>
            <option value="no">Tắt thông báo</option>
          </select>
        </div>
      </div>
    </div>
  );
}

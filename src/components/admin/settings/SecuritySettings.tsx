import React from 'react';
import { Shield, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function SecuritySettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2FA Setting */}
        <div className="p-6 rounded-3xl bg-admin-bg/5 border border-admin-border hover:border-cyan/30 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${data.require2FA ? 'bg-cyan/10 text-cyan' : 'bg-gray-500/10 text-gray-500'}`}>
              {data.require2FA ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Xác thực 2 lớp (2FA)</label>
              <div className="text-sm font-bold text-admin-text mt-1">
                {data.require2FA ? 'Đang kích hoạt' : 'Chưa bắt buộc'}
              </div>
            </div>
          </div>
          
          <select 
            value={data.require2FA ? 'yes' : 'no'} 
            onChange={(e) => onChange({...data, require2FA: e.target.value === 'yes'})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-cyan appearance-none cursor-pointer"
          >
            <option value="no">Không bắt buộc</option>
            <option value="yes">Bắt buộc cho quản trị viên</option>
          </select>
          <p className="mt-4 text-[10px] text-admin-text-muted leading-relaxed">
            Khi bật, tất cả quản trị viên phải nhập mã OTP gửi qua Email để hoàn tất đăng nhập.
          </p>
        </div>

        {/* Session Timeout Setting */}
        <div className="p-6 rounded-3xl bg-admin-bg/5 border border-admin-border hover:border-magenta/30 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-magenta/10 text-magenta">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Thời gian tự động đăng xuất</label>
              <div className="text-sm font-bold text-admin-text mt-1">Treo máy {data.sessionTimeout || '24h'}</div>
            </div>
          </div>
          
          <select 
            value={data.sessionTimeout || '24h'} 
            onChange={(e) => onChange({...data, sessionTimeout: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-admin-text focus:outline-none focus:border-magenta appearance-none cursor-pointer"
          >
            <option value="30s">30 Giây (Dùng để Test)</option>
            <option value="1h">1 Giờ (An toàn nhất)</option>
            <option value="12h">12 Giờ</option>
            <option value="24h">24 Giờ (Mặc định)</option>
            <option value="7d">7 Ngày</option>
          </select>
          <p className="mt-4 text-[10px] text-admin-text-muted leading-relaxed">
            Hệ thống sẽ tự động đăng xuất nếu bạn không hoạt động trong khoảng thời gian này.
          </p>
        </div>
      </div>
    </div>
  );
}

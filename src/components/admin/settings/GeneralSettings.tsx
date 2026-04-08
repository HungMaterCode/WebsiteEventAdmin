import React from 'react';

export default function GeneralSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Sự Kiện / Website *</label>
          <input 
            type="text" 
            value={data.siteName || ''} 
            onChange={(e) => onChange({...data, siteName: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Slogan / Headline</label>
          <input 
            type="text" 
            value={data.slogan || ''} 
            onChange={(e) => onChange({...data, slogan: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" 
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mô Tả Website (SEO Meta)</label>
        <textarea 
          rows={3} 
          value={data.seoDescription || ''} 
          onChange={(e) => onChange({...data, seoDescription: e.target.value})}
          className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF] resize-none" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">URL Website Chính</label>
          <input 
            type="text" 
            value={data.mainUrl || ''} 
            onChange={(e) => onChange({...data, mainUrl: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Email Quản Trị</label>
          <input 
            type="email" 
            value={data.adminEmail || ''} 
            onChange={(e) => onChange({...data, adminEmail: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-[#00FFFF]" 
          />
        </div>
      </div>
    </div>
  );
}

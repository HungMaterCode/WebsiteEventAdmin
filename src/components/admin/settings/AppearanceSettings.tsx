import React from 'react';
import { useTheme } from 'next-themes';

export default function AppearanceSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Chủ đề mặc định</label>
          <select 
            value={theme || 'dark'} 
            onChange={(e) => {
              setTheme(e.target.value);
              onChange({...data, theme: e.target.value});
            }}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all"
          >
            <option value="dark">Dark Mode (Tối)</option>
            <option value="light">Light Mode (Sáng)</option>
            <option value="system">Theo hệ thống (Auto)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

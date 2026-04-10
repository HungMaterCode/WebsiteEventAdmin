import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { CloudUpload, Search, Globe, MoreVertical, X, ImageIcon } from 'lucide-react';

export default function GeneralSettings({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  
  // Helper to apply Cloudinary transformations
  const applyTransform = (url: string, transform: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Inject transform before /v123...
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
  };

  const handleUploadSuccess = (field: string, result: any, transform?: string) => {
    if (result.info && typeof result.info === 'object') {
      let url = result.info.secure_url;
      if (transform) {
        url = applyTransform(url, transform);
      }
      onChange({ ...data, [field]: url });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Sự Kiện / Website *</label>
          <input 
            type="text" 
            value={data.siteName || ''} 
            onChange={(e) => onChange({...data, siteName: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Slogan / Headline</label>
          <input 
            type="text" 
            value={data.slogan || ''} 
            onChange={(e) => onChange({...data, slogan: e.target.value})}
            className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mô Tả Website (SEO Meta)</label>
        <textarea 
          rows={3} 
          value={data.seoDescription || ''} 
          onChange={(e) => onChange({...data, seoDescription: e.target.value})}
          className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all resize-none" 
          placeholder="Nhập mô tả hấp dẫn để hiện lên Google..."
        />
      </div>

      {/* Upload Controls - Compact Version */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favicon Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Favicon (Hình nhỏ - PNG 144x144)</label>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted group-focus-within:text-cyan transition-colors" />
              <input 
                type="text" 
                value={data.faviconUrl || ''} 
                onChange={(e) => onChange({...data, faviconUrl: e.target.value})}
                placeholder="Dán URL hoặc tải lên..."
                className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-xs text-admin-text focus:outline-none focus:border-cyan transition-all" 
              />
            </div>
            <CldUploadWidget 
              uploadPreset="ml_default"
              options={{ 
                maxFiles: 1, 
                maxFileSize: 2000000,
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "ico"],
              }}
              onSuccess={(result) => handleUploadSuccess('faviconUrl', result, 'f_png,w_144,h_144,c_fill,g_auto')}
            >
              {({ open }) => (
                <button 
                  onClick={() => open()}
                  className="px-6 py-3 bg-cyan/10 border border-cyan/30 text-cyan rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-cyan/20 transition-all flex items-center gap-2"
                >
                  <CloudUpload className="w-4 h-4" /> Tải lên
                </button>
              )}
            </CldUploadWidget>
          </div>
          {data.faviconUrl && (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-admin-bg/5 border border-admin-border/50">
              <img src={data.faviconUrl} alt="" className="w-10 h-10 object-contain" />
              <span className="text-[10px] text-admin-text-muted truncate flex-1">{data.faviconUrl}</span>
              <button onClick={() => onChange({...data, faviconUrl: ''})} className="text-red-500 hover:text-red-400 p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* OG Image Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block">Ảnh đại diện SEO (OG Image - 1200x630)</label>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted group-focus-within:text-magenta transition-colors" />
              <input 
                type="text" 
                value={data.ogImageUrl || ''} 
                onChange={(e) => onChange({...data, ogImageUrl: e.target.value})}
                placeholder="Dán URL hoặc tải lên..."
                className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-xs text-admin-text focus:outline-none focus:border-magenta transition-all" 
              />
            </div>
            <CldUploadWidget 
              uploadPreset="ml_default"
              options={{ 
                maxFiles: 1, 
                maxFileSize: 5000000,
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
              }}
              onSuccess={(result) => handleUploadSuccess('ogImageUrl', result, 'f_auto,q_auto,w_1200,h_630,c_fill,g_auto')}
            >
              {({ open }) => (
                <button 
                  onClick={() => open()}
                  className="px-6 py-3 bg-magenta/10 border border-magenta/30 text-magenta rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-magenta/20 transition-all flex items-center gap-2"
                >
                  <CloudUpload className="w-4 h-4" /> Tải lên
                </button>
              )}
            </CldUploadWidget>
          </div>
          {data.ogImageUrl && (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-admin-bg/5 border border-admin-border/50">
              <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={data.ogImageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-admin-text-muted truncate flex-1">{data.ogImageUrl}</span>
              <button onClick={() => onChange({...data, ogImageUrl: ''})} className="text-red-500 hover:text-red-400 p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-admin-border/30">
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">URL Website Chính (Domain)</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input 
              type="text" 
              value={data.mainUrl || ''} 
              onChange={(e) => onChange({...data, mainUrl: e.target.value})}
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
              placeholder="https://neonheritage.vn"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Email Quản Trị</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-admin-text-muted">@</span>
            <input 
              type="email" 
              value={data.adminEmail || ''} 
              onChange={(e) => onChange({...data, adminEmail: e.target.value})}
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-cyan transition-all" 
              placeholder="admin@example.com"
            />
          </div>
        </div>
      </div>

      {/* Google Search Preview Section - Placed at the very bottom */}
      <div className="p-6 rounded-3xl bg-admin-bg/10 border border-admin-border/50">
        <div className="flex items-center gap-2 mb-6 text-admin-text-muted">
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Xem trước kết quả trên Google Search</span>
        </div>
        
        <div className="max-w-[650px] bg-white rounded-xl p-4 md:p-6 shadow-xl border border-gray-200 mx-auto transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-7 h-7 rounded-full bg-[#f1f3f4] flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                {data.faviconUrl ? (
                  <img src={data.faviconUrl} alt="" className="w-4 h-4 object-contain" />
                ) : (
                  <Globe className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col text-[12px] leading-tight">
                <span className="text-[#202124] font-medium">{data.siteName || 'Tên Website'}</span>
                <span className="text-[#4d5156]">{data.mainUrl || 'https://domain.com'}</span>
              </div>
              <MoreVertical className="w-4 h-4 text-[#70757a] ml-auto" />
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="flex-1 text-left">
                <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-tight font-medium">
                  {data.siteName || 'Tên Website'} | {data.slogan || 'Slogan của bạn'}
                </h3>
                <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                  {data.seoDescription || 'Nhập mô tả trang web để xem trước kết quả hiển thị trên bộ máy tìm kiếm Google...'}
                </p>
              </div>
              
              {data.ogImageUrl && (
                <div className="w-[104px] h-[104px] rounded-lg overflow-hidden border border-gray-200 hidden sm:block flex-shrink-0">
                  <img src={data.ogImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

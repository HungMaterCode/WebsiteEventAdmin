'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
  Link as LinkIcon, Image as ImageIcon, 
  Heading2, Heading3, Info, Minus, X, Search, Upload, FileText, ExternalLink,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SEOEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function SEOEditor({ content, onChange, placeholder = 'Viết nội dung bài viết tại đây...' }: SEOEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#00FFFF] hover:text-[#FFFFFF] underline transition-colors cursor-pointer',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-[#4F1F76]/30 w-full my-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-6 pb-24',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  // SEO Stats
  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className="w-full border border-[#4F1F76]/50 rounded-[2rem] bg-[#060010] overflow-hidden flex flex-col group focus-within:border-[#00FFFF] transition-all relative">
      {/* Toolbar */}
      <div className="p-3 border-b border-[#4F1F76]/30 bg-[#0D0716] flex flex-wrap gap-1 items-center sticky top-0 z-20">
        <div className="flex items-center gap-1 mr-2 px-2 border-r border-[#4F1F76]/30">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')} 
            icon={<Bold className="w-4 h-4" />} 
            tooltip="In đậm"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')} 
            icon={<Italic className="w-4 h-4" />} 
            tooltip="In nghiêng"
          />
        </div>

        <div className="flex items-center gap-1 mr-2 px-2 border-r border-[#4F1F76]/30">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })} 
            icon={<Heading2 className="w-4 h-4" />} 
            tooltip="Tiêu đề 2 (SEO H2)"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            isActive={editor.isActive('heading', { level: 3 })} 
            icon={<Heading3 className="w-4 h-4" />} 
            tooltip="Tiêu đề 3 (SEO H3)"
          />
        </div>

        <div className="flex items-center gap-1 mr-2 px-2 border-r border-[#4F1F76]/30">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')} 
            icon={<List className="w-4 h-4" />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            isActive={editor.isActive('orderedList')} 
            icon={<ListOrdered className="w-4 h-4" />} 
          />
        </div>

        <div className="flex items-center gap-1 mr-2 px-2 border-r border-[#4F1F76]/30">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            isActive={editor.isActive('blockquote')} 
            icon={<Quote className="w-4 h-4" />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()} 
            icon={<Minus className="w-4 h-4" />} 
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton 
            onClick={() => setIsLinkModalOpen(true)} 
            isActive={editor.isActive('link')} 
            icon={<LinkIcon className="w-4 h-4" />} 
            tooltip="Chèn liên kết (Cửa sổ thông minh)"
          />
          <ToolbarButton 
            onClick={() => setIsImageModalOpen(true)} 
            icon={<ImageIcon className="w-4 h-4" />} 
            tooltip="Chèn hình ảnh (Từ máy hoặc URL)"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().undo().run()} 
            icon={<Undo className="w-4 h-4" />} 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().redo().run()} 
            icon={<Redo className="w-4 h-4" />} 
          />
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar bg-[#060010] relative min-h-[400px]">
        <EditorContent editor={editor} />
        
        {/* SEO Intelligence Status Bar */}
        <div className="absolute bottom-4 right-6 flex items-center gap-4 py-2 px-4 rounded-full bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className="text-[#8A8F98]">Số từ:</span>
            <span className={wordCount < 300 ? 'text-[#FF0088]' : 'text-[#00C099]'}>{wordCount}</span>
          </div>
          <div className="w-px h-3 bg-[#4F1F76]/50"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#E6C753]">
            <Info className="w-3 h-3" />
            <span>Chuẩn SEO</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isLinkModalOpen && (
          <LinkModal 
            onClose={() => setIsLinkModalOpen(false)} 
            onInsert={(url) => {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              setIsLinkModalOpen(false);
            }} 
            currentUrl={editor.getAttributes('link').href}
          />
        )}
        {isImageModalOpen && (
          <ImageModal 
            onClose={() => setIsImageModalOpen(false)} 
            onInsert={(url, alt) => {
              editor.chain().focus().setImage({ src: url, alt }).run();
              setIsImageModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ToolbarButton({ onClick, isActive, icon, tooltip }: { onClick: () => void; isActive?: boolean; icon: React.ReactNode; tooltip?: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg transition-all duration-300 relative group
        ${isActive 
          ? 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
          : 'text-[#8A8F98] hover:bg-[#4F1F76]/20 hover:text-white border border-transparent'
        }`}
    >
      {icon}
    </button>
  );
}

// LINK MODAL
function LinkModal({ onClose, onInsert, currentUrl }: { onClose: () => void; onInsert: (url: string) => void; currentUrl?: string; }) {
  const [url, setUrl] = useState(currentUrl || '');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(data => {
      setPosts(data || []);
      setLoading(false);
    });
  }, []);

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-3">
             <LinkIcon className="w-5 h-5 text-[#00FFFF]" /> Chèn Liên Kết
          </h3>
          <button onClick={onClose} className="text-[#8A8F98] hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Đường dẫn tự do (URL)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F1F76]" />
                <input 
                  type="text" value={url} onChange={e => setUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
                />
              </div>
              <button 
                onClick={() => onInsert(url)}
                disabled={!url}
                className="px-6 py-3 bg-[#00FFFF] text-[#060010] font-bold rounded-xl hover:bg-[#00FFFF]/80 disabled:opacity-50 transition-all shrink-0"
              >
                Chèn
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-[#4F1F76]/30 my-6"></div>

          <div>
             <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-4 flex items-center justify-between">
                Chọn từ bài viết có sẵn
                <span className="text-[#00FFFF] lowercase">/blog/...</span>
             </label>
             <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
                <input 
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm bài viết liên quan..."
                  className="w-full bg-[#060010]/50 border border-[#4F1F76]/30 rounded-lg pl-10 pr-4 py-2 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]/50 transition-all"
                />
             </div>
             <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                {loading ? <div className="text-center text-xs text-[#8A8F98] py-4">Đang tải danh sách bài viết...</div> : 
                  filteredPosts.length === 0 ? <div className="text-center text-xs text-[#8A8F98] py-4">Không tìm thấy bài viết nào.</div> :
                  filteredPosts.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => onInsert(`/blog/${p.slug}`)}
                      className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#4F1F76]/50 hover:bg-[#4F1F76]/10 transition-all flex items-center gap-3 group"
                    >
                       <FileText className="w-4 h-4 text-[#8A8F98] group-hover:text-[#00FFFF]" />
                       <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-bold text-white truncate">{p.title}</div>
                          <div className="text-[10px] text-[#4F1F76] truncate">{p.slug}</div>
                       </div>
                    </button>
                  ))
                }
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// IMAGE MODAL
function ImageModal({ onClose, onInsert }: { onClose: () => void; onInsert: (url: string, alt: string) => void; }) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#0D0716] border border-[#FF0088]/30 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-8 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10">
          <h3 className="text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-3">
             <ImageIcon className="w-5 h-5 text-[#FF0088]" /> Chèn Hình Ảnh
          </h3>
          <button onClick={onClose} className="text-[#8A8F98] hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          {/* Method 1: Local Upload */}
          <div>
            <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-4">Tải lên từ máy tính của bạn</label>
            <div className="flex flex-col items-center">
               <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#4F1F76]/50 rounded-[2rem] p-8 hover:border-[#FF0088]/50 hover:bg-[#FF0088]/5 transition-all cursor-pointer group relative overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  {preview ? (
                     <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-[#FF0088]/10 flex items-center justify-center text-[#FF0088] mb-4 group-hover:scale-110 transition-transform">
                         <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white mb-1">Click để tải ảnh lên</div>
                      <div className="text-[10px] text-[#8A8F98] uppercase tracking-widest">PNG, JPG, WEBP (Tối đa 5MB)</div>
                    </>
                  )}
                  {preview && (
                     <div className="absolute inset-0 bg-[#060010]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-[#FF0088] font-bold text-xs uppercase tracking-widest">
                           <Plus className="w-4 h-4" /> Thay đổi ảnh
                        </div>
                     </div>
                  )}
               </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-[#4F1F76]/30"></div>
             <span className="text-[10px] font-bold text-[#4F1F76] uppercase">Hoặc dùng URL</span>
             <div className="h-px flex-1 bg-[#4F1F76]/30"></div>
          </div>

          {/* Method 2: URL */}
          <div>
            <input 
              type="text" value={preview?.startsWith('data:') ? '' : url} onChange={e => { setUrl(e.target.value); setPreview(e.target.value); }} 
              placeholder="Dán link ảnh tại đây (https://...)"
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all" 
            />
          </div>

          <div className="w-full h-px bg-[#4F1F76]/30"></div>

          {/* SEO Alt Text */}
          <div>
            <label className="text-[10px] font-bold text-[#FF0088] uppercase tracking-widest block mb-2 flex items-center gap-2">
               <Info className="w-3 h-3" /> Mô tả hình ảnh (SEO ALT TEXT) *
            </label>
            <input 
              required
              type="text" value={alt} onChange={e => setAlt(e.target.value)} 
              placeholder="Mô tả nội dung hình ảnh cho Google..."
              className="w-full bg-[#060010] border border-[#FF0088]/30 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] transition-all" 
            />
            <p className="text-[9px] text-[#8A8F98] mt-2 italic">* Rất quan trọng để tối ưu hóa tìm kiếm hình ảnh.</p>
          </div>
        </div>

        <div className="p-8 border-t border-[#4F1F76]/30 bg-[#0D0716] flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy</button>
          <button 
            disabled={!url || !alt}
            onClick={() => onInsert(url, alt)}
            className="px-8 py-3 rounded-xl bg-[#FF0088] text-[#FFFFFF] font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all glow-magenta disabled:opacity-50 disabled:scale-100"
          >
            Chèn hình ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Search, Filter, 
  CheckCircle2, Clock, Save,
  Tag, X, Newspaper, Eye, AlertTriangle
} from 'lucide-react';
import Toast from '@/components/ui/Toast';
import SEOEditor from '@/components/ui/SEOEditor';

export default function AdminBlogPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  
  // Post Form State
  const [formData, setFormData] = React.useState({
    id: '', title: '', content: '', excerpt: '', coverImage: '',
    tags: '', seoTitle: '', seoDesc: '', seoKeywords: '', published: false
  });

  // Toast State
  const [toast, setToast] = React.useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    isOpen: false,
    postId: '',
    postTitle: ''
  });

  const fetchPosts = React.useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
      showToast('Không thể tải danh sách bài viết', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post: any = null) => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || '',
        tags: post.tags?.join(', ') || '',
        seoTitle: post.seoTitle || '',
        seoDesc: post.seoDesc || '',
        seoKeywords: post.seoKeywords?.join(', ') || '',
        published: post.published
      });
      setEditMode(true);
    } else {
      setFormData({
        id: '', title: '', content: '', excerpt: '', coverImage: '',
        tags: '', seoTitle: '', seoDesc: '', seoKeywords: '', published: false
      });
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      seoKeywords: formData.seoKeywords.split(',').map(t => t.trim()).filter(Boolean),
    };
    
    try {
      const method = editMode ? 'PATCH' : 'POST';
      const url = editMode ? `/api/posts/${formData.id}` : '/api/posts';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        showToast(editMode ? 'Cập nhật bài viết thành công' : 'Đã tạo bài viết mới', 'success');
        fetchPosts();
      } else {
        showToast('Có lỗi xảy ra khi lưu bài viết', 'error');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Lỗi kết nối máy chủ', 'error');
    }
  };

  const requestDelete = (post: any) => {
    setDeleteConfirm({
      isOpen: true,
      postId: post.id,
      postTitle: post.title
    });
  };

  const confirmDelete = async () => {
    const { postId } = deleteConfirm;
    setDeleteConfirm({ ...deleteConfirm, isOpen: false });
    
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Đã xóa bài viết thành công', 'success');
        fetchPosts();
      } else {
        showToast('Không thể xóa bài viết', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Lỗi kết nối khi xóa', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Tin Tức & SEO</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Biên tập bài viết, tối ưu hóa công cụ tìm kiếm chuẩn SEO</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#FF0088] hover:bg-[#FF0088]/80 text-[#FFFFFF] font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta"
        >
          <Plus className="w-5 h-5" /> Thêm Bài Viết Mới
        </button>
      </div>

      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden">
        <div className="p-6 border-b border-[#4F1F76]/30 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#4F1F76]/50 text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Lọc Theo Trạng Thái
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Bài viết</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Trạng thái</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden md:table-cell">Lượt xem</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 hidden sm:table-cell">Ngày tạo</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#8A8F98]">Đang tải dữ liệu...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#8A8F98]">Chưa có bài viết nào.</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-12 h-12 rounded-lg object-cover bg-[#4F1F76]/20 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#4F1F76]/20 flex items-center justify-center shrink-0 text-[#4F1F76]">
                          <Newspaper className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#FFFFFF] line-clamp-1">{post.title}</div>
                        <div className="text-xs text-[#8A8F98] line-clamp-1 mt-1">{post.seoDesc || post.excerpt || 'Không có mô tả SEO'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {post.published ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00C099]/10 text-[#00C099] border border-[#00C099]/30 uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 mr-1" /> Public</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8A8F98]/10 text-[#8A8F98] border border-[#8A8F98]/30 uppercase tracking-widest"><Clock className="w-3 h-3 mr-1" /> Draft</span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell text-[#8A8F98]">
                    <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-[#4F1F76]" /> {Math.floor(Math.random() * 500) + 120}</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-[#8A8F98]">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(post)} className="p-2 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20 hover:bg-[#00FFFF] hover:text-[#060010] transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => requestDelete(post)} className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
                <h3 className="text-xl font-display font-bold text-[#FFFFFF] uppercase">{editMode ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                
                {/* General Info */}
                <div>
                  <h4 className="text-[#E6C753] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><Newspaper className="w-4 h-4" /> Nội Dung Bài Viết</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tiêu đề bài viết *</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Trích dẫn (Excerpt)</label>
                      <textarea rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] resize-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Ảnh Cover (URL)</label>
                      <input type="text" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} placeholder="https://..." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Nội dung chi tiết (Trình soạn thảo chuẩn SEO) *</label>
                      <SEOEditor 
                        content={formData.content} 
                        onChange={(html) => setFormData({ ...formData, content: html })} 
                        placeholder="Hãy kể câu chuyện về sự kiện của bạn tại đây..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#4F1F76]/50 rounded-xl bg-[#060010]">
                        <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 accent-[#00FFFF] rounded bg-[#060010] border-[#4F1F76]" />
                        <span className="text-[#FFFFFF] font-bold">Xuất bản bài viết (Public)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-[#4F1F76]/30"></div>

                {/* SEO Config */}
                <div>
                  <h4 className="text-[#00FFFF] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><Tag className="w-4 h-4" /> Tối Ưu Hóa SEO</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-1">SEO Title</label>
                        <p className="text-[10px] text-[#4F1F76] mb-2">Tiêu đề hiển thị trên Google (Tối đa 60 ký tự)</p>
                        <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-1">SEO Keywords</label>
                        <p className="text-[10px] text-[#4F1F76] mb-2">Cách nhau bởi dấu phẩy (VD: festival ninh binh, am nhac)</p>
                        <input type="text" value={formData.seoKeywords} onChange={e => setFormData({...formData, seoKeywords: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-1">Tags hệ thống</label>
                        <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-1">SEO Description</label>
                      <p className="text-[10px] text-[#4F1F76] mb-2">Mô tả trên kết quả tìm kiếm (150-160 ký tự)</p>
                      <textarea rows={6} value={formData.seoDesc} onChange={e => setFormData({...formData, seoDesc: e.target.value})} className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] resize-none" />
                      
                      <div className="mt-4 p-4 border border-[#4F1F76]/50 rounded-xl bg-[#060010]">
                        <div className="text-xs text-[#8A8F98] mb-2 tracking-widest uppercase">Preview Kết Quả Tìm Kiếm Google</div>
                        <div className="text-xl text-[#00FFFF] font-bold hover:underline cursor-pointer truncate">{formData.seoTitle || formData.title || 'Tiêu đề bài viết'}</div>
                        <div className="text-sm text-[#00C099] font-medium truncate">https://neonheritage.vn/blog/...</div>
                        <div className="text-sm text-[#8A8F98] mt-1 line-clamp-2">{formData.seoDesc || formData.excerpt || 'Vui lòng cung cấp mô tả chi tiết để tăng cường hiệu quả SEO.'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-[#0D0716] pt-4 border-t border-[#4F1F76]/30 flex justify-end gap-4 mt-8 pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy</button>
                  <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-brand text-[#FFFFFF] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
                    <Save className="w-5 h-5" /> Lưu Bài Viết
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-[#0D0716] border border-red-500/30 rounded-[2rem] shadow-2xl p-8 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase mb-4 tracking-wider">Xác Nhận Xóa</h3>
              <p className="text-[#8A8F98] text-sm mb-8 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết <span className="text-white font-bold italic">&quot;{deleteConfirm.postTitle}&quot;</span>? Thao tác này không thể hoàn tác.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                  Xác nhận xóa ngay
                </button>
                <button 
                  onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                  className="w-full py-3 bg-transparent border border-[#4F1F76] text-[#8A8F98] hover:text-white hover:bg-[#4F1F76]/20 font-bold rounded-xl transition-all"
                >
                  Hủy thao tác
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Edit2, Trash2, Search, Filter,
  Package, Star, Tag, X, Save, ImageIcon, CloudUpload
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';
import { CldUploadWidget } from 'next-cloudinary';



const catColors: Record<string, string> = {
  'Thời Trang': 'text-magenta bg-magenta/10 border-magenta/30',
  'Phụ Kiện': 'text-gold bg-gold/10 border-gold/30',
  'Âm Nhạc': 'text-cyan bg-cyan/10 border-cyan/30',
  'Nghệ Thuật': 'text-emerald bg-emerald/10 border-emerald/30',
};

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState({
    name: '',
    category: 'Thời Trang',
    price: '',
    image: '',
    description: ''
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);


  const handleOpen = (product: any = null) => {
    if (product) {
      setEditMode(true);
      setEditingId(product.id);
      setForm({
        name: product.name,
        category: product.category || 'Thời Trang',
        price: product.price.toString(),
        image: product.image || '',
        description: product.description || ''
      });
    } else {
      setEditMode(false);
      setEditingId(null);
      setForm({
        name: '',
        category: 'Thời Trang',
        price: '',
        image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;

    const payload = {
      ...form,
      price: parseInt(form.price),
      stock: 0,
    };

    try {
      const url = editMode ? `/api/products/${editingId}` : '/api/products';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Sản Phẩm</h2>
          <p className="text-admin-text-muted text-sm mt-1">Sản phẩm di sản, merchandise và vật phẩm độc quyền của sự kiện</p>
        </div>
        <button onClick={() => handleOpen()}
          className="px-6 py-3 bg-magenta hover:bg-magenta/80 text-admin-text font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta">
          <Plus className="w-5 h-5" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Tổng Sản Phẩm', value: products.length.toString(), color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20', icon: ShoppingBag },
          { label: 'Hạng vé quà tặng', value: 'VIP', color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20', icon: Star },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all bg-admin-panel/20 ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-admin-border flex flex-col md:flex-row gap-4 justify-between items-center bg-admin-bg/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted" />
            <input type="text" placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-magenta transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-bg/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Danh Mục
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-admin-bg/10 text-admin-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-admin-border min-w-[260px]">Sản Phẩm</th>
                <th className="p-4 font-bold border-b border-admin-border">Danh Mục</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Giá</th>
                <th className="p-4 font-bold border-b border-admin-border text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-12 text-center text-admin-text-muted">Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-admin-text-muted">Chưa có sản phẩm nào.</td></tr>
              ) : products.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-admin-border hover:bg-admin-bg/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-admin-bg/20 border border-admin-border flex items-center justify-center shrink-0 overflow-hidden">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-admin-text-muted" />}
                      </div>
                      <div>
                        <div className="font-bold text-admin-text text-sm group-hover:text-magenta transition-colors line-clamp-1">{p.name}</div>
                        <div className="text-xs text-admin-text-muted font-mono mt-1">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${catColors[p.category] ?? 'text-admin-text-muted bg-admin-text-muted/10 border-admin-text-muted/30'}`}>
                      {p.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-admin-text">{formatCurrency(p.price)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpen(p)} className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-cyan hover:bg-cyan/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-admin-bg/20 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-admin-bg/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-magenta/10 border border-magenta/30">
                    <ShoppingBag className="w-5 h-5 text-magenta" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase">{editMode ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Sản Phẩm *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ví dụ: Áo Thun Neon Heritage..." className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mô Tả Sản Phẩm</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về sản phẩm..." rows={3} className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Danh Mục</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta appearance-none">
                      {['Thời Trang', 'Phụ Kiện', 'Âm Nhạc', 'Nghệ Thuật'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Giá Bán (VNĐ) *</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="350000" className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-admin-text focus:outline-none focus:border-magenta" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Hình Ảnh Sản Phẩm *</label>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1 group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-muted group-focus-within:text-magenta transition-colors" />
                        <input
                          type="text"
                          value={form.image}
                          onChange={e => setForm({ ...form, image: e.target.value })}
                          placeholder="Dán URL ảnh hoặc tải lên..."
                          className="w-full bg-admin-bg border border-admin-border rounded-xl pl-12 pr-4 py-3 text-admin-text focus:outline-none focus:border-magenta transition-all"
                        />
                      </div>

                      <CldUploadWidget
                        uploadPreset="ml_default"
                        onSuccess={(result: any) => {
                          if (result.info && typeof result.info === 'object') {
                            setForm({ ...form, image: result.info.secure_url });
                          }
                        }}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="px-6 py-3 bg-admin-bg/20 border border-admin-border rounded-xl text-admin-text-muted hover:text-admin-text hover:border-magenta hover:bg-magenta/10 transition-all flex items-center gap-2 font-bold whitespace-nowrap"
                          >
                            <CloudUpload className="w-5 h-5" /> Tải Lên
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>

                    {form.image && (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-admin-border bg-admin-bg">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                        <button
                          onClick={() => setForm({ ...form, image: '' })}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-admin-text transition-all backdrop-blur-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-admin-border flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-admin-border text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy</button>
                <button onClick={handleSave} className="px-8 py-3 rounded-xl bg-gradient-to-r from-magenta to-admin-panel text-admin-text font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
                  <Save className="w-5 h-5" /> {editMode ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

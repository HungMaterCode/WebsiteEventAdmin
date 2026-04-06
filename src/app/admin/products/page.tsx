'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Edit2, Trash2, Search, Filter,
  Package, Star, Tag, X, Save, ImageIcon
} from 'lucide-react';

const mockProducts = [
  { id: 'PRD-001', name: 'Áo Thun Neon Heritage Limited', category: 'Thời Trang', price: '350,000 VNĐ', stock: 120, status: 'Còn hàng', image: '', rating: 4.9 },
  { id: 'PRD-002', name: 'Mũ Snapback Cyber Edition', category: 'Thời Trang', price: '280,000 VNĐ', stock: 45, status: 'Còn hàng', image: '', rating: 4.7 },
  { id: 'PRD-003', name: 'Túi Tote Di Sản', category: 'Phụ Kiện', price: '199,000 VNĐ', stock: 0, status: 'Hết hàng', image: '', rating: 4.5 },
  { id: 'PRD-004', name: 'Vinyl Record Độc Quyền (Signed)', category: 'Âm Nhạc', price: '1,200,000 VNĐ', stock: 10, status: 'Sắp hết', image: '', rating: 5.0 },
  { id: 'PRD-005', name: 'Poster Nghệ Thuật A2 (In Lụa)', category: 'Nghệ Thuật', price: '250,000 VNĐ', stock: 200, status: 'Còn hàng', image: '', rating: 4.8 },
];

const catColors: Record<string, string> = {
  'Thời Trang': 'text-[#FF0088] bg-[#FF0088]/10 border-[#FF0088]/30',
  'Phụ Kiện': 'text-[#E6C753] bg-[#E6C753]/10 border-[#E6C753]/30',
  'Âm Nhạc': 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/30',
  'Nghệ Thuật': 'text-[#00C099] bg-[#00C099]/10 border-[#00C099]/30',
};

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', category: 'Thời Trang', price: '', stock: '', status: 'Còn hàng', image: '' });

  const getStockStyle = (s: string) => {
    if (s === 'Còn hàng') return 'text-[#00C099] border-[#00C099]/30 bg-[#00C099]/10';
    if (s === 'Sắp hết') return 'text-[#E6C753] border-[#E6C753]/30 bg-[#E6C753]/10';
    return 'text-red-500 border-red-500/30 bg-red-500/10';
  };

  const handleOpen = (edit = false) => { setEditMode(edit); setIsModalOpen(true); };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-[#FFFFFF]">Quản Lý Sản Phẩm</h2>
          <p className="text-[#8A8F98] text-sm mt-1">Quà tặng di sản, merchandise và vật phẩm độc quyền của sự kiện</p>
        </div>
        <button onClick={() => handleOpen(false)}
          className="px-6 py-3 bg-[#FF0088] hover:bg-[#FF0088]/80 text-[#FFFFFF] font-bold rounded-xl flex items-center gap-2 transition-all glow-magenta">
          <Plus className="w-5 h-5" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Sản Phẩm', value: '42', color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20', icon: ShoppingBag },
          { label: 'Còn Hàng', value: '38', color: 'text-[#00C099]', bg: 'bg-[#00C099]/10 border-[#00C099]/20', icon: Package },
          { label: 'Sắp / Hết Hàng', value: '4', color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20', icon: Tag },
          { label: 'Điểm Đánh Giá TB', value: '4.8★', color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20', icon: Star },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-[#8A8F98] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#4F1F76]/30 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#4F1F76]/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8F98]" />
            <input type="text" placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl pl-12 pr-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#4F1F76]/50 text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20 transition-all w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Danh Mục
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F1F76]/10 text-[#8A8F98] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 min-w-[260px]">Sản Phẩm</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30">Danh Mục</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Đánh Giá</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Giá</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Kho</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-center">Trạng Thái</th>
                <th className="p-4 font-bold border-b border-[#4F1F76]/30 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-[#4F1F76]/10 hover:bg-[#4F1F76]/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#4F1F76]/20 border border-[#4F1F76]/30 flex items-center justify-center shrink-0">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full rounded-xl object-cover" /> : <ImageIcon className="w-5 h-5 text-[#4F1F76]" />}
                      </div>
                      <div>
                        <div className="font-bold text-[#FFFFFF] text-sm group-hover:text-[#FF0088] transition-colors line-clamp-1">{p.name}</div>
                        <div className="text-xs text-[#8A8F98] font-mono mt-1">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${catColors[p.category] ?? 'text-[#8A8F98] bg-[#8A8F98]/10 border-[#8A8F98]/30'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#E6C753] font-bold text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" /> {p.rating}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-[#FFFFFF]">{p.price}</td>
                  <td className="p-4 text-center text-sm font-bold text-[#8A8F98]">{p.stock}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStockStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpen(true)} className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#4F1F76]/20 text-[#8A8F98] hover:text-red-500 hover:bg-red-500/10 transition-all">
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
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#060010]/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0D0716] border border-[#4F1F76]/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-[#4F1F76]/30 bg-[#4F1F76]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FF0088]/10 border border-[#FF0088]/30">
                    <ShoppingBag className="w-5 h-5 text-[#FF0088]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#FFFFFF] uppercase">{editMode ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-[#8A8F98] hover:text-[#FFFFFF] transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Tên Sản Phẩm *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ví dụ: Áo Thun Neon Heritage..." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Danh Mục</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] appearance-none">
                      {['Thời Trang', 'Phụ Kiện', 'Âm Nhạc', 'Nghệ Thuật'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Giá Bán (VNĐ) *</label>
                    <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="350000" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Số Lượng Kho *</label>
                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                      placeholder="0" className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">Trạng Thái</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088] appearance-none">
                      {['Còn hàng', 'Sắp hết', 'Hết hàng'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-widest block mb-2">URL Hình Ảnh</label>
                  <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..." className="w-full bg-[#060010] border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] focus:outline-none focus:border-[#FF0088]" />
                </div>
              </div>

              <div className="p-6 border-t border-[#4F1F76]/30 flex justify-end gap-4 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-[#4F1F76] text-[#8A8F98] font-bold hover:text-[#FFFFFF] transition-colors">Hủy</button>
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF0088] to-[#4F1F76] text-[#FFFFFF] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform glow-magenta">
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

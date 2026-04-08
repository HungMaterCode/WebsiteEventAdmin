'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plus, Edit2, Trash2, X, Save, Shield, User, RefreshCw, Mail, Key } from 'lucide-react';

const roleColors: Record<string, string> = {
  ADMIN: '#FF0088',
  SALES: '#00FFFF',
  CHECKIN: '#00C099',
  ANALYST: '#E6C753'
};

const roleNames: Record<string, string> = {
  ADMIN: 'Quản Trị Viên (Admin)',
  SALES: 'Nhân Viên Kinh Doanh (Sales)',
  CHECKIN: 'Nhân Viên Kiểm Soát (Check-in)',
  ANALYST: 'Thống Kê (Analyst)'
};

type UserType = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'ADMIN'
  });
  
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ email: '', name: '', password: '', role: 'SALES' });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserType) => {
    setEditingUser(u);
    setFormData({ email: u.email, name: u.name || '', password: '', role: u.role });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Xóa thất bại');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!formData.email) {
      setErrorMsg('Vui lòng nhập email'); return;
    }
    if (!editingUser && !formData.password) {
      setErrorMsg('Vui lòng nhập mật khẩu khi tạo mới'); return;
    }
    
    setSaving(true);
    setErrorMsg('');
    
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || 'Đã có lỗi xảy ra');
      } else {
        await fetchUsers();
        setIsModalOpen(false);
      }
    } catch (e) {
      setErrorMsg('Lỗi kết nối tới máy chủ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Phân Quyền</h2>
          <p className="text-admin-text-muted text-sm mt-1">Quản lý tài khoản truy cập và quyền hạn trong hệ thống</p>
        </div>
        <button onClick={openAddModal}
          className="px-6 py-3 bg-[#4F1F76] hover:bg-[#4F1F76]/80 text-admin-text font-bold rounded-xl flex items-center gap-2 transition-all border border-admin-border shadow-lg shadow-[#4F1F76]/20">
          <Plus className="w-5 h-5" /> Thêm Tài Khoản
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="w-8 h-8 text-[#00FFFF] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-[1.5rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-16 -mt-16 opacity-20 transition-opacity group-hover:opacity-30" style={{ background: roleColors[user.role] || '#8A8F98' }} />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: (roleColors[user.role] || '#8A8F98') + '20', border: `1px solid ${roleColors[user.role] || '#8A8F98'}40` }}>
                    <Shield className="w-6 h-6" style={{ color: roleColors[user.role] || '#8A8F98' }} />
                  </div>
                  <div className="truncate pr-2">
                    <div className="font-bold text-admin-text truncate">{user.name || 'Không có tên'}</div>
                    <div className="text-xs text-admin-text-muted truncate">{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="mb-5 relative z-10">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest border"
                  style={{ color: roleColors[user.role] || '#8A8F98', borderColor: (roleColors[user.role] || '#8A8F98') + '50', background: (roleColors[user.role] || '#8A8F98') + '15' }}>
                  {roleNames[user.role] || user.role}
                </span>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4 relative z-10">
                <button onClick={() => openEditModal(user)} className="px-3 py-2 rounded-lg bg-white/5 text-admin-text-muted hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all text-xs font-medium flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Sửa
                </button>
                <button onClick={() => handleDelete(user.id)} className="px-3 py-2 rounded-lg bg-white/5 text-admin-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all text-xs font-medium flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-admin-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-admin-panel border border-admin-border rounded-[2rem] shadow-2xl overflow-hidden shadow-[#4F1F76]/10">
              
              <div className="flex justify-between items-center p-6 border-b border-admin-border bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#4F1F76]/30 border border-admin-border"><Lock className="w-5 h-5 text-admin-text" /></div>
                  <h3 className="text-xl font-display font-bold text-admin-text uppercase">{editingUser ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="p-6 space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Email Đăng Nhập *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-admin-text-muted" />
                      <input type="email" value={formData.email} disabled={!!editingUser}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-admin-bg border border-admin-border rounded-xl pl-11 pr-4 py-3 text-admin-text focus:outline-none focus:border-admin-border disabled:opacity-50" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Tên Người Dùng</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-admin-text-muted" />
                      <input type="text" value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-admin-bg border border-admin-border rounded-xl pl-11 pr-4 py-3 text-admin-text focus:outline-none focus:border-admin-border" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Mật Khẩu {editingUser && '(Bỏ trống nếu không đổi)'}</label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-admin-text-muted" />
                      <input type="password" value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-admin-bg border border-admin-border rounded-xl pl-11 pr-4 py-3 text-admin-text focus:outline-none focus:border-admin-border" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest block mb-2">Vai Trò</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(roleNames).map(role => (
                        <label key={role} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === role ? 'bg-[#4F1F76]/20 border-admin-border' : 'bg-white/5 border-white/10 hover:border-admin-border'}`}>
                          <input type="radio" checked={formData.role === role} onChange={() => setFormData({...formData, role})} className="hidden" />
                          <Shield className="w-4 h-4" style={{ color: formData.role === role ? roleColors[role] : '#8A8F98' }} />
                          <span className={`text-xs font-bold ${formData.role === role ? 'text-admin-text' : 'text-admin-text-muted'}`}>{roleNames[role]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-admin-border bg-white/5 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-admin-text-muted font-bold hover:text-admin-text transition-colors">Hủy</button>
                <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded-xl bg-[#4F1F76] hover:bg-[#4F1F76]/80 text-admin-text font-bold flex items-center gap-2 disabled:opacity-50">
                  {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Lưu Lại
                </button>
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

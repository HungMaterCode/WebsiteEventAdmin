'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, Eye, ChevronLeft, ChevronRight,
  Download, RefreshCw, Trash2
} from 'lucide-react';
import MessageDetailModal from '@/components/modals/MessageDetailModal';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  content: string;
  createdAt: string;
}

export default function ContactManagement({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.phone.includes(searchTerm)
  );

  const handleOpenDetail = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[1.5rem] bg-cyan/10 border border-cyan/20 glow-cyan">
            <MessageSquare className="w-8 h-8 text-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">Quản lý liên hệ</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Danh sách tin nhắn từ khách hàng</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan transition-colors" />
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs">
          <Filter className="w-4 h-4" /> Lọc
        </button>
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-left bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Tên</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Số điện thoại</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Ngày gửi</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg, i) => (
                  <motion.tr 
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan text-xs font-bold">
                          {msg.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-cyan transition-colors">{msg.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">{msg.email}</td>
                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                      <span className="px-3 py-1.5 rounded-xl bg-magenta/10 border border-magenta/20 text-magenta text-xs font-bold">
                        {msg.phone}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDetail(msg)}
                          className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan hover:text-midnight transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                      <MessageSquare className="w-12 h-12 opacity-20" />
                      <p className="font-bold uppercase tracking-widest text-xs">Không tìm thấy tin nhắn nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Hiển thị {filteredMessages.length} tin nhắn
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20" disabled>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <MessageDetailModal 
        message={selectedMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

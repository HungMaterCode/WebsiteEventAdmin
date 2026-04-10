'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, Eye, ChevronLeft, ChevronRight,
  Download, RefreshCw, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MessageDetailModal from '@/components/modals/MessageDetailModal';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject?: string | null;
  message?: string | null;
  createdAt: string;
}

export default function ContactManagement({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterDate, setFilterDate] = React.useState('ALL');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const pageSize = 10;
  const router = useRouter();

  const filteredMessages = React.useMemo(() => {
    let result = messages.filter(msg => {
      const emailLocal = msg.email.split('@')[0];
      const matchesSearch = 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emailLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.phone && msg.phone.includes(searchTerm));
      
      if (!matchesSearch) return false;

      if (filterDate === 'ALL') return true;

      const msgDate = new Date(msg.createdAt);
      const now = new Date();
      
      if (filterDate === 'TODAY') {
        return msgDate.toDateString() === now.toDateString();
      }
      
      if (filterDate === 'WEEK') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return msgDate >= oneWeekAgo;
      }

      return true;
    });

    // Sắp xếp
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [messages, searchTerm, filterDate, sortOrder]);

  // Phân trang
  const totalPages = Math.ceil(filteredMessages.length / pageSize);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset trang khi lọc hoặc tìm kiếm
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate, sortOrder]);

  const handleOpenDetail = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    toast.success('Đã làm mới dữ liệu!');
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExportCSV = () => {
    try {
      if (filteredMessages.length === 0) {
        toast.error('Không có dữ liệu để xuất!');
        return;
      }

      // Headers
      const headers = ['Tên khách hàng', 'Email', 'Số điện thoại', 'Ngày gửi', 'Nội dung'];
      
      // Rows data
      const rows = filteredMessages.map(msg => [
        `"${msg.name.replace(/"/g, '""')}"`,
        `"${msg.email}"`,
        `"${msg.phone}"`,
        `"${new Date(msg.createdAt).toLocaleString('vi-VN')}"`,
        `"${(msg.message || '').replace(/"/g, '""')}"`
      ]);

      // Combine into CSV string with UTF-8 BOM for Excel
      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `LienHe_XuatFile_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Đã xuất file thành công!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Có lỗi xảy ra khi xuất file.');
    }
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
          <button 
            onClick={handleExportCSV}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-cyan hover:border-cyan/30 transition-all group"
            title="Tải xuống CSV"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-magenta hover:border-magenta/30 transition-all group disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 group-hover:scale-110 transition-all ${isRefreshing ? 'animate-spin text-magenta' : ''}`} />
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
        <div className="flex gap-2">
          <select 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] outline-none cursor-pointer focus:border-cyan/50"
          >
            <option value="ALL" className="bg-[#0a0510] text-white">TẤT CẢ THỜI GIAN</option>
            <option value="TODAY" className="bg-[#0a0510] text-white">HÔM NAY</option>
            <option value="WEEK" className="bg-[#0a0510] text-white">7 NGÀY QUA</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            {sortOrder === 'desc' ? 'MỚI NHẤT' : 'CŨ NHẤT'}
          </button>
        </div>
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
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg, i) => (
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
                      <span className="text-magenta font-bold">{msg.phone}</span>
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
            Trang {currentPage} / {totalPages || 1} — Hiển thị {paginatedMessages.length} / {filteredMessages.length} tin nhắn
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(curr => Math.max(1, curr - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                    currentPage === i + 1 
                      ? 'bg-cyan text-midnight glow-cyan' 
                      : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            </div>

            <button 
              onClick={() => setCurrentPage(curr => Math.min(totalPages, curr + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            >
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

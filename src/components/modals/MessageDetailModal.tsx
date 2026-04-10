'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject?: string | null;
  message?: string | null;
  createdAt: string;
}

interface MessageDetailModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageDetailModal({ message, isOpen, onClose }: MessageDetailModalProps) {
  if (!message) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101] p-4"
          >
            <div className="glass-card bg-[#0a0510]/95 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative p-8 border-b border-white/5">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-cyan/10 border border-cyan/20">
                    <MessageSquare className="w-6 h-6 text-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">Chi Tiết Tin Nhắn</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {message.id}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <User className="w-3 h-3" /> Họ và Tên
                    </div>
                    <p className="text-white font-bold">{message.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <Mail className="w-3 h-3" /> Email
                    </div>
                    <p className="text-cyan font-bold break-all">{message.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <Phone className="w-3 h-3" /> Số điện thoại
                    </div>
                    <p className="text-magenta font-bold">{message.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> Ngày gửi
                    </div>
                    <p className="text-gray-300">
                      {new Date(message.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nội dung tin nhắn</div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                    {message.message}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

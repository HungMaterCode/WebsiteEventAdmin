"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, X, Loader2, AlertCircle, 
  CheckCircle2, Info, LayoutList
} from "lucide-react";
import { Question } from "@/types/survey";
import { QuestionForm } from "@/components/admin/survey/QuestionForm";
import { QuestionListItem } from "@/components/admin/survey/QuestionListItem";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách câu hỏi.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSave = async (id?: string) => {
    const url = id ? `/api/admin/questions/${id}` : "/api/admin/questions";
    const method = id ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: id ? 'Cập nhật thành công!' : 'Thêm mới thành công!' });
        setIsEditing(null);
        setIsAdding(false);
        setEditForm({});
        fetchQuestions();
      } else {
        setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Lỗi kết nối.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Đã xóa câu hỏi.' });
        fetchQuestions();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (q: Question) => {
    setIsEditing(q.id);
    setEditForm(q);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditForm({
      text: "",
      type: "choice",
      options: ["Lựa chọn 1", "Lựa chọn 2"],
      order: questions.length + 1,
      isActive: true,
    });
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text tracking-tighter flex items-center gap-3">
            <LayoutList className="text-cyan" /> Quản Lý Câu Hỏi Khảo Sát
          </h2>
          <p className="text-admin-text-muted text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-magenta rounded-full animate-pulse" /> Dynamic Survey Form Protocol
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={startAdd}
            className="px-6 py-3 bg-gradient-to-r from-cyan to-royal-light rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:glow-cyan transition-all"
          >
            <Plus size={20} /> Thêm câu hỏi
          </button>
        )}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm uppercase tracking-wide">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Adding New Question Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 rounded-2xl border-cyan/30 bg-cyan/5"
            >
              <QuestionForm 
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSave}
                onCancel={() => setIsAdding(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <QuestionListItem 
              key={q.id}
              question={q}
              index={index}
              isEditing={isEditing === q.id}
              onEdit={startEdit}
              onDelete={handleDelete}
              renderEditForm={() => (
                <QuestionForm 
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(null)}
                  isEditing
                  questionId={q.id}
                />
              )}
            />
          ))}
          
          {questions.length === 0 && !isAdding && (
             <div className="text-center py-20 border-2 border-dashed border-admin-border/10 rounded-[2rem]">
               <Info className="mx-auto mb-4 text-admin-text-muted/20" size={48} />
               <p className="text-admin-text-muted/40 font-display uppercase tracking-widest">Chưa có câu hỏi nào trong database</p>
               <button onClick={startAdd} className="mt-4 text-cyan hover:underline uppercase text-xs font-bold tracking-widest">Bấm để tạo ngay</button>
             </div>
          )}
        </div>
      </div>
      
      <div className="p-6 glass-card rounded-2xl border-admin-border/10 flex items-start gap-4">
         <AlertCircle className="text-gold shrink-0 mt-1" size={20} />
         <div>
            <h5 className="font-bold text-gold uppercase text-xs mb-1">Lưu ý bảo trì hệ thống</h5>
            <p className="text-xs text-admin-text-muted/60 leading-relaxed">
              Việc thay đổi câu hỏi khảo sát đang diễn ra công khai sẽ ảnh hưởng đến tính nhất quán của dữ liệu đã thu thập. 
              Khuyên dùng: Chỉ nên **Ẩn (Deactivate)** câu hỏi cũ thay vì **Xóa (Delete)** để giữ toàn vẹn lịch sử khảo sát.
            </p>
         </div>
      </div>
    </div>
  );
}

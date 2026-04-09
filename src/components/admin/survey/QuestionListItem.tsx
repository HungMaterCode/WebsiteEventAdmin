import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, GripVertical } from "lucide-react";
import { Question } from "@/types/survey";

interface QuestionListItemProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  renderEditForm: (q: Question) => React.ReactNode;
}

export const QuestionListItem: React.FC<QuestionListItemProps> = ({
  question: q,
  index,
  isEditing,
  onEdit,
  onDelete,
  renderEditForm
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-5 rounded-2xl border-white/5 transition-all group ${isEditing ? 'border-magenta/50 bg-magenta/5 shadow-[0_0_20px_rgba(255,0,136,0.1)]' : 'hover:border-cyan/20'}`}
    >
      {isEditing ? (
        renderEditForm(q)
      ) : (
        /* Display View */
        <div className="flex items-center gap-6">
          <div className="shrink-0 flex flex-col items-center opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono leading-none mb-1">#{q.order}</span>
            <GripVertical size={20} className="text-silver/40 cursor-move" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
               <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${q.type === 'choice' ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'bg-magenta/10 text-magenta border border-magenta/20'}`}>
                 {q.type === 'choice' ? 'Multiple Choice' : 'Free Text'}
               </span>
               {!q.isActive && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Hidden</span>}
            </div>
            <h4 className="text-lg font-bold text-silver/90">{q.text}</h4>
            {q.type === 'choice' && (
              <div className="flex flex-wrap gap-2 mt-3">
                 {q.options.map((opt, i) => (
                   <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-silver/40">
                     {opt}
                   </span>
                 ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={() => onEdit(q)}
              className="p-3 bg-white/5 hover:bg-cyan/20 hover:text-cyan rounded-xl border border-white/5 transition-all"
              title="Chỉnh sửa"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(q.id)}
              className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl border border-white/5 transition-all"
              title="Xóa câu hỏi"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

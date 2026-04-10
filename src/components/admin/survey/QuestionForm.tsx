import React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Question } from "@/types/survey";

interface QuestionFormProps {
  editForm: Partial<Question>;
  setEditForm: (form: Partial<Question>) => void;
  onSave: (id?: string) => void;
  onCancel: () => void;
  isEditing?: boolean;
  questionId?: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  editForm,
  setEditForm,
  onSave,
  onCancel,
  isEditing,
  questionId
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(editForm.options || [])];
    newOptions[index] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const addOption = () => {
    setEditForm({ ...editForm, options: [...(editForm.options || []), `Lựa chọn ${ (editForm.options?.length || 0) + 1 }`] });
  };

  const removeOption = (index: number) => {
    const newOptions = (editForm.options || []).filter((_, i) => i !== index);
    setEditForm({ ...editForm, options: newOptions });
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-cyan uppercase tracking-widest">Thêm câu hỏi mới</h3>
          <button onClick={onCancel} className="text-silver/40 hover:text-white"><X /></button>
        </div>
      )}
      
      {isEditing && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-magenta">EDITING_NODE_{questionId?.slice(-4).toUpperCase()}</span>
          <button onClick={onCancel} className="text-silver/40 hover:text-white"><X size={18} /></button>
        </div>
      )}

      <div className={`grid grid-cols-1 ${!isEditing ? 'md:grid-cols-2' : ''} gap-6`}>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-mono text-silver/40 mb-2 block">Nội dung câu hỏi</label>
            <input 
              type="text" 
              value={editForm.text || ""} 
              onChange={(e) => setEditForm({...editForm, text: e.target.value})}
              className={`w-full bg-midnight/50 border ${isEditing ? 'border-white/20 focus:border-magenta/50' : 'border-white/10 focus:border-cyan/50'} rounded-xl px-4 py-3 focus:outline-none transition-all`}
              placeholder="Nhập câu hỏi..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-silver/40 mb-2 block">Loại câu hỏi</label>
              <select 
                value={editForm.type}
                onChange={(e) => setEditForm({...editForm, type: e.target.value as any})}
                className="w-full bg-midnight/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none appearance-none text-sm"
              >
                <option value="choice">Trắc nghiệm</option>
                <option value="text">Văn bản</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-silver/40 mb-2 block">Thứ tự</label>
              <input 
                type="number" 
                value={editForm.order} 
                onChange={(e) => setEditForm({...editForm, order: Number(e.target.value)})}
                className="w-full bg-midnight/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none text-sm"
              />
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={editForm.isActive} 
                onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                id={`active-${questionId}`}
              />
              <label htmlFor={`active-${questionId}`} className="text-[10px] uppercase font-mono cursor-pointer">Active</label>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {editForm.type === 'choice' ? (
            <>
              <label className="text-[10px] uppercase font-mono text-silver/40 mb-2 block">Các lựa chọn</label>
              {editForm.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" 
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 bg-midnight/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan/30 outline-none"
                  />
                  <button onClick={() => removeOption(idx)} className="p-2 text-red-400/50 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={addOption} className="text-xs text-cyan flex items-center gap-1 hover:underline pt-2">
                <Plus size={14} /> Thêm lựa chọn
              </button>
            </>
          ) : (
            <div>
              <label className="text-[10px] uppercase font-mono text-silver/40 mb-2 block">Placeholder (Gợi ý)</label>
              <input 
                type="text" 
                value={editForm.placeholder || ""} 
                onChange={(e) => setEditForm({...editForm, placeholder: e.target.value})}
                className="w-full bg-midnight/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none transition-all"
                placeholder="Nhập gợi ý cho người dùng..."
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-white/5 pt-6">
        <button onClick={onCancel} className="px-6 py-2 text-silver/60 hover:text-white uppercase text-xs font-bold">Hủy</button>
        <button 
          onClick={() => onSave(questionId)} 
          className={`px-8 py-2 ${isEditing ? 'bg-magenta shadow-[0_0_15px_rgba(255,0,136,0.3)]' : 'bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/30'} rounded-lg uppercase text-xs font-bold transition-all font-display tracking-widest`}
        >
          {isEditing ? 'Lưu thay đổi' : 'Lưu câu hỏi'}
        </button>
      </div>
    </div>
  );
};

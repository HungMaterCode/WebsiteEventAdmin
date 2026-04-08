'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2, XCircle, User, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';

const mockReviews = [
  { id: 'REV-001', author: 'Nguyễn Văn A', avatar: 'N', rating: 5, content: 'Sự kiện tuyệt vời! Sân khấu cực kỳ ấn tượng, âm thanh ánh sáng đỉnh cao. Nhất định sẽ quay lại năm sau!', status: 'Đã duyệt', date: '2026-04-05', likes: 42 },
  { id: 'REV-002', author: 'Trần Thị B', avatar: 'T', rating: 4, content: 'Trải nghiệm rất tốt, tuy nhiên khu ẩm thực hơi đông và chờ hơi lâu. Nhìn chung vẫn rất đáng tiền vé.', status: 'Đã duyệt', date: '2026-04-04', likes: 18 },
  { id: 'REV-003', author: 'Lê Văn C', avatar: 'L', rating: 2, content: 'Tổ chức hơi lộn xộn ở cổng vào. Xếp hàng mất gần 1 tiếng mới vào được, cần cải thiện khâu check-in.', status: 'Chờ duyệt', date: '2026-04-05', likes: 5 },
  { id: 'REV-004', author: 'Hoàng Minh D', avatar: 'H', rating: 5, content: 'Ban nhạc quá đỉnh! Độ đầu tư của ban tổ chức rất cao. Màn trình diễn ánh sáng laser là highlight của đêm!', status: 'Đã duyệt', date: '2026-04-04', likes: 67 },
  { id: 'REV-005', author: 'Phạm Thị E', avatar: 'P', rating: 1, content: 'Nội dung spam, không liên quan đến sự kiện.', status: 'Đã ẩn', date: '2026-04-03', likes: 0 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-[#E6C753] fill-[#E6C753]' : 'text-[#4F1F76]'}`} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const avg = (mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length).toFixed(1);

  const getStatusStyle = (s: string) => {
    if (s === 'Đã duyệt') return 'bg-[#00C099]/10 text-[#00C099] border-[#00C099]/30';
    if (s === 'Chờ duyệt') return 'bg-[#E6C753]/10 text-[#E6C753] border-[#E6C753]/30';
    return 'bg-[#8A8F98]/10 text-admin-text-muted border-[#8A8F98]/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-black uppercase text-admin-text">Quản Lý Đánh Giá</h2>
        <p className="text-admin-text-muted text-sm mt-1">Kiểm duyệt bình luận, lọc nội dung không phù hợp và theo dõi chỉ số hài lòng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Đánh Giá TB', value: `${avg}★`, icon: Star, color: 'text-[#E6C753]', bg: 'bg-[#E6C753]/10 border-[#E6C753]/20' },
          { label: 'Tổng Đánh Giá', value: '1,842', icon: MessageSquare, color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]/10 border-[#00FFFF]/20' },
          { label: 'Chờ Kiểm Duyệt', value: '23', icon: CheckCircle2, color: 'text-[#FF0088]', bg: 'bg-[#FF0088]/10 border-[#FF0088]/20' },
          { label: 'Đã Ẩn', value: '8', icon: XCircle, color: 'text-admin-text-muted', bg: 'bg-[#8A8F98]/10 border-[#8A8F98]/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {mockReviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border shadow-xl hover:border-admin-border transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar + Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full border-2 border-admin-border flex items-center justify-center font-display font-black text-lg text-admin-text bg-[#4F1F76]/30 shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-bold text-admin-text">{review.author}</span>
                    <StarRating rating={review.rating} />
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-admin-text-muted font-bold mb-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {review.id}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {review.date}</span>
                  </div>
                  <p className="text-sm text-[#C0C5CC] leading-relaxed">{review.content}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-admin-text-muted">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#00C099]" /> <span className="font-bold text-[#00C099]">{review.likes}</span> <span>người thấy hữu ích</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                {review.status === 'Chờ duyệt' && (
                  <button className="px-4 py-2 rounded-xl bg-[#00C099]/10 border border-[#00C099]/30 text-[#00C099] font-bold text-xs hover:bg-[#00C099] hover:text-[#060010] transition-all flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                  </button>
                )}
                {review.status !== 'Đã ẩn' && (
                  <button className="px-4 py-2 rounded-xl bg-[#8A8F98]/10 border border-[#8A8F98]/30 text-admin-text-muted font-bold text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Ẩn
                  </button>
                )}
                {review.status === 'Đã ẩn' && (
                  <button className="px-4 py-2 rounded-xl bg-[#4F1F76]/20 border border-admin-border text-admin-text-muted font-bold text-xs hover:text-admin-text transition-all flex items-center gap-1.5">
                    <ThumbsDown className="w-3.5 h-3.5" /> Đã ẩn
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

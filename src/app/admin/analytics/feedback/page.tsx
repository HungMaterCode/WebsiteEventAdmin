'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as ChartTooltip
} from 'recharts';
import { 
  MessageSquare, Star, ShieldAlert, Activity, 
  Quote, User, Calendar, Loader2, RefreshCw,
  AlertTriangle, Filter
} from 'lucide-react';

export default function FeedbackAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/feedback');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch feedback analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan animate-spin" />
        <p className="text-silver/40 font-mono text-xs uppercase tracking-[0.2em]">Decrypting feedback clusters...</p>
      </div>
    );
  }

  const { summary, radarData, latestComments } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black uppercase text-[#FFFFFF] tracking-tighter flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-magenta glow-magenta" />
            Đánh giá & Phản hồi
          </h2>
          <p className="text-silver/40 text-sm mt-1 uppercase tracking-[0.3em] font-mono">Customer Insights Protocol // v1.0</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
        >
          <RefreshCw className={`w-5 h-5 text-cyan group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng đánh giá', value: summary.totalReviews, sub: 'Responses', icon: MessageSquare, color: '#FFFFFF' },
          { label: 'Điểm trung bình', value: summary.avgOverall, sub: 'Stars Out of 5.0', icon: Star, color: '#E6C753' },
          { label: 'Báo cáo Spam', value: summary.spamCount, sub: 'Filtered Bot Submissions', icon: ShieldAlert, color: '#FF0088' },
          { label: 'Đánh giá hợp lệ', value: summary.validReviews, sub: 'Verified Human Insights', icon: Activity, color: '#00FFFF' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-[#0D0716]/80 backdrop-blur-md border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
              <s.icon className="w-16 h-16" style={{ color: s.color }} />
            </div>
            <p className="text-silver/40 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
            <div className="text-4xl font-display font-black" style={{ color: s.color }}>{s.value}</div>
            <p className="text-[10px] text-silver/30 mt-2 font-mono uppercase tracking-tighter">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-12 xl:col-span-6 glass-card p-10 rounded-[3rem] bg-[#0D0716]/80 border border-white/5 min-h-[500px] flex flex-col shadow-2xl relative overflow-hidden">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#FFFFFF] flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
              Chỉ số hài lòng đa chiều
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-silver/40 font-mono">
              <Filter className="w-3 h-3" /> VERIFIED DATA
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#FFFFFF1A" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#8A8F98', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="transparent" tick={false} />
                <Radar
                   name="Score"
                   dataKey="value"
                   stroke="#00FFFF"
                   strokeWidth={3}
                   fill="#00FFFF"
                   fillOpacity={0.3}
                   animationBegin={500}
                   animationDuration={1500}
                />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: '#0D0716', border: '1px solid #ffffff1a', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#00FFFF' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center justify-center relative z-10 border-t border-white/5 pt-8">
             <div className="p-4 rounded-2xl bg-magenta/5 border border-magenta/10 flex items-start gap-4 flex-1">
                <AlertTriangle className="w-5 h-5 text-magenta shrink-0 mt-0.5" />
                <div>
                   <p className="text-[10px] text-white font-black uppercase mb-1">Cảnh báo Spam</p>
                   <p className="text-[9px] text-silver/40 leading-relaxed font-mono">Hệ thống lọc bỏ các phản hồi hoàn thành dưới 45 giây để đảm bảo tính xác thực của dữ liệu Radar.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Latest Detailed Feedback */}
        <div className="lg:col-span-12 xl:col-span-6 glass-card rounded-[3rem] bg-[#0D0716]/80 border border-white/5 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-4">
              <Quote className="w-8 h-8 text-magenta" />
              Lời nhắn gửi từ khách hàng
            </h3>
            <div className="text-[10px] px-3 py-1 bg-white/5 rounded-full text-silver/40 font-mono">LATEST 10</div>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[600px] p-6 space-y-4 custom-scrollbar">
            {latestComments.map((c: any, i: number) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] hover:border-magenta/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magenta/20 to-royal/20 flex items-center justify-center border border-magenta/20">
                      <User className="w-5 h-5 text-magenta" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{c.bookingCode}</div>
                      <div className="flex items-center gap-1 text-[9px] text-silver/40 uppercase font-bold tracking-widest font-mono">
                        <Calendar className="w-3 h-3" /> {new Date(c.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="w-4 h-4 text-silver/10 absolute -top-1 -left-1" />
                  <p className="text-xs text-silver/70 leading-relaxed italic pl-4 border-l-2 border-magenta/20 ml-2 group-hover:text-silver transition-colors">
                    {c.comments}
                  </p>
                </div>
              </motion.div>
            ))}

            {latestComments.length === 0 && (
              <div className="py-20 text-center opacity-20">
                 <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                 <p className="text-sm uppercase font-black tracking-widest">Chưa có góp ý chi tiết hợp lệ</p>
              </div>
            )}
          </div>
          
          <div className="p-8 bg-black/40 border-t border-white/5 text-center">
             <p className="text-[10px] text-silver/20 font-mono uppercase tracking-[0.4em]">Neon Heritage Insights Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}

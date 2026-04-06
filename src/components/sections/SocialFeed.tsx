'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function SocialFeed() {
  const posts = [
    { user: "@minh_anh", text: "Không thể chờ đợi thêm nữa! Ninh Bình sẽ rực rỡ đêm nay! 🔥", time: "2m ago" },
    { user: "@cyber_heritage", text: "Sân khấu Thung Nham đang dần hoàn thiện, quá đỉnh! 💎", time: "15m ago" },
    { user: "@music_lover", text: "Line-up năm nay thực sự là một giấc mơ. #NeonHeritage", time: "1h ago" },
  ];
  return (
    <section className="py-24 relative bg-midnight border-t border-royal/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-8"><span className="text-silver">Cộng Đồng </span><span className="text-gradient block">Đang Nói Gì?</span></h2>
            <p className="text-gray-400 text-lg mb-10">Hàng ngàn người đang cùng chia sẻ niềm đam mê với hashtag <span className="text-cyan font-bold">#NeonHeritage2024</span>.</p>
            <div className="flex gap-6">
              <div className="text-center"><div className="text-3xl font-display font-black text-magenta">25K+</div><div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Followers</div></div>
              <div className="w-px h-12 bg-royal/30"></div>
              <div className="text-center"><div className="text-3xl font-display font-black text-cyan">150K+</div><div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Mentions</div></div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            {posts.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-royal/10 border border-royal/30 backdrop-blur-sm hover:border-cyan/30 transition-colors">
                <div className="flex justify-between items-center mb-3"><span className="text-cyan font-bold">{post.user}</span><span className="text-gray-500 text-xs">{post.time}</span></div>
                <p className="text-silver/80 italic">&quot;{post.text}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

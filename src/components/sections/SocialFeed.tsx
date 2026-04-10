'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function SocialFeed({ items, settings }: { items?: any[], settings?: any }) {
  const hashtag = settings?.communityHashtag || '#NeonHeritage2024';
  const followers = settings?.communityFollowers || '25K+';
  const mentions = settings?.communityMentions || '150K+';
  const displayPosts = Array.isArray(items) ? items : [];

  return (
    <section className="py-24 relative bg-midnight border-t border-royal/20" id="community">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-8">
              <span className="text-silver">Cộng </span>
              <span className="text-gradient block">Đồng</span>
            </h2>

            <p className="text-gray-400 text-lg mb-10">
              Hàng ngàn người đang cùng chia sẻ niềm đam mê với hashtag{" "}
              <span className="text-cyan font-bold tracking-tight glow-cyan text-sm sm:text-lg">{hashtag}</span>.
            </p>
            <div className="flex gap-10 items-center bg-royal/15 p-8 rounded-[2.5rem] border border-royal/30 w-fit backdrop-blur-md shadow-[0_0_30px_rgba(79,31,118,0.2)]">
              <div className="text-center">
                <div className="text-4xl font-display font-black text-magenta italic tracking-tighter text-glow-magenta">{followers}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Followers</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-royal/50 to-transparent"></div>
              <div className="text-center">
                <div className="text-4xl font-display font-black text-cyan italic tracking-tighter text-glow-cyan">{mentions}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mt-1">Mentions</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-5">
            {displayPosts.map((post, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: i * 0.15 }} 
                className="p-8 rounded-[2rem] bg-royal/20 border border-royal/50 backdrop-blur-md hover:border-cyan/60 hover:bg-royal/30 transition-all group relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan/20 group-hover:bg-cyan transition-colors" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-cyan font-bold tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                    {post.username}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">{post.timestamp}</span>
                </div>
                <p className="text-silver/90 italic leading-relaxed text-lg">&quot;{post.content}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


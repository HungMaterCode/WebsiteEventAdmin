'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';

interface NewsSectionProps {
  posts: any[];
}

export default function NewsSection({ posts }: NewsSectionProps) {
  const displayPosts = posts || [];

  return (
    <section className="py-24 relative overflow-hidden" id="news">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-magenta/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[120px] translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-magenta"></div>
              <h3 className="text-magenta font-bold tracking-[0.2em] text-sm uppercase">Cập Nhật</h3>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-magenta"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-wider text-white">
              Tin Tức <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta">Sự Kiện</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              href="/blog" 
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-royal/50 hover:border-cyan/50 hover:bg-cyan/10 transition-all duration-300"
            >
              <span className="font-bold text-sm tracking-wider uppercase text-silver group-hover:text-white">Xem Tất Cả</span>
              <ArrowRight className="w-4 h-4 text-cyan transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-royal/30 rounded-3xl bg-royal/5">
              <p className="text-gray-400 font-medium">Hiện tại chưa có tin tức nổi bật nào được đăng tải.</p>
            </div>
          ) : (
            displayPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="group block h-full bg-[#0D0716]/80 backdrop-blur-sm border border-royal/30 rounded-[2rem] overflow-hidden hover:border-magenta/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,136,0.15)] flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0716] to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-royal/20 to-magenta/10 flex items-center justify-center">
                        <span className="text-royal/40 font-display font-black text-4xl">NEON</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-[#FFFFFF] bg-magenta/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-cyan/20 group-hover:border-cyan/50 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-cyan transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt || 'Đọc chi tiết bài viết để cập nhật các thông tin mới nhất từ sự kiện...'}
                    </p>
                    
                    <div className="mt-auto pt-5 border-t border-royal/30 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-magenta group-hover:text-cyan transition-colors">
                        Đọc Tiếp
                      </span>
                      <div className="w-8 h-px bg-magenta group-hover:w-12 group-hover:bg-cyan transition-all duration-300"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

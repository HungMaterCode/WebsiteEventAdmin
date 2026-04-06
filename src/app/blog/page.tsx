import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronLeft } from 'lucide-react';

// Use Next.js SSG / ISR behavior
export const revalidate = 3600; // Revalidate at most every hour

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-midnight text-silver font-sans">
      <Navbar />
      <main className="pt-32 pb-24 container mx-auto px-6">
        <div className="mb-12">
          <Link href="/#news" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Trở về trang chủ
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider text-silver">
            Tin Tức <span className="text-gradient">& Sự Kiện</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Cập nhật những thông tin mới nhất về dàn nghệ sĩ, hoạt động nổi bật và các câu chuyện đằng sau thành công của Neon Heritage Festival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-royal/10 border border-royal/30 rounded-2xl overflow-hidden hover:border-cyan/50 transition-colors">
              {post.coverImage && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <div className="flex gap-2 flex-wrap mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-magenta bg-magenta/10 px-2 py-1 rounded inline-block">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="text-xs text-gray-500 font-medium">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : ''}
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-royal/30 rounded-2xl">
              Đang cập nhật bài viết mới...
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

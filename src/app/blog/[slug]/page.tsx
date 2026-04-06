import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, ChevronLeft, Share2 } from 'lucide-react';
import ShareButtons from '@/components/ui/ShareButtons';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  
  const siteUrl = 'https://neonheritage.vn';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    keywords: post.seoKeywords?.join(', '),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      url: postUrl,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    other: {
      'geo.region': 'VN-NB',
      'geo.placename': 'Ninh Bình',
      'geo.position': '20.2539;105.9750',
      'ICBM': '20.2539, 105.9750'
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post || !post.published) return notFound();

  // Fetch related posts (latest 3 posts excluding current)
  const relatedPosts = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 3
  });

  const siteUrl = 'https://neonheritage.vn';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Neon Heritage',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neon Heritage',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#060010] text-[#FFFFFF] font-sans selection:bg-[#E6C753] selection:text-[#060010]">
      {/* JSON-LD Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navbar />
      
      <main className="pb-24">
        {/* Full-width Hero Cover */}
        <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#060010] via-[#060010]/60 to-[#060010]/20 z-10"></div>
          {post.coverImage ? (
             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-[#0D0716]"></div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full z-20">
            <div className="container mx-auto px-4 md:px-6 pb-12">
              <Link href="/blog" className="inline-flex items-center gap-2 text-[#8A8F98] hover:text-[#00FFFF] transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
                <ChevronLeft className="w-4 h-4" />
                Trở về trang tin
              </Link>
              
              <div className="max-w-4xl">
                {post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-[#FF0088] bg-[#FF0088]/10 border border-[#FF0088]/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-[#FFFFFF] mb-6 leading-tight !tracking-wide">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-4 text-[#8A8F98] font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00FFFF]" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4F1F76]"></div>
                  <div>Tác giả: <span className="text-[#E6C753]">Ban Tổ Chức</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="container mx-auto px-4 md:px-6 pt-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left: Main Content (70%) */}
            <article className="lg:w-2/3">
              <div 
                className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide
                prose-h2:text-[#00FFFF] prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#4F1F76]/30 prose-h2:pb-4
                prose-h3:text-[#FF0088] prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-[#B4B8C0] prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[#E6C753] hover:prose-a:text-[#FFFFFF] prose-a:transition-colors
                prose-img:rounded-2xl prose-img:border prose-img:border-[#4F1F76]/30 prose-img:w-full
                prose-strong:text-[#FFFFFF] prose-strong:bg-[#FF0088]/10 prose-strong:px-1
                prose-blockquote:border-l-4 prose-blockquote:border-[#00FFFF] prose-blockquote:bg-[#00FFFF]/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-[#E6C753]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="mt-16 pt-8 border-t border-[#4F1F76]/30">
                <div className="font-display font-black text-xl mb-6 tracking-widest uppercase">Chia sẻ bài viết</div>
                <ShareButtons postUrl={postUrl} postTitle={post.title} />
              </div>
            </article>
            
            {/* Right: Sidebar Related Posts (30%) */}
            <aside className="lg:w-1/3">
              <div className="sticky top-32 bg-[#0D0716]/80 backdrop-blur-md border border-[#4F1F76]/30 p-6 md:p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-3 mb-8">
                  <Share2 className="w-5 h-5 text-[#FF0088]" />
                  <h3 className="font-display font-black text-base md:text-lg tracking-widest uppercase text-[#FFFFFF]">Tin Tức Liên Quan</h3>
                </div>
                
                <div className="space-y-8">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                      {rp.coverImage && (
                        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-[#4F1F76]/30">
                          <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="text-[10px] uppercase font-bold tracking-widest text-[#00FFFF] mb-2">
                        {rp.tags[0] || 'Cập Nhật'}
                      </div>
                      <h4 className="font-bold text-[#FFFFFF] group-hover:text-[#FF0088] transition-colors leading-snug line-clamp-2">
                        {rp.title}
                      </h4>
                    </Link>
                  ))}
                  
                  {relatedPosts.length === 0 && (
                     <div className="text-sm text-[#8A8F98] italic">Chưa có bài viết liên quan.</div>
                  )}
                </div>
                
                <Link href="/blog" className="block w-full text-center mt-8 py-3 rounded-xl border border-[#00FFFF]/30 text-[#00FFFF] font-bold text-sm uppercase tracking-widest hover:bg-[#00FFFF]/10 transition-colors">
                  Xem toàn bộ Blog
                </Link>
              </div>
            </aside>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export type PostStatus = 'all' | 'published' | 'draft';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now().toString();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        tags: body.tags || [],
        seoTitle: body.seoTitle,
        seoDesc: body.seoDesc,
        seoKeywords: body.seoKeywords || [],
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

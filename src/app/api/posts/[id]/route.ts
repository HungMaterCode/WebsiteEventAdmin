import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Extract fields
    const { id: _id, ...updateData } = body;
    
    if (updateData.title) {
        updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (updateData.published) {
        updateData.publishedAt = new Date();
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;
      await prisma.post.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 });
    } catch {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
  }

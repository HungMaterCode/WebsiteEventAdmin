import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const count = await prisma.faq.count();

    const faq = await prisma.faq.create({
      data: { 
        question: body.question, 
        answer: body.answer, 
        category: body.category, 
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : count 
      },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (Array.isArray(body)) {
      // Bulk update (reorder)
      const updates = body.map((item: any) =>
        prisma.faq.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
          },
        })
      );
      
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true, count: updates.length });
    } else {
      // Single update
      const { id, question, answer, category, sortOrder } = body;
      const faq = await prisma.faq.update({
        where: { id },
        data: { question, answer, category, sortOrder },
      });
      return NextResponse.json(faq);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.faq.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}

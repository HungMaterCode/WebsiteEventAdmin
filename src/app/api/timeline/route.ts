import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const items = await prisma.timelineItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const count = await prisma.timelineItem.count();
    
    const item = await prisma.timelineItem.create({
      data: {
        time: body.time,
        title: body.title,
        description: body.description,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : count,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (Array.isArray(body)) {
      // Bulk update (reorder)
      const updates = body.map((item: any) =>
        prisma.timelineItem.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
          },
        })
      );
      
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true, count: updates.length });
    } else {
      // Single update (edit item)
      const { id, time, title, description, sortOrder } = body;
      const item = await prisma.timelineItem.update({
        where: { id },
        data: { time, title, description, sortOrder },
      });
      return NextResponse.json(item);
    }
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.timelineItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Determine initial status based on startDate
function determineStatus(startDate: string | null | undefined): string {
  if (!startDate) return 'ACTIVE';
  const start = new Date(startDate);
  const now = new Date();
  return start > now ? 'SCHEDULED' : 'ACTIVE';
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const value = parseInt(body.value?.toString() || '0');
    const limit = parseInt(body.limit?.toString() || '0');

    // === VALIDATION ===
    if (!body.name?.trim()) return NextResponse.json({ error: 'Tên chiến dịch không được để trống.' }, { status: 400 });
    if (!body.code?.trim()) return NextResponse.json({ error: 'Mã khuyến mãi không được để trống.' }, { status: 400 });
    if (!body.startDate) return NextResponse.json({ error: 'Ngày bắt đầu không được để trống.' }, { status: 400 });
    if (!body.endDate) return NextResponse.json({ error: 'Ngày hết hạn không được để trống.' }, { status: 400 });
    
    if (new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json({ error: 'Ngày bắt đầu phải trước ngày hết hạn.' }, { status: 400 });
    }

    if (isNaN(value) || value <= 0) {
      return NextResponse.json({ error: 'Mức giảm phải lớn hơn 0.' }, { status: 400 });
    }

    if (body.type === 'PERCENT' && value >= 100) {
      return NextResponse.json({ error: 'Mức giảm phần trăm không được phép từ 100% trở lên.' }, { status: 400 });
    }

    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy chiến dịch' }, { status: 404 });

    let newStatus = existing.status;
    if (existing.status === 'SCHEDULED' || existing.status === 'ACTIVE') {
      newStatus = determineStatus(body.startDate);
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        code: body.code.toUpperCase().trim(),
        name: body.name.trim(),
        description: body.description?.trim() || null,
        type: body.type,
        value,
        limit,
        status: newStatus,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    if (error?.code === 'P2002') return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
    console.error('Failed to update campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Chiến dịch không tồn tại' }, { status: 404 });
    
    if (existing.limit > 0) return NextResponse.json({ error: 'Chỉ có thể ngừng áp dụng chiến dịch không giới hạn lượt dùng.' }, { status: 400 });
    if (existing.status === 'INACTIVE') return NextResponse.json({ error: 'Chiến dịch này đã ngừng áp dụng.' }, { status: 400 });

    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to deactivate campaign:', error);
    return NextResponse.json({ error: 'Failed to deactivate campaign' }, { status: 500 });
  }
}

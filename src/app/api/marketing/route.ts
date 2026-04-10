import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Auto-transition campaign statuses based on dates and usage
async function autoTransitionStatuses() {
  const now = new Date();

  // 1. SCHEDULED → ACTIVE
  await prisma.campaign.updateMany({
    where: {
      status: 'SCHEDULED',
      startDate: { not: null, lte: now },
    },
    data: { status: 'ACTIVE' },
  });

  // 2. ACTIVE → EXPIRED
  await prisma.campaign.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { not: null, lt: now },
    },
    data: { status: 'EXPIRED' },
  });

  // 3. ACTIVE → USED_UP
  const activeLimitCampaigns = await prisma.campaign.findMany({
    where: {
      status: 'ACTIVE',
      limit: { gt: 0 },
    },
  });

  for (const c of activeLimitCampaigns) {
    if (c.used >= c.limit) {
      await prisma.campaign.update({
        where: { id: c.id },
        data: { status: 'USED_UP' },
      });
    }
  }
}

// Determine initial status based on startDate
function determineStatus(startDate: string | null | undefined): string {
  if (!startDate) return 'ACTIVE';
  const start = new Date(startDate);
  const now = new Date();
  return start > now ? 'SCHEDULED' : 'ACTIVE';
}

export async function GET(req: Request) {
  try {
    await autoTransitionStatuses();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const campaigns = await prisma.campaign.findMany({
      where: status && status !== 'ALL' ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const status = determineStatus(body.startDate);

    const campaign = await prisma.campaign.create({
      data: {
        code: body.code.toUpperCase().trim(),
        name: body.name.trim(),
        description: body.description?.trim() || null,
        type: body.type,
        value,
        limit,
        status,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

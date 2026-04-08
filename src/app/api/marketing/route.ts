import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Auto-transition expired/used-up campaigns
async function autoTransitionStatuses() {
  const now = new Date();

  // Mark campaigns as EXPIRED if endDate has passed
  await prisma.campaign.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { not: null, lt: now },
    },
    data: { status: 'EXPIRED' },
  });

  // Mark campaigns as USED_UP if limit > 0 and used >= limit
  const usedUp = await prisma.campaign.findMany({
    where: {
      status: 'ACTIVE',
      limit: { gt: 0 },
    },
  });

  for (const c of usedUp) {
    if (c.used >= c.limit) {
      await prisma.campaign.update({
        where: { id: c.id },
        data: { status: 'USED_UP' },
      });
    }
  }
}

export async function GET(req: Request) {
  try {
    // Auto-transition before returning data
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
    const campaign = await prisma.campaign.create({
      data: {
        code: body.code.toUpperCase(),
        name: body.name,
        description: body.description,
        type: body.type,
        value: parseInt(body.value?.toString() || '0'),
        limit: parseInt(body.limit?.toString() || '0'),
        status: body.status || 'ACTIVE',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
    }
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

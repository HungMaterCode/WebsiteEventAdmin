import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Vui lòng nhập mã giảm giá' }, { status: 400 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Mã giảm giá không tồn tại' }, { status: 404 });
    }

    // Auto-transition: check if expired by date
    const now = new Date();
    if (campaign.status === 'ACTIVE' && campaign.endDate && now > campaign.endDate) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 });
    }

    // Auto-transition: check if used up
    if (campaign.status === 'ACTIVE' && campaign.limit > 0 && campaign.used >= campaign.limit) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: 'USED_UP' },
      });
      return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng' }, { status: 400 });
    }

    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Mã giảm giá hiện không khả dụng' }, { status: 400 });
    }

    if (campaign.startDate && now < campaign.startDate) {
      return NextResponse.json({ error: 'Mã giảm giá chưa được áp dụng' }, { status: 400 });
    }

    return NextResponse.json({
      code: campaign.code,
      type: campaign.type,
      value: campaign.value,
      name: campaign.name
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Lỗi kiểm tra mã giảm giá' }, { status: 500 });
  }
}

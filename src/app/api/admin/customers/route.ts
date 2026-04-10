import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const rank = searchParams.get('rank');
    const status = searchParams.get('status');

    // Lấy danh sách khách hàng (role: USER)
    const customers = await prisma.user.findMany({
      where: {
        role: 'USER',
        rank: rank && rank !== 'ALL' ? (rank as any) : undefined,
        status: status && status !== 'ALL' ? (status as any) : undefined,
        OR: query ? [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        bookings: {
          where: { status: 'SUCCESS' },
          select: { totalPrice: true },
        },
        _count: {
          select: { bookings: true },
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Tính toán và định dạng dữ liệu cho từng khách hàng
    const formattedCustomers = customers.map(user => {
      const totalSpent = user.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
      return {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone || 'Chưa cập nhật',
        totalSpent: totalSpent.toLocaleString('vi-VN') + ' VNĐ',
        rawTotalSpent: totalSpent,
        ticketCount: user._count.bookings,
        status: user.status, // ACTIVE / BANNED
        rank: user.rank, // REGULAR / VIP
        lastActive: user.updatedAt.toISOString().split('T')[0],
      };
    });

    // Thống kê tổng quan
    const totalCount = await prisma.user.count({ where: { role: 'USER' } });
    const vipCount = await prisma.user.count({ where: { role: 'USER', rank: 'VIP' } });
    const lockedCount = await prisma.user.count({ where: { role: 'USER', status: 'BANNED' } });

    return NextResponse.json({
      customers: formattedCustomers,
      stats: { totalCount, vipCount, lockedCount }
    });
  } catch (error) {
    console.error('[API_CUSTOMERS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, status, rank, phone } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        status,
        rank,
        phone,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[API_CUSTOMERS_PATCH]', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

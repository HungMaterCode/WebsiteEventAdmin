import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') === '30' ? 30 : 7;
    const session = await auth();
    
    // 1. Total Revenue (Global)
    const revenueResult = await prisma.booking.aggregate({
      where: { status: 'SUCCESS' },
      _sum: {
        totalPrice: true,
      },
    });

    // 2. Total Tickets (Global)
    const ticketsResult = await prisma.booking.aggregate({
      where: { status: 'SUCCESS' },
      _sum: {
        quantity: true,
      },
    });

    // 2.1 Total Participants (Actually Checked-In)
    const participantsResult = await prisma.booking.aggregate({
      where: {
        status: 'SUCCESS',
        NOT: {
          checkInTime: null,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    // 3. Check-in Rate (Global)
    const totalBookings = await prisma.booking.count({
      where: { status: 'SUCCESS' }
    });
    const checkedInBookings = await prisma.booking.count({
      where: {
        status: 'SUCCESS',
        NOT: {
          checkInTime: null,
        },
      },
    });

    const checkInRate = totalBookings > 0 
      ? Math.round((checkedInBookings / totalBookings) * 100) 
      : 0;

    // 3.1 Total Transactions (Global)
    const totalTransactions = await prisma.transaction.count();

    // 4. Ticket Distribution (Global)
    const ticketTypes = await prisma.booking.groupBy({
      by: ['ticketType'],
      where: { status: 'SUCCESS' },
      _sum: {
        quantity: true,
      },
    });

    // 5. Trend based on selected range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const periodBookings = await prisma.booking.findMany({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        totalPrice: true,
        quantity: true,
      },
    });

    // Process trend data
    const trendData = Array.from({ length: range }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (range - 1 - i));
      
      // For 30 days, we might want to skip some labels or show dates, 
      // but let's keep it consistent for now.
      const dateStr = range === 30 
        ? `${date.getDate()}/${date.getMonth() + 1}`
        : date.toLocaleDateString('vi-VN', { weekday: 'short' });
      
      const dayTotal = periodBookings
        .filter(b => b.createdAt.toDateString() === date.toDateString())
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      const dayQuantity = periodBookings
        .filter(b => b.createdAt.toDateString() === date.toDateString())
        .reduce((sum, b) => sum + (b.quantity || 0), 0);
      
      return { 
        day: dateStr, 
        revenue: dayTotal / 1000000,
        quantity: dayQuantity,
        fullDate: date.toLocaleDateString('vi-VN')
      };
    });

    const result = {
      totalRevenue: revenueResult._sum.totalPrice || 0,
      totalTickets: ticketsResult._sum.quantity || 0,
      totalParticipants: participantsResult._sum.quantity || 0,
      totalTransactions: totalTransactions,
      checkInRate: checkInRate,
      ticketDistribution: ticketTypes.map(t => ({
        name: t.ticketType,
        value: t._sum.quantity || 0,
        color: t.ticketType === 'VIP' ? '#FF0088' : (t.ticketType === 'GA' ? '#00FFFF' : '#E6C753')
      })),
      revenueTrend: trendData,
      currentRange: range
    };


    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

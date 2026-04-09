import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { startOfDay, subDays, eachDayOfInterval, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Basic auth check logic here
    
    const { searchParams } = new URL(req.url);
    const range = parseInt(searchParams.get('range') || '7');
    
    const startDate = startOfDay(subDays(new Date(), range - 1));

    // 1. All Bookings in the interval (excluding CANCELLED if requested, but let's keep all for now per default unless user said otherwise)
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        ticketStatus: { not: 'CANCELLED' } // Standard: only non-cancelled bookings count for revenue
      },
    });

    // 2. Summary by Ticket Type
    const typeSummary = await prisma.booking.groupBy({
      by: ['ticketType'],
      where: {
        createdAt: { gte: startDate },
        ticketStatus: { not: 'CANCELLED' }
      },
      _sum: { totalPrice: true, quantity: true },
      _count: { id: true }
    });

    // 3. Source Summary (Web vs Counter)
    // Assuming 'ticket-admin@event.com' is the counter email
    const counterBookings = bookings.filter(b => b.email === 'ticket-admin@event.com');
    const webBookings = bookings.filter(b => b.email !== 'ticket-admin@event.com');

    const sourceData = [
      { name: 'Website', value: webBookings.reduce((sum, b) => sum + b.quantity, 0) },
      { name: 'Tại quầy', value: counterBookings.reduce((sum, b) => sum + b.quantity, 0) }
    ];

    // 4. Capacity Monitor
    const zones = await prisma.zone.findMany();

    // 5. Trend Analysis (Multi-line)
    const days = eachDayOfInterval({ start: startDate, end: new Date() });
    const trends = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayBookings = bookings.filter(b => format(b.createdAt, 'yyyy-MM-dd') === dayStr);
      
      const vipRevenue = dayBookings
        .filter(b => b.ticketType === 'VIP')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const gaRevenue = dayBookings
        .filter(b => b.ticketType === 'GA')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return {
        date: format(day, range > 7 ? 'MM/dd' : 'EEE'),
        fullDate: dayStr,
        VIP: vipRevenue / 1000000,
        GA: gaRevenue / 1000000,
        total: (vipRevenue + gaRevenue) / 1000000
      };
    });

    // Calculate AOV and Velocity
    const totalRev = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const aov = bookings.length > 0 ? totalRev / bookings.length : 0;
    const velocity = bookings.reduce((sum, b) => sum + b.quantity, 0) / range;

    return NextResponse.json({
      typeSummary,
      sourceData,
      zones,
      trends,
      stats: {
        aov,
        velocity,
        totalRevenue: totalRev,
        totalTickets: bookings.reduce((sum, b) => sum + b.quantity, 0)
      }
    });
  } catch (error: any) {
    console.error('Tickets Revenue API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

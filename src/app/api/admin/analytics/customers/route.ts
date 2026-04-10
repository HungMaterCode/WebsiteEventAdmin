import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Auth check here
    
    // 1. Fetch all bookings excluding cancelled
    const bookings = await prisma.booking.findMany({
      where: { ticketStatus: { not: 'CANCELLED' } },
      select: {
        email: true,
        name: true,
        totalPrice: true,
        quantity: true,
        createdAt: true
      }
    });

    // 2. Aggregate by Email
    const customerMap = new Map();

    bookings.forEach(b => {
      const email = b.email.toLowerCase();
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email,
          name: b.name,
          totalSpend: 0,
          totalTickets: 0,
          bookingCount: 0,
          firstBooking: b.createdAt,
          lastBooking: b.createdAt
        });
      }

      const c = customerMap.get(email);
      c.totalSpend += b.totalPrice;
      c.totalTickets += b.quantity;
      c.bookingCount += 1;
      if (b.createdAt < c.firstBooking) c.firstBooking = b.createdAt;
      if (b.createdAt > c.lastBooking) c.lastBooking = b.createdAt;
    });

    const customers = Array.from(customerMap.values()).map(c => {
      // Classification Logic
      let segment = 'Thành viên';
      let color = '#8A8F98';

      if (c.totalSpend >= 10000000) {
        segment = 'Kim cương';
        color = '#00FFFF';
      } else if (c.totalSpend >= 5000000) {
        segment = 'Vàng';
        color = '#E6C753';
      } else if (c.totalTickets / c.bookingCount >= 4) {
        segment = 'Khách đoàn';
        color = '#00C099';
      } else if (c.bookingCount > 1) {
        segment = 'Thân thiết';
        color = '#FF0088';
      }

      return { ...c, segment, color };
    });

    // 3. Overall Stats
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpend, 0);
    const arpu = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const returningCount = customers.filter(c => c.bookingCount > 1).length;
    const returningRate = totalCustomers > 0 ? (returningCount / totalCustomers) * 100 : 0;

    // 4. Segment Distribution
    const segments = ['Kim cương', 'Vàng', 'Khách đoàn', 'Thân thiết', 'Thành viên'];
    const segmentData = segments.map(name => ({
      name,
      value: customers.filter(c => c.segment === name).length
    })).filter(s => s.value > 0);

    // 5. Sorted Top Customers
    const topCustomers = [...customers]
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 20);

    return NextResponse.json({
      stats: {
        totalCustomers,
        arpu,
        returningRate: returningRate.toFixed(1),
        avgTicketsPerCustomer: totalCustomers > 0 ? (customers.reduce((sum, c) => sum + c.totalTickets, 0) / totalCustomers).toFixed(1) : 0
      },
      segmentData,
      topCustomers
    });
  } catch (error: any) {
    console.error('Customer Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

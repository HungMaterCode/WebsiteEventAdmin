import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    // In a real app, you'd check if the user is an ADMIN
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const transactions = await prisma.transaction.findMany({
      include: {
        booking: {
          select: {
            name: true,
            bookingCode: true,
            ticketType: true,
            quantity: true,
            totalPrice: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Calculate Stats
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const bookings = await prisma.booking.findMany({
      where: { status: 'SUCCESS' }
    });
    
    const revenueToday = bookings
      .filter(b => new Date(b.createdAt) >= startOfToday)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const gaTickets = bookings
      .filter(b => b.ticketType === 'GA')
      .reduce((sum, b) => sum + b.quantity, 0);

    const vipTickets = bookings
      .filter(b => b.ticketType === 'VIP')
      .reduce((sum, b) => sum + b.quantity, 0);

    const totalOrders = bookings.length;

    // Formatting for the frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id, // Use full ID as the unique key
      displayId: tx.id.substring(0, 8).toUpperCase(), // Shorten ID for display
      type: tx.booking?.ticketType ? `${tx.booking.ticketType} Mua vé` : 'Giao dịch',
      customer: tx.booking?.name || 'Khách vãng lai',
      amount: tx.amount,
      gateway: tx.method,
      status: tx.status,
      time: tx.timestamp,
      bookingCode: tx.booking?.bookingCode || null,
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      stats: {
        revenueToday,
        totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
        gaTickets,
        vipTickets,
        totalOrders
      }
    });
  } catch (error: any) {
    console.error('API Transactions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

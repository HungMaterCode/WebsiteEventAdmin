import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST() {
  try {
    const session = await auth();
    
    // Fetch all relevant bookings
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['SUCCESS', 'PAID', 'COMPLETED', 'PENDING', 'CREATED'] }
      },
      include: {
        lotoTickets: true
      }
    });

    let ticketsCreated = 0;
    
    for (const booking of bookings) {
      const needed = booking.quantity || 1; // Default to 1 if missing
      const current = booking.lotoTickets.length;
      
      if (current < needed) {
        for (let i = current; i < needed; i++) {
          const numbers: number[] = [];
          while (numbers.length < 5) {
            const n = Math.floor(Math.random() * 75) + 1;
            if (!numbers.includes(n)) {
              numbers.push(n);
            }
          }
          numbers.sort((a, b) => a - b);

          // Generate unique ticket code
          const ticketCode = `${booking.bookingCode}-${i + 1}`;
          
          await prisma.lotoTicket.upsert({
            where: { ticketCode },
            update: {}, // Don't change if exists
            create: {
              bookingId: booking.id,
              numbers,
              ticketCode
            }
          });
          ticketsCreated++;
        }
      }
    }

    return NextResponse.json({ success: true, count: ticketsCreated, totalBookings: bookings.length });
  } catch (error: any) {
    console.error('[LOTO_ASSIGN]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

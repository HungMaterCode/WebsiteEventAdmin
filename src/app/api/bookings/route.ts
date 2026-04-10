import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendTicketEmail } from '@/lib/email';
import { auth } from '@/lib/auth';

function generateBookingCode() {
  const prefix = 'NH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    console.log('--- BOOKING REQUEST BODY ---', body);
    
    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bookingCode = generateBookingCode();
    
    // Create the booking record and transaction in a single database transaction
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId: (session?.user as any)?.id || null,
          name: body.name,
          email: body.email || 'ticket-admin@event.com',
          phone: body.phone || '',
          ticketType: body.ticketType || 'GA',
          quantity: parseInt(body.quantity?.toString() || '1'),
          totalPrice: parseFloat(body.totalPrice?.toString() || '0'),
          discountCode: body.discountCode || null,
          discountAmount: parseFloat(body.discountAmount?.toString() || '0'),
          ticketStatus: 'SUCCESS', // Set to SUCCESS as per current workflow
          accessories: body.accessories || [],
          status: 'PENDING', // Base status from Gia Lac branch
        },
      });

      // 1. Increment campaign usage if a code was applied
      if (body.discountCode) {
        await tx.campaign.update({
          where: { code: body.discountCode.toUpperCase() },
          data: { used: { increment: 1 } },
        });
      }

      // 2. Create a transaction record linked to this booking
      await tx.transaction.create({
        data: {
          method: body.paymentMethod || 'UNKNOWN',
          amount: booking.totalPrice,
          status: 'Thành công',
          bookingId: booking.id,
        }
      });

      return booking;
    });

    const booking = result;
    console.log('--- BOOKING & TRANSACTION CREATED ---', booking.bookingCode);

    // Send confirmation email
    let emailStatus = { sent: false, error: null as any };
    try {
      const emailResult = await sendTicketEmail({
        bookingCode,
        name: booking.name,
        email: booking.email,
        ticketType: booking.ticketType,
        quantity: booking.quantity,
        totalPrice: booking.totalPrice,
      });
      
      if (emailResult.success) {
        emailStatus.sent = true;
        console.log('--- EMAIL DISPATCHED SUCCESSFULLY ---');
      } else {
        emailStatus.error = emailResult.error;
        console.error('--- EMAIL DISPATCH RETURNED ERROR ---', emailResult.error);
      }
    } catch (err: any) {
      emailStatus.error = err.message || err;
      console.error('--- EMAIL DISPATCH EXCEPTION ---', err);
    }

    return NextResponse.json({
      ...booking,
      debug: {
        emailSent: emailStatus.sent,
        emailError: emailStatus.error,
        receivedMethod: body.paymentMethod
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('--- BOOKING ERROR ---', error.message || error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

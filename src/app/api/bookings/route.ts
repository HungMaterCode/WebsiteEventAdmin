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
    
    // Create the booking record
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: (session?.user as any)?.id || null,
        name: body.name,
        email: body.email || 'ticket-admin@event.com',
        phone: body.phone || '',
        ticketType: body.ticketType || 'GA',
        quantity: parseInt(body.quantity?.toString() || '1'),
        totalPrice: parseInt(body.totalPrice?.toString() || '0'),
        ticketStatus: 'CREATED',
        accessories: body.accessories || [],
      },
    });

    console.log('--- BOOKING CREATED ---', booking.bookingCode);

    // Send confirmation email asynchronously
    sendTicketEmail({
      bookingCode,
      name: booking.name,
      email: booking.email,
      ticketType: booking.ticketType,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice,
    }).catch(err => console.error('Background email dispatch failed:', err));

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('--- BOOKING ERROR ---', error.message || error);
    // Explicitly return JSON even on severe errors
    return new Response(JSON.stringify({ error: error.message || 'Failed to create booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const body = await req.json();
    const bookingCode = generateBookingCode();
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        name: body.name,
        email: body.email,
        phone: body.phone,
        ticketType: body.ticketType,
        quantity: body.quantity,
        totalPrice: body.totalPrice,
        status: 'PENDING',
        ticketStatus: 'CREATED',
        accessories: body.accessories || [],
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

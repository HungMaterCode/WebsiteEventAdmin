import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

function generateBookingCode() {
  const prefix = 'NH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

interface SessionUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as SessionUser | undefined;
    const userRole = user?.role;
    const userEmail = user?.email;

    if (!userEmail) {
      return NextResponse.json([], { status: 200 });
    }

    // Admins see everything, users see only their own
    const whereClause = userRole === 'ADMIN' ? {} : { email: userEmail };

    const bookings = await prisma.booking.findMany({ 
      where: whereClause,
      orderBy: { createdAt: 'desc' }, 
      take: 100 
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
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

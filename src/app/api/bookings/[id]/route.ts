import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Search by bookingCode or by id
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingCode: id },
          { id: id },
        ],
      },
    });
    if (!booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const booking = await prisma.booking.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET specific booking (optional but useful)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to update booking details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        ticketType: body.ticketType,
        ticketStatus: body.ticketStatus,
        quantity: body.quantity ? parseInt(body.quantity.toString()) : undefined,
        totalPrice: body.totalPrice ? parseInt(body.totalPrice.toString()) : undefined,
      },
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE to remove booking
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await prisma.booking.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

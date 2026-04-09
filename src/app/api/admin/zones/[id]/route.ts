import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Following the new Next.js Promise pattern mentioned in conversation history
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const zoneId = parseInt(id);
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedZone = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        name: body.name,
        capacity: body.capacity ? parseInt(body.capacity.toString()) : undefined,
        booked: body.booked !== undefined ? parseInt(body.booked.toString()) : undefined,
        status: body.status
      }
    });

    return NextResponse.json(updatedZone);
  } catch (error: any) {
    console.error('Zone PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zoneId = parseInt(id);
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.zone.delete({
      where: { id: zoneId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Zone DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

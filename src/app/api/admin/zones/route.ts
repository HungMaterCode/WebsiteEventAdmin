import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    // Basic auth check can be added here if needed
    
    const zones = await prisma.zone.findMany({
      orderBy: { id: 'asc' }
    });
    
    return NextResponse.json(zones);
  } catch (error: any) {
    console.error('Zones GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    
    if (!body.name || !body.capacity) {
      return NextResponse.json({ error: 'Missing name or capacity' }, { status: 400 });
    }

    const zone = await prisma.zone.create({
      data: {
        name: body.name,
        capacity: parseInt(body.capacity.toString()),
        booked: parseInt(body.booked?.toString() || '0'),
        status: body.status || 'ACTIVE'
      }
    });

    return NextResponse.json(zone, { status: 201 });
  } catch (error: any) {
    console.error('Zones POST Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create zone', 
      details: error.message || 'Unknown error' 
    }, { status: 500 });
  }
}

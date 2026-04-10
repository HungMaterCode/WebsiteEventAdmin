import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !['ADMIN', 'SALES', 'CHECKIN'].includes(session.user?.role as string)) {
        // Return 401 if unauthorized in production
    }
    
    // Get game state
    let game = await prisma.lotoGame.findUnique({
      where: { id: 'active_game' }
    });
    
    if (!game) {
      game = await prisma.lotoGame.create({
        data: { id: 'active_game', drawnNumbers: [] }
      });
    }

    // Get all tickets from all valid bookings
    const tickets = await prisma.lotoTicket.findMany({
      include: {
        booking: {
          select: {
            name: true,
            bookingCode: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      drawnNumbers: game.drawnNumbers,
      players: tickets.map(t => ({
        id: t.id,
        name: t.booking?.name || 'Vô danh',
        ticket: t.ticketCode,
        bookingCode: t.booking?.bookingCode,
        card: t.numbers,
        matched: t.numbers.filter(n => game?.drawnNumbers.includes(n))
      }))
    });
  } catch (error: any) {
    console.error('[LOTO_GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    
    let game = await prisma.lotoGame.findUnique({
      where: { id: 'active_game' }
    });
    
    if (!game) {
      game = await prisma.lotoGame.create({
        data: { id: 'active_game', drawnNumbers: [] }
      });
    }

    if (game.drawnNumbers.length >= 75) {
      return NextResponse.json({ error: 'All numbers drawn' }, { status: 400 });
    }

    // Find a number that hasn't been drawn
    let newNumber;
    const allPossible = Array.from({ length: 75 }, (_, i) => i + 1);
    const available = allPossible.filter(n => !game?.drawnNumbers.includes(n));
    
    if (available.length === 0) {
      return NextResponse.json({ error: 'No numbers left' }, { status: 400 });
    }

    newNumber = available[Math.floor(Math.random() * available.length)];

    const updatedGame = await prisma.lotoGame.update({
      where: { id: 'active_game' },
      data: {
        drawnNumbers: {
          push: newNumber
        }
      }
    });

    return NextResponse.json({ newNumber, drawnNumbers: updatedGame.drawnNumbers });
  } catch (error: any) {
    console.error('[LOTO_POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    
    await prisma.lotoGame.update({
      where: { id: 'active_game' },
      data: { drawnNumbers: [] }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[LOTO_DELETE]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { startOfDay, subDays, eachHourOfInterval, format, differenceInMinutes, startOfHour } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Basic auth check
    
    const { searchParams } = new URL(req.url);
    const range = parseInt(searchParams.get('range') || '1'); // Default to 1 day for flow analysis
    
    const startDate = startOfDay(subDays(new Date(), range - 1));

    // 1. Fetch all bookings with at least a checkInTime
    const attendees = await prisma.booking.findMany({
      where: {
        checkInTime: { not: null },
        ticketStatus: { not: 'CANCELLED' }
      },
      select: {
        id: true,
        ticketType: true,
        checkInTime: true,
        checkOutTime: true
      }
    });

    // 2. Calculate Global Stats
    const totalIn = attendees.length;
    const totalOut = attendees.filter(a => a.checkOutTime).length;
    const currentlyPresent = totalIn - totalOut;
    
    // Average Stay Duration
    const completedStays = attendees.filter(a => a.checkInTime && a.checkOutTime);
    const totalMinutes = completedStays.reduce((sum, a) => {
      return sum + differenceInMinutes(new Date(a.checkOutTime!), new Date(a.checkInTime!));
    }, 0);
    const avgStayMinutes = completedStays.length > 0 ? totalMinutes / completedStays.length : 0;

    // 3. Hourly Flow Analysis
    // We'll define a window (e.g., from 8 AM to Midnight of the current day or based on range)
    const hours = eachHourOfInterval({
      start: startOfDay(new Date()),
      end: new Date() // Up to now
    });

    const hourlyData = hours.map(hour => {
      const hStr = format(hour, 'HH:00');
      const nextH = new Date(hour.getTime() + 60 * 60 * 1000);
      
      const ins = attendees.filter(a => a.checkInTime! >= hour && a.checkInTime! < nextH).length;
      const outs = attendees.filter(a => a.checkOutTime && a.checkOutTime >= hour && a.checkOutTime < nextH).length;
      
      // Calculate total present at this specific hour
      const presentAtHour = attendees.filter(a => 
        a.checkInTime! < nextH && (!a.checkOutTime || a.checkOutTime >= nextH)
      ).length;

      return {
        time: hStr,
        entries: ins,
        exits: outs,
        occupancy: presentAtHour
      };
    });

    // 4. Breakdown by Type
    const typeStats = await prisma.booking.groupBy({
      by: ['ticketType'],
      _count: {
        id: true,
        checkInTime: true
      }
    });

    return NextResponse.json({
      summary: {
        totalIn,
        totalOut,
        currentlyPresent,
        avgStayMinutes,
        avgStayHours: (avgStayMinutes / 60).toFixed(1)
      },
      hourlyData,
      typeStats: typeStats.map(s => ({
        type: s.ticketType,
        total: s._count.id,
        checkedIn: s._count.checkInTime,
        rate: s._count.id > 0 ? ((s._count.checkInTime / s._count.id) * 100).toFixed(1) : 0
      }))
    });
  } catch (error: any) {
    console.error('Checkin Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

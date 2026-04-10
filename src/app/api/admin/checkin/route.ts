import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendSurveyEmail } from '@/lib/email';

export async function GET() {
  try {
    const session = await auth();
    // Basic auth check can be added
    
    // 1. Fetch Stats
    const totalTickets = await prisma.booking.count({
      where: { ticketStatus: { not: 'CANCELLED' } }
    });
    
    const checkedInCount = await prisma.booking.count({
      where: { checkInTime: { not: null }, ticketStatus: { not: 'CANCELLED' } }
    });
    
    const checkedOutCount = await prisma.booking.count({
      where: { checkOutTime: { not: null }, ticketStatus: { not: 'CANCELLED' } }
    });

    const errorCount = await prisma.auditLog.count({
      where: { module: 'CHECKIN', action: 'ERROR' }
    });

    // 2. Fetch Recent Logs (20)
    // We'll use AuditLog if we have it, or just query Bookings ordered by checkInTime/checkOutTime
    // Let's use Bookings for simplicity of mapping to names
    const recentCheckins = await prisma.booking.findMany({
      where: {
        OR: [
          { checkInTime: { not: null } },
          { checkOutTime: { not: null } }
        ]
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    return NextResponse.json({
      stats: {
        totalTickets,
        checkedIn: checkedInCount,
        checkedOut: checkedOutCount,
        currentlyPresent: checkedInCount - checkedOutCount,
        errorCount
      },
      logs: recentCheckins.map(b => ({
        id: b.id,
        bookingCode: b.bookingCode,
        guestName: b.name,
        type: b.ticketType,
        checkInTime: b.checkInTime,
        checkOutTime: b.checkOutTime,
        updatedAt: b.updatedAt
      }))
    });
  } catch (error: any) {
    console.error('Checkin GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { code, mode } = await req.json(); // mode: 'IN' | 'OUT'

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: code.trim() }
    });

    if (!booking) {
      // Log error
      await prisma.auditLog.create({
        data: {
          userId: session?.user?.id || 'SYSTEM',
          userEmail: session?.user?.email || 'system@event.com',
          module: 'CHECKIN',
          action: 'ERROR',
          actionDetails: `Code not found: ${code}`
        } as any // AuditLog schema in my previous view had these
      }).catch(() => {});
      
      return NextResponse.json({ error: 'Mã vé không tồn tại trong hệ thống' }, { status: 404 });
    }

    if (booking.ticketStatus === 'CANCELLED') {
      return NextResponse.json({ error: 'Vé này đã bị hủy, không thể sử dụng' }, { status: 400 });
    }

    if (mode === 'IN') {
      if (booking.checkInTime) {
        return NextResponse.json({ 
          error: 'Vé này đã được Check-in trước đó',
          guestName: booking.name,
          time: booking.checkInTime 
        }, { status: 400 });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { checkInTime: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: 'Check-in thành công!',
        guestName: updated.name,
        type: updated.ticketType,
        time: updated.checkInTime
      });
    } else {
      // mode === 'OUT'
      if (!booking.checkInTime) {
        return NextResponse.json({ error: 'Khách hàng chưa thực hiện Check-in lối vào' }, { status: 400 });
      }
      
      if (booking.checkOutTime) {
        return NextResponse.json({ 
          error: 'Vé này đã được Check-out trước đó',
          guestName: booking.name,
          time: booking.checkOutTime 
        }, { status: 400 });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { checkOutTime: new Date() }
      });

      // Send survey email in background
      if (updated.email) {
        sendSurveyEmail({
          bookingCode: updated.bookingCode,
          name: updated.name,
          email: updated.email
        }).catch(err => console.error('Background survey email failed:', err));
      }

      return NextResponse.json({
        success: true,
        message: 'Check-out thành công!',
        guestName: updated.name,
        type: updated.ticketType,
        time: updated.checkOutTime
      });
    }
  } catch (error: any) {
    console.error('Checkin POST Error:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}

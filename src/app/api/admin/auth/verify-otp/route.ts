import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Không tìm thấy phiên đăng nhập' }, { status: 401 });
    }

    const { otp } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.otpCode || !user.otpExpires) {
      return NextResponse.json({ error: 'Yêu cầu xác thực không hợp lệ' }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ error: 'Mã xác thực đã hết hạn' }, { status: 400 });
    }

    if (user.otpCode !== otp) {
      return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 });
    }

    // Success: Clear OTP from DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

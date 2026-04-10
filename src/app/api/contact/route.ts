import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/lib/auth";

// API route for contact form submissions

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để thực hiện hành động này.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { message: msg, content, subject, phone } = body;
    const finalMessage = msg || content;
    
    // Use session data for name and email for security
    const name = session.user.name || body.name;
    const email = session.user.email || body.email;

    // Basic validation
    if (!name || !email || !phone || !finalMessage) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits starting with 0)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ. Phải gồm 10 chữ số và bắt đầu bằng số 0.' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        message: finalMessage,
        subject: subject || 'Liên hệ từ Website',
      },
    });

    return NextResponse.json(
      { message: 'Gửi tin nhắn thành công!', data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra khi gửi tin nhắn.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API route for contact form submissions

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, content } = body;

    // Basic validation
    if (!name || !email || !phone || !content) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        content,
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

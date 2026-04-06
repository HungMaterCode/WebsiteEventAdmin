import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = await prisma.message.create({
      data: { name: body.name, email: body.email, subject: body.subject, message: body.message },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

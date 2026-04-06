import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const faq = await prisma.faq.create({
      data: { question: body.question, answer: body.answer, category: body.category, sortOrder: body.sortOrder || 0 },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

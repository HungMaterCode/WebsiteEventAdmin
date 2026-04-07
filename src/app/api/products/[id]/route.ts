import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        description: body.description,
        image: body.image,
        category: body.category,
        price: body.price,
        stock: body.stock || 0
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('API Update Error:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('API Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}

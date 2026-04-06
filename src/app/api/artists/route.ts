import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const artist = await prisma.artist.create({
      data: { name: body.name, slug, genre: body.genre, image: body.image, performanceTime: body.performanceTime, bio: body.bio, sortOrder: body.sortOrder || 0 },
    });
    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
  }
}

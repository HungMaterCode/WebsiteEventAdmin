import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await prisma.landingPageSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.landingPageSettings.create({
        data: {
          id: 1,
          title: "Dòng Chảy Di Sản Bế Mạc Festival Ninh Bình",
          subtitle: "Neon Heritage Festival",
          eventDate: new Date("2024-12-31T20:00:00Z"),
          location: "Thung Nham, Ninh Bình",
          timeRange: "20:00 - 00:30"
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching landing page settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title, subtitle, eventDate, location, timeRange,
      videoUrl, videoTitle, videoSubtitle,
      artTitle, artSubtitle, artDescription, artImage, artItems,
      galleryTitle, gallerySubtitle,
      timelineTitle, timelineSubtitle,
      travelTitle, travelSubtitle, travelDescription, travelImage, travelAdvice, travelItems,
      mapTitle, mapSubtitle, mapAddress, mapDescription, mapGoogleUrl
    } = body;

    const updatedSettings = await prisma.landingPageSettings.upsert({
      where: { id: 1 },
      update: {
        title,
        subtitle,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        location,
        timeRange,
        videoUrl,
        videoTitle,
        videoSubtitle,
        artTitle,
        artSubtitle,
        artDescription,
        artImage,
        artItems,
        galleryTitle,
        gallerySubtitle,
        timelineTitle,
        timelineSubtitle,
        travelTitle,
        travelSubtitle,
        travelDescription,
        travelImage,
        travelAdvice,
        travelItems,
        mapTitle,
        mapSubtitle,
        mapAddress,
        mapDescription,
        mapGoogleUrl
      },
      create: {
        id: 1,
        title,
        subtitle,
        eventDate: eventDate ? new Date(eventDate) : new Date("2024-12-31T20:00:00Z"),
        location,
        timeRange,
        videoUrl,
        videoTitle,
        videoSubtitle,
        artTitle,
        artSubtitle,
        artDescription,
        artImage,
        artItems,
        galleryTitle,
        gallerySubtitle,
        timelineTitle,
        timelineSubtitle,
        travelTitle,
        travelSubtitle,
        travelDescription,
        travelImage,
        travelAdvice,
        travelItems,
        mapTitle,
        mapSubtitle,
        mapAddress,
        mapDescription,
        mapGoogleUrl
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        userEmail: session.user?.email || 'unknown',
        action: 'UPDATE_LANDING_PAGE_SETTINGS',
        module: 'LandingPage',
      }
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating landing page settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

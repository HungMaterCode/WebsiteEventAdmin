import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[API] GET /api/settings/system triggered');
  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 'global' },
    });

    return NextResponse.json(settings?.data || { maintenanceMode: false });
  } catch (error) {
    console.error('[API] Error fetching system settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', maintenanceMode: false }, 
      { status: 500 }
    );
  }
}

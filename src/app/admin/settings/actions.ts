'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function createAuditLog(action: string, module: string) {
  try {
    const session = await auth();
    if (session?.user) {
      await prisma.auditLog.create({
        data: {
          userId: (session.user as any).id || 'unknown',
          userEmail: session.user.email || 'unknown',
          action,
          module
        }
      });
    }
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

// Lấy cấu hình hệ thống
export async function getSystemSettings() {
  try {
    const record = await prisma.systemSetting.findUnique({
      where: { id: 'global' }
    });
    
    if (record && record.data) {
      return JSON.parse(JSON.stringify(record.data));
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return {};
  }
}

import { revalidatePath } from 'next/cache';

// Lưu cấu hình hệ thống
export async function updateSystemSettings(data: any) {
  try {
    await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: { data },
      create: {
        id: 'global',
        data
      }
    });

    await createAuditLog('Cập nhật cấu hình hệ thống', 'Settings');

    // Clear cache to reflect changes immediately
    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Error updating system settings:', error);
    return { success: false, error: 'Lỗi khi lưu cấu hình' };
  }
}

// Xóa cache hệ thống thủ công
export async function clearSystemCache() {
  try {
    revalidatePath('/', 'layout');
    await createAuditLog('Xóa bộ nhớ cache hệ thống', 'System');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error: 'Lỗi khi xóa bộ nhớ tạm' };
  }
}

// Xuất toàn bộ dữ liệu cấu hình
export async function exportFullData() {
  try {
    const backup = {
      artists: await prisma.artist.findMany(),
      campaigns: await prisma.campaign.findMany(),
      faqs: await prisma.faq.findMany(),
      zones: await prisma.zone.findMany(),
      landingPage: await prisma.landingPageSettings.findUnique({ where: { id: 1 } }),
      gallery: await prisma.galleryItem.findMany(),
      timeline: await prisma.timelineItem.findMany(),
      surveyQuestions: await prisma.surveyQuestion.findMany(),
      community: await prisma.communityPost.findMany(),
      settings: await getSystemSettings(),
      exportedAt: new Date().toISOString()
    };
    
    await createAuditLog('Xuất dữ liệu dự phòng (Full Backup)', 'System');
    return { success: true, data: backup };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error: 'Lỗi khi xuất dữ liệu' };
  }
}

// Khôi phục toàn bộ dữ liệu cấu hình
export async function restoreFullData(backup: any) {
  try {
    // Sử dụng transaction để đảm bảo dữ liệu toàn vẹn
    await prisma.$transaction(async (tx) => {
      if (backup.artists) {
        await tx.artist.deleteMany();
        await tx.artist.createMany({ data: backup.artists });
      }
      if (backup.campaigns) {
        await tx.campaign.deleteMany();
        await tx.campaign.createMany({ data: backup.campaigns });
      }
      if (backup.faqs) {
        await tx.faq.deleteMany();
        await tx.faq.createMany({ data: backup.faqs });
      }
      if (backup.zones) {
        await tx.zone.deleteMany();
        await tx.zone.createMany({ data: backup.zones });
      }
      if (backup.landingPage) {
        await tx.landingPageSettings.upsert({
          where: { id: 1 },
          update: backup.landingPage,
          create: backup.landingPage
        });
      }
      if (backup.gallery) {
        await tx.galleryItem.deleteMany();
        await tx.galleryItem.createMany({ data: backup.gallery });
      }
      if (backup.timeline) {
        await tx.timelineItem.deleteMany();
        await tx.timelineItem.createMany({ data: backup.timeline });
      }
      if (backup.surveyQuestions) {
        await tx.surveyQuestion.deleteMany();
        await tx.surveyQuestion.createMany({ data: backup.surveyQuestions });
      }
      if (backup.settings) {
        await tx.systemSetting.upsert({
          where: { id: 'global' },
          update: { data: backup.settings },
          create: { id: 'global', data: backup.settings }
        });
      }
    });

    await createAuditLog('Khôi phục dữ liệu từ bản sao lưu', 'System');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error restoring data:', error);
    return { success: false, error: 'Lỗi khi khôi phục dữ liệu: ' + (error as Error).message };
  }
}

// Lấy thông số hệ thống
export async function getSystemStats() {
  try {
    const stats = {
      artists: await prisma.artist.count(),
      bookings: await prisma.booking.count(),
      campaigns: await prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      reviews: await prisma.review.count(),
    };
    return stats;
  } catch (error) {
    return { artists: 0, bookings: 0, campaigns: 0, reviews: 0 };
  }
}

// Lấy nhật ký hoạt động gần đây
export async function getAuditLogs() {
  try {
    return await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });
  } catch (error) {
    return [];
  }
}

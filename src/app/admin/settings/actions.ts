'use server';

import prisma from '@/lib/prisma';

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
    return { success: true };
  } catch (error) {
    console.error('Error updating system settings:', error);
    return { success: false, error: 'Lỗi khi lưu cấu hình' };
  }
}

import { revalidatePath } from 'next/cache';

// Xóa cache hệ thống thủ công
export async function clearSystemCache() {
  try {
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error: 'Lỗi khi xóa bộ nhớ tạm' };
  }
}

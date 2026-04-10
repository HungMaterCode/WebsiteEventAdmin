import React from 'react';
import prisma from '@/lib/prisma';
import ContactManagement from './ContactManagement';

export const metadata = {
  title: 'Quản lý Liên hệ | Admin Dashboard',
};

async function getMessages() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return messages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export default async function AdminContactPage() {
  const messages = await getMessages();

  if (!messages) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-0 text-center">
        <h2 className="text-xl font-bold text-red-500">Không thể kết nối với cơ sở dữ liệu</h2>
        <p className="text-gray-400 mt-2">Vui lòng kiểm tra lại cấu hình kết nối database.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <ContactManagement initialMessages={messages} />
    </div>
  );
}

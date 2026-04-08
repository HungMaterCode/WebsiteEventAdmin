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

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <ContactManagement initialMessages={messages} />
    </div>
  );
}

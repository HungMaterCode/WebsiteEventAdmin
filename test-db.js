const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test creating a message with the NEW fields
    const testMsg = await prisma.message.create({
      data: {
        name: 'Test',
        email: 'test@example.com',
        phone: '123456789',
        content: 'Test content'
      }
    });
    console.log('Successfully created test message:', testMsg);
    
    // Clean up
    await prisma.message.delete({ where: { id: testMsg.id } });
    console.log('Successfully cleaned up test message');
    
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

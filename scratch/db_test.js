const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.zone.count();
    console.log('DB Connection OK, Zones count:', count);
  } catch (err) {
    console.error('DB Connection FAIL:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

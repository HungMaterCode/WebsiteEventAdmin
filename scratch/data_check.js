const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const bookingSummary = await prisma.booking.groupBy({
      by: ['ticketType'],
      _sum: {
        quantity: true,
      },
    });
    console.log('--- BOOKING SUMMARY ---');
    console.log(JSON.stringify(bookingSummary, null, 2));

    const existingZones = await prisma.zone.findMany();
    console.log('--- EXISTING ZONES ---');
    console.log(JSON.stringify(existingZones, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

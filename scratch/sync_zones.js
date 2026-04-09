const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Get booking summary
    const bookingSummary = await prisma.booking.groupBy({
      by: ['ticketType'],
      _sum: {
        quantity: true,
      },
    });

    const vipInfo = bookingSummary.find(s => s.ticketType === 'VIP');
    const gaInfo = bookingSummary.find(s => s.ticketType === 'GA');

    const vipBooked = vipInfo?._sum?.quantity || 0;
    const gaBooked = gaInfo?._sum?.quantity || 0;

    console.log(`Aggregated: VIP=${vipBooked}, GA=${gaBooked}`);

    // 2. Clear existing zones (optional, but since it's empty we just add)
    // Or better: Upsert based on name
    
    await prisma.zone.upsert({
      where: { id: 1 }, // Assuming ID 1 for VIP
      update: {
        name: 'Khu gần sân (VIP)',
        capacity: 500,
        booked: vipBooked,
      },
      create: {
        id: 1,
        name: 'Khu gần sân (VIP)',
        capacity: 500,
        booked: vipBooked,
        status: 'ACTIVE'
      }
    });

    await prisma.zone.upsert({
      where: { id: 2 }, // Assuming ID 2 for GA
      update: {
        name: 'Khu thường (GA)',
        capacity: 2000,
        booked: gaBooked,
      },
      create: {
        id: 2,
        name: 'Khu thường (GA)',
        capacity: 2000,
        booked: gaBooked,
        status: 'ACTIVE'
      }
    });

    console.log('--- ZONES INITIALIZED AND SYNCED ---');
  } catch (error) {
    console.error('Error seeding zones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

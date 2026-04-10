const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      bookingCode: true,
      status: true,
      name: true,
      totalPrice: true,
      createdAt: true
    }
  });

  const statusCount = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  console.log('--- Status Distribution ---');
  console.log(statusCount);

  const nonSuccessBookings = bookings.filter(b => b.status !== 'SUCCESS' && b.status !== 'PAID');
  
  console.log('\n--- Non-Success Bookings ---');
  nonSuccessBookings.forEach(b => {
    console.log(`[${b.status}] Code: ${b.bookingCode} | Name: ${b.name} | Price: ${b.totalPrice} | Date: ${b.createdAt.toISOString()}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

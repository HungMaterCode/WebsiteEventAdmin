const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const transactions = await prisma.transaction.findMany({
    include: {
      booking: true
    }
  });

  console.log('--- Transaction Statistics ---');
  console.log(`Total Transactions in DB: ${transactions.length}`);

  const statusCount = transactions.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  console.log('\n--- Transaction Status Distribution ---');
  console.log(statusCount);

  console.log('\n--- Transactions list (first 10) ---');
  transactions.slice(0, 10).forEach(t => {
    console.log(`ID: ${t.id} | Status: ${t.status} | Amount: ${t.amount} | Booking Status: ${t.booking ? t.booking.status : 'N/A'}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

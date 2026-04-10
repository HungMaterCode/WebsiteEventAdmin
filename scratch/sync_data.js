const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- DATA SYNC & CLEANUP STARTED ---');

  // 1. Find bookings that have a transaction
  const bookingsWithTransactions = await prisma.booking.findMany({
    where: {
      transactions: {
        some: {
          status: 'Thành công'
        }
      }
    }
  });

  console.log(`Found ${bookingsWithTransactions.length} bookings with successful transactions.`);

  // 2. Update them to SUCCESS
  const updateResult = await prisma.booking.updateMany({
    where: {
      id: {
        in: bookingsWithTransactions.map(b => b.id)
      }
    },
    data: {
      status: 'SUCCESS'
    }
  });

  console.log(`Updated ${updateResult.count} bookings to SUCCESS.`);

  // 3. Find and delete "orphan" bookings (no transaction)
  // According to user logic: "only create ticket/booking after success"
  const orphanBookings = await prisma.booking.findMany({
    where: {
      transactions: {
        none: {}
      }
    }
  });

  console.log(`Found ${orphanBookings.length} orphan bookings (no transactions). Removing them...`);

  const deleteResult = await prisma.booking.deleteMany({
    where: {
      id: {
        in: orphanBookings.map(b => b.id)
      }
    }
  });

  console.log(`Deleted ${deleteResult.count} orphan bookings.`);

  console.log('\n--- Final Verification ---');
  const count = await prisma.booking.count();
  const txCount = await prisma.transaction.count();
  console.log(`Remaining Bookings: ${count}`);
  console.log(`Total Transactions: ${txCount}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

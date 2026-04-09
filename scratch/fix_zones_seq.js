const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check sequence
    let seqInfo;
    try {
      seqInfo = await prisma.$queryRaw`SELECT last_value, is_called FROM "Zone_id_seq"`;
      console.log('--- SEQUENCE INFO ---');
      console.log(JSON.stringify(seqInfo, null, 2));
    } catch (e) {
      console.log('Could not get sequence info, might not be postgres or different name.');
    }

    // Check max ID
    const maxId = await prisma.zone.aggregate({ _max: { id: true } });
    console.log('--- MAX ID ---');
    console.log(JSON.stringify(maxId, null, 2));

    // Fix sequence if needed
    if (seqInfo && maxId._max.id) {
       const newSeq = maxId._max.id;
       await prisma.$executeRawUnsafe(`SELECT setval('"Zone_id_seq"', ${newSeq})`);
       console.log(`Sequence reset to ${newSeq}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

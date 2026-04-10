const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Get all sequence names
    const sequences = await prisma.$queryRaw`SELECT relname FROM pg_class WHERE relkind = 'S'`;
    console.log('--- ALL SEQUENCES ---');
    console.log(JSON.stringify(sequences, null, 2));

    // 2. Try to find the one for Zone
    const zoneSeq = sequences.find(s => s.relname.toLowerCase().includes('zone') && s.relname.toLowerCase().includes('id'));
    
    if (zoneSeq) {
      const seqName = zoneSeq.relname;
      console.log(`Found sequence: ${seqName}`);
      
      const maxIdRes = await prisma.zone.aggregate({ _max: { id: true } });
      const maxId = maxIdRes._max.id || 0;
      
      if (maxId > 0) {
        await prisma.$executeRawUnsafe(`SELECT setval('"${seqName}"', ${maxId})`);
        console.log(`Successfully reset ${seqName} to ${maxId}`);
      }
    } else {
      console.log('No matching sequence found for Zone table.');
    }
  } catch (error) {
    console.error('Error during sequence sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

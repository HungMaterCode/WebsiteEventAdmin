
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'tranvuhung2004tvc@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log('UPDATED:', user.email, user.role);
}

main()
  .catch((e) => {
    console.error('ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

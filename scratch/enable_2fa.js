
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'tranvuhung2004tvc@gmail.com' },
    data: { 
      twoFactorEnabled: true,
      role: 'ADMIN' // Ensure it's still ADMIN
    }
  });
  console.log('2FA_ENABLED_FOR:', user.email, 'Role:', user.role, '2FA:', user.twoFactorEnabled);
}

main()
  .catch((e) => {
    console.error('ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'tranvuhung2004tvc@gmail.com' }
  });
  console.log('User 2FA Status:', user?.twoFactorEnabled);
  
  const settings = await prisma.systemSetting.findUnique({
    where: { id: 'global' }
  });
  console.log('Global Settings:', settings?.data);
}

main();

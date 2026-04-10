import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { 
      email: 'tranvuhung2004tvc@gmail.com',
      role: 'ADMIN'
    },
    data: { 
      twoFactorEnabled: false 
    }
  });
  console.log('Update result:', result);
  
  const user = await prisma.user.findUnique({
    where: { email: 'tranvuhung2004tvc@gmail.com' }
  });
  console.log('User status after fix:', user?.twoFactorEnabled);
}

main();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 'global' },
    });
    console.log('Settings:', settings);
    
    if (!settings) {
      console.log('Creating default settings...');
      const newSettings = await prisma.systemSetting.create({
        data: {
          id: 'global',
          data: { maintenanceMode: false }
        }
      });
      console.log('Created:', newSettings);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

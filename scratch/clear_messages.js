const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang bắt đầu xóa dữ liệu trong bảng Message...');
  const result = await prisma.message.deleteMany({});
  console.log(`Đã xóa thành công ${result.count} tin nhắn.`);
  console.log('Dữ liệu các bảng khác không bị thay đổi.');
}

main()
  .catch((e) => {
    console.error('Lỗi khi xóa dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultTimeline = [
  { time: "18:00", title: "Đón Khách & Check-in", description: "Trải nghiệm không gian văn hóa di sản.", sortOrder: 0 },
  { time: "20:00", title: "Mở Màn: Dòng Chảy Di Sản", description: "Trình diễn nghệ thuật ánh sáng 3D Mapping & Nhạc cụ dân tộc.", sortOrder: 1 },
  { time: "21:00", title: "Chương 1: Âm Hưởng Ngàn Năm", description: "Sự kết hợp giữa nghệ sĩ gạo cội và âm nhạc điện tử.", sortOrder: 2 },
  { time: "22:30", title: "Chương 2: Cyber Heritage", description: "Bùng nổ cùng dàn Line-up đỉnh cao.", sortOrder: 3 },
  { time: "00:00", title: "Countdown & Pháo Hoa", description: "Khoảnh khắc giao thừa rực rỡ chào năm mới.", sortOrder: 4 },
];

async function main() {
  console.log('--- Starting Timeline Initialization ---');
  
  // 1. Check if timeline is already populated
  const count = await prisma.timelineItem.count();
  if (count > 0) {
    console.log(`Database already has ${count} timeline items. Skipping initialization.`);
    return;
  }

  // 2. Insert default items
  console.log('Inserting 5 default timeline items into database...');
  for (const item of defaultTimeline) {
    await prisma.timelineItem.create({
      data: item
    });
    console.log(`Created: ${item.time} - ${item.title}`);
  }

  console.log('--- Successfully Initialized Timeline ---');
}

main()
  .catch((e) => {
    console.error('Error during initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

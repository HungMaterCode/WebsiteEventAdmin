const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const timelineItems = [
  { time: "18:00", title: "Đón Khách & Check-in", description: "Trải nghiệm không gian văn hóa di sản.", sortOrder: 0 },
  { time: "20:00", title: "Mở Màn: Dòng Chảy Di Sản", description: "Trình diễn nghệ thuật ánh sáng 3D Mapping & Nhạc cụ dân tộc.", sortOrder: 1 },
  { time: "21:00", title: "Chương 1: Âm Hưởng Ngàn Năm", description: "Sự kết hợp giữa nghệ sĩ gạo cội và âm nhạc điện tử.", sortOrder: 2 },
  { time: "22:30", title: "Chương 2: Cyber Heritage", description: "Bùng nổ cùng dàn Line-up đỉnh cao.", sortOrder: 3 },
  { time: "00:00", title: "Countdown & Pháo Hoa", description: "Khoảnh khắc giao thừa rực rỡ chào năm mới.", sortOrder: 4 },
];

async function main() {
  console.log('Seeding Timeline...');
  
  // Update LandingPageSettings for Timeline titles
  await prisma.landingPageSettings.upsert({
    where: { id: 1 },
    update: {
      timelineTitle: "Lộ Trình",
      timelineSubtitle: "Sự Kiện"
    },
    create: {
      id: 1,
      timelineTitle: "Lộ Trình",
      timelineSubtitle: "Sự Kiện"
    }
  });

  // Create Timeline Items
  for (const item of timelineItems) {
    await prisma.timelineItem.create({
      data: item
    });
  }
  
  console.log('Seeding Timeline completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

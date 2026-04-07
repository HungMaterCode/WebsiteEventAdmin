import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultArtists = [
  { 
    name: "Hồ Ngọc Hà", 
    slug: "ho-ngoc-ha",
    genre: "Pop / Dance", 
    image: "https://picsum.photos/seed/hongocha/600/800", 
    performanceTime: "22:30 - 23:15",
    sortOrder: 1
  },
  { 
    name: "Tùng Dương", 
    slug: "tung-duong",
    genre: "Contemporary Folk", 
    image: "https://picsum.photos/seed/tungduong/600/800", 
    performanceTime: "21:00 - 21:45",
    sortOrder: 2
  },
  { 
    name: "Hoàng Thùy Linh", 
    slug: "hoang-thuy-linh",
    genre: "Folktronica", 
    image: "https://picsum.photos/seed/hoangthuylinh/600/800", 
    performanceTime: "20:15 - 21:00",
    sortOrder: 3
  },
  { 
    name: "Double2T", 
    slug: "double2t",
    genre: "Rap / Hip Hop", 
    image: "https://picsum.photos/seed/double2t/600/800", 
    performanceTime: "23:15 - 00:00",
    sortOrder: 4
  },
];

async function main() {
  console.log('Bắt đầu nạp dữ liệu nghệ sĩ...');
  
  for (const artist of defaultArtists) {
    await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: {},
      create: artist,
    });
    console.log(`Đã nạp: ${artist.name}`);
  }
  
  console.log('Hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

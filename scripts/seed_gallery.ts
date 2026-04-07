const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const galleryItems = [
  { url: "https://picsum.photos/seed/g1/800/600", title: "Ánh Sáng Di Sản", sortOrder: 0 },
  { url: "https://picsum.photos/seed/g2/800/600", title: "Bùng Nổ Cảm Xúc", sortOrder: 1 },
  { url: "https://picsum.photos/seed/g3/800/600", title: "Vũ Điệu Neon", sortOrder: 2 },
  { url: "https://picsum.photos/seed/g4/800/600", title: "Kết Nối Di Sản", sortOrder: 3 },
  { url: "https://picsum.photos/seed/g5/800/600", title: "Thung Nham Rực Rỡ", sortOrder: 4 },
  { url: "https://picsum.photos/seed/g6/800/600", title: "Khoảnh Khắc Vàng", sortOrder: 5 },
];

async function main() {
  console.log('Seeding Gallery...');
  
  // Update LandingPageSettings for Gallery titles
  await prisma.landingPageSettings.upsert({
    where: { id: 1 },
    update: {
      galleryTitle: "Khoảnh Khắc",
      gallerySubtitle: "Di Sản"
    },
    create: {
      id: 1,
      galleryTitle: "Khoảnh Khắc",
      gallerySubtitle: "Di Sản"
    }
  });

  // Create Gallery Items
  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item
    });
  }
  
  console.log('Seeding Gallery completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

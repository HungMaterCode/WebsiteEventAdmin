const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultImages = [
  { url: "https://picsum.photos/seed/g1/800/600", title: "Ánh Sáng Di Sản", sortOrder: 0 },
  { url: "https://picsum.photos/seed/g2/800/600", title: "Bùng Nổ Cảm Xúc", sortOrder: 1 },
  { url: "https://picsum.photos/seed/g3/800/600", title: "Vũ Điệu Neon", sortOrder: 2 },
  { url: "https://picsum.photos/seed/g4/800/600", title: "Kết Nối Di Sản", sortOrder: 3 },
  { url: "https://picsum.photos/seed/g5/800/600", title: "Thung Nham Rực Rỡ", sortOrder: 4 },
  { url: "https://picsum.photos/seed/g6/800/600", title: "Khoảnh Khắc Vàng", sortOrder: 5 },
];

async function main() {
  console.log('--- Starting Gallery Initialization ---');
  
  // 1. Check if gallery is already populated
  const count = await prisma.galleryItem.count();
  if (count > 0) {
    console.log(`Database already has ${count} items. Skipping initialization to avoid duplicates.`);
    return;
  }

  // 2. Insert default images
  console.log('Inserting 6 default images into database...');
  for (const item of defaultImages) {
    await prisma.galleryItem.create({
      data: item
    });
    console.log(`Created: ${item.title}`);
  }

  console.log('--- Successfully Initialized Gallery ---');
}

main()
  .catch((e) => {
    console.error('Error during initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

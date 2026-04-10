const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultPosts = [
  { username: "@minh_anh", content: "Không thể chờ đợi thêm nữa! Ninh Bình sẽ rực rỡ đêm nay! 🔥", timestamp: "2m ago", sortOrder: 0 },
  { username: "@cyber_heritage", content: "Sân khấu Thung Nham đang dần hoàn thiện, quá đỉnh! 💎", timestamp: "15m ago", sortOrder: 1 },
  { username: "@music_lover", content: "Line-up năm nay thực sự là một giấc mơ. #NeonHeritage", timestamp: "1h ago", sortOrder: 2 },
];

async function main() {
  console.log('--- Starting Community Initialization ---');
  
  // 1. Check if community is already populated
  const count = await prisma.communityPost.count();
  if (count > 0) {
    console.log(`Database already has ${count} community posts. Skipping initialization.`);
    return;
  }

  // 2. Insert default items
  console.log('Inserting 3 default community posts into database...');
  for (const item of defaultPosts) {
    await prisma.communityPost.create({
      data: item
    });
    console.log(`Created: ${item.username}`);
  }

  console.log('--- Successfully Initialized Community ---');
}

main()
  .catch((e) => {
    console.error('Error during initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

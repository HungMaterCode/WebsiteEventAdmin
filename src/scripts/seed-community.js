const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = [
    { username: "@minh_anh", content: "Không thể chờ đợi thêm nữa! Ninh Bình sẽ rực rỡ đêm nay! 🔥", timestamp: "2m ago", sortOrder: 0 },
    { username: "@cyber_heritage", content: "Sân khấu Thung Nham đang dần hoàn thiện, quá đỉnh! 💎", timestamp: "15m ago", sortOrder: 1 },
    { username: "@music_lover", content: "Line-up năm nay thực sự là một giấc mơ. #NeonHeritage", timestamp: "1h ago", sortOrder: 2 },
  ];

  console.log('Seeding community posts...');
  
  for (const post of posts) {
    await prisma.communityPost.upsert({
      where: { id: posts.indexOf(post) + 1 },
      update: post,
      create: post,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.landingPageSettings.upsert({
    where: { id: 1 },
    update: {
      mapTitle: "Địa Điểm Tổ Chức",
      mapSubtitle: "Trường Đại học Cần Thơ (CTU)",
      mapAddress: "Khu II, đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ",
      mapDescription: "Hội trường lớn / Sân vận động Đại học Cần Thơ - Không gian năng động, hiện đại.",
      mapGoogleUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841518413207!2d105.76842607573646!3d10.02993307253303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d033783a5%3A0x62916b5104d49818!2sCan%20Tho%20University!5e0!3m2!1sen!2s!4v1712493000000!5m2!1sen!2s"
    },
    create: {
      id: 1,
      mapTitle: "Địa Điểm Tổ Chức",
      mapSubtitle: "Trường Đại học Cần Thơ (CTU)",
      mapAddress: "Khu II, đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ",
      mapDescription: "Hội trường lớn / Sân vận động Đại học Cần Thơ - Không gian năng động, hiện đại.",
      mapGoogleUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841518413207!2d105.76842607573646!3d10.02993307253303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d033783a5%3A0x62916b5104d49818!2sCan%20Tho%20University!5e0!3m2!1sen!2s!4v1712493000000!5m2!1sen!2s"
    },
  });
  console.log("Updated LandingPageSettings for Location:", settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

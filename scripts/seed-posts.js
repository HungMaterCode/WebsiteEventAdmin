const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = [
    {
      title: 'Neon Heritage 2024: Giải Mã Concept Sân Khấu Viễn Tưởng',
      slug: 'giai-ma-concept-san-khau-vien-tuong-2024',
      content: `
        <h2>Sự Kết Hợp Giữa Quá Khứ và Tương Lai</h2>
        <p>Lần đầu tiên tại Việt Nam, sự kiện âm nhạc quy mô được thiết kế hoàn toàn theo phong cách Cyberpunk kết hợp văn hóa di sản. Lấy ý tưởng từ những con phố đèn Neon rực rỡ và các họa tiết trống đồng cổ đại, sân khấu được đẩy lên một tầm cao thị giác hoàn toàn mới.</p>
        <img src="https://picsum.photos/seed/cyber-stage-detail/1200/500" alt="Sân khấu nghệ thuật" />
        <p>Không chỉ dừng lại ở âm thanh cường độ cao, khu vực biểu diễn được trang bị hệ thống Hologram Mapping và laser đa điểm, tạo cảm giác như khán giả đang bước vào một không gian đa chiều.</p>
        <h3>Công nghệ thị giác đột phá</h3>
        <p>Toàn bộ 2/3 bề mặt sân khấu là màn hình LED tương tác, biến đổi không gian liên tục theo từng nhịp Drop của DJ. Mỗi tiết mục đều được đính kèm những Visual Art vắt kiệt sức sáng tạo của đội ngũ hơn 50 họa sĩ và lập trình viên đồ họa trong suốt 6 tháng.</p>
      `,
      excerpt: 'Lần đầu tiên tại Việt Nam, Neon Heritage tái định nghĩa hoàn toàn trải nghiệm sân khấu với sự kết hợp chấn động giữa nghệ thuật Cyberpunk đương đại và văn hóa Di sản cổ truyền.',
      coverImage: 'https://picsum.photos/seed/cyberpunk-stage/1200/600',
      tags: ['SỰ KIỆN', 'HẬU TRƯỜNG', 'CYBERPUNK'],
      seoTitle: 'Neon Heritage 2024: Giải Mã Concept Sân Khấu Viễn Tưởng Độc Nhất',
      seoDesc: 'Khám phá bí mật đằng sau sân khấu cực khủng kết hợp giữa Cyberpunk và Di sản Việt Nam tại Neon Heritage Ninh Bình.',
      seoKeywords: ['Neon Heritage', 'Sân khấu', 'Cyberpunk', 'Hologram', 'Lễ hội âm nhạc'],
      published: true,
      publishedAt: new Date(Date.now() - 360000000), 
    },
    {
      title: 'Hé Lộ Dàn Line-Up Gây "Chấn Động" Lễ Hội Cuối Năm',
      slug: 'he-lo-dan-line-up-neon-heritage-2024',
      content: `
        <h2>Khi Những Ngôi Sao Tìm Về "Di Sản"</h2>
        <p>Với định hướng giao thoa giữa Âm nhạc truyền thống và EDM cuồng nhiệt, dàn nghệ sĩ năm nay chính là sự "va chạm" nảy lửa giữa các thế hệ. Hồ Ngọc Hà sẽ mang đến những set nhạc Pop/Dance quen thuộc nhưng được khoác lên mình âm hưởng dân gian hoàn toàn mới lạ.</p>
        <img src="https://picsum.photos/seed/dj-live/1200/500" alt="Nghệ sĩ biểu diễn" />
        <p>Double2T - Quán quân Rap Việt - cũng sẽ xuất hiện trong màn trình diễn siêu đỉnh kết hợp cùng tiếng Khèn của màn đêm miền núi phía Bắc. Tất cả sẽ tạo nên bản hòa ca rực lửa đón năm mới.</p>
        <h3>Đội Hình DJ Độc Quyền</h3>
        <p>Tiếng bass đập thình thịch tới 3 giờ sáng từ dàn DJ đình đám thế hệ Z sẽ là lời chào hoàn hảo để kết thúc năm cũ và bước sang chương mới rực sáng.</p>
      `,
      excerpt: 'Những cái tên đình đám nào sẽ chính thức góp mặt trong đại tiệc âm nhạc kết nối ngàn năm văn hiến và nhịp điệu tương lai? Danh sách chính thức đã gọi tên những ngôi sao hạng A.',
      coverImage: 'https://picsum.photos/seed/lineup-edm/1200/600',
      tags: ['LINE-UP', 'NGHỆ SĨ', 'EDM'],
      seoTitle: 'Dàn Line-up Nghệ Sĩ Lễ Hội Neon Heritage Festival 2024',
      seoDesc: 'Sự góp mặt của Hồ Ngọc Hà, Double2T và dàn nghệ sĩ đình đám tại Neon Heritage Festival 2024 tại Ninh Bình.',
      seoKeywords: ['Line-up', 'Nghệ sĩ', 'Neon Heritage', 'Double2T', 'Hồ Ngọc Hà'],
      published: true,
      publishedAt: new Date(Date.now() - 150000000), 
    },
    {
      title: 'Cẩm Nang Sinh Tồn 24h Tại Neon Heritage Ninh Bình',
      slug: 'cam-nang-sinh-ton-le-hoi-am-nhac',
      content: `
        <h2>Vui Chơi Hết Mình Đi Kèm Sự Chuẩn Bị Hoàn Hảo</h2>
        <p>Để tận hưởng tuyệt đối màn đêm cực cháy tại thung lũng Ninh Bình mà không gặp gián đoạn, các Raver hãy ghi nhớ những hành trang "sống còn" sau đây.</p>
        <h3>1. Khí Hậu & Trang Phục</h3>
        <p>Thung Nham lúc nửa đêm khá se lạnh. Lời khuyên là hãy mặc những bộ cánh phản quang mỏng nhẹ, khoác kèm Hoodie Neon phiên bản giới hạn của chương trình để vừa ngầu vừa ấm.</p>
        <img src="https://picsum.photos/seed/fashion-rave/1200/500" alt="Phong cách thời trang Cyberpunk" />
        <h3>2. Thanh Toán Cyber (Cashless)</h3>
        <p>Khẳng định 100% không gian lễ hội KHÔNG sử dụng tiền mặt. Hãy quét mã QR vòng tay của bạn tại khu vực Top-up trước khi lễ hội bắt đầu. Vòng tay vừa là vé vào cổng, vừa là ví tự động thanh toán đồ ăn, nước uống.</p>
      `,
      excerpt: 'Mọi thứ bạn cần biết để có trải nghiệm Rave trọn vẹn và hoàn tác nhất. Từ lịch trình, cách phối đồ, vị trí check-in đến khu vực ẩm thực tại lễ hội.',
      coverImage: 'https://picsum.photos/seed/rave-survive/1200/600',
      tags: ['CẨM NANG', 'KINH NGHIỆM', 'RAVER'],
      seoTitle: 'Kinh nghiệm đi quẩy nhạc tại Neon Heritage 2024',
      seoDesc: 'Bí kíp lên đồ, chuẩn bị tư trang, cách giữ vé và check-in không chờ đợi cho anh em tham gia lễ hội nhạc điện tử lớn nhất Ninh Bình.',
      seoKeywords: ['Kinh nghiệm', 'Rave', 'Cẩm nang', 'Trang phục EDM'],
      published: true,
      publishedAt: new Date(Date.now() - 80000000), 
    }
  ];

  for (const p of posts) {
    const existing = await prisma.post.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.post.create({ data: p });
      console.log('Created seeded post:', p.title);
    } else {
      console.log('Post already exists:', p.slug);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const INITIAL_QUESTIONS = [
  { text: "Bạn biết đến sự kiện này qua kênh nào?", type: "choice", options: ["Mạng xã hội", "Bạn bè giới thiệu", "Website", "Quảng cáo", "Khác"], order: 1 },
  { text: "Bạn đánh giá chất lượng âm thanh và ánh sáng như thế nào?", type: "choice", options: ["Xuất sắc", "Tốt", "Bình thường", "Cần cải thiện"], order: 2 },
  { text: "Công tác tổ chức sự kiện đáp ứng kỳ vọng của bạn không?", type: "choice", options: ["Vượt kỳ vọng", "Đúng kỳ vọng", "Chưa đạt kỳ vọng"], order: 3 },
  { text: "Khu vực ẩm thực và dịch vụ tại sự kiện thế nào?", type: "choice", options: ["Đa dạng & ngon", "Chấp nhận được", "Cần cải thiện", "Không sử dụng"], order: 4 },
  { text: "Bạn có muốn tham gia sự kiện tiếp theo không?", type: "choice", options: ["Chắc chắn có", "Có thể", "Chưa chắc", "Không"], order: 5 },
  { text: "Nghệ sĩ nào bạn yêu thích nhất trong sự kiện?", type: "choice", options: ["Hồ Ngọc Hà", "Tùng Dương", "Hoàng Thùy Linh", "Double2T", "Tất cả"], order: 6 },
  { text: "Bạn đến sự kiện bằng phương tiện gì?", type: "choice", options: ["Xe máy", "Ô tô cá nhân", "Xe khách / Bus", "Taxi / Grab", "Khác"], order: 7 },
  { text: "Thái độ đón tiếp của nhân viên tại cổng check-in thế nào?", type: "choice", options: ["Rất nhiệt tình, chuyên nghiệp", "Thân thiện", "Bình thường", "Cần cải thiện"], order: 8 },
  { text: "Tốc độ hỗ trợ của nhân viên khi bạn cần hỏi thông tin?", type: "choice", options: ["Rất nhanh", "Tương đối nhanh", "Chậm", "Rất chậm / Không tìm thấy nhân viên"], order: 9 },
  { text: "Nhân viên khu vực F&B (Ẩm thực) phục vụ có chuyên nghiệp không?", type: "choice", options: ["Rất chuyên nghiệp", "Đạt yêu cầu", "Thiếu chuyên nghiệp", "Tôi không trải nghiệm"], order: 10 },
  { text: "Nhân viên an ninh có tạo cảm giác an toàn và hỗ trợ kịp thời không?", type: "choice", options: ["Rất an tâm, chỉ dẫn rõ ràng", "Bình thường", "Có phần cứng nhắc", "Không tốt"], order: 11 },
  { text: "Nếu đánh giá một cách tổng thể về toàn bộ đội ngũ nhân viên?", type: "choice", options: ["Xuất sắc", "Rất tốt", "Khá", "Trung bình", "Kém"], order: 12 },
  { text: "Điều gì ấn tượng nhất với bạn tại sự kiện?", type: "text", placeholder: "Chia sẻ khoảnh khắc đặc biệt nhất...", order: 13 },
  { text: "Bạn có góp ý gì để chúng tôi cải thiện?", type: "text", placeholder: "Mọi ý kiến đều quý giá...", order: 14 },
  { text: "Lời nhắn gửi đến Ban Tổ Chức", type: "text", placeholder: "Gửi lời cảm ơn, lời chúc...", order: 15 },
];

async function main() {
  console.log("Seeding questions...");
  await prisma.surveyQuestion.deleteMany({});
  for (const q of INITIAL_QUESTIONS) {
    await prisma.surveyQuestion.create({ data: q });
  }
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

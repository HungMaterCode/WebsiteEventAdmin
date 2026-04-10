import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SCORE_MAP: Record<string, number> = {
  // Positives
  "Xuất sắc": 5, "Vượt kỳ vọng": 5, "Rất nhiệt tình, chuyên nghiệp": 5, "Rất chuyên nghiệp": 5, 
  "Rất an tâm, chỉ dẫn rõ ràng": 5, "Rất nhanh": 5, "Chắc chắn có": 5,
  // High
  "Tốt": 4, "Đúng kỳ vọng": 4, "Thân thiện": 4, "Đạt yêu cầu": 4, "Tương đối nhanh": 4, "Có thể": 4, "Rất tốt": 4,
  // Mid
  "Bình thường": 3, "Chấp nhận được": 3, "Khá": 3, "Vừa đủ": 3, "Chưa chắc": 3,
  // Low
  "Cần cải thiện": 2, "Chưa đạt kỳ vọng": 2, "Chậm": 2, "Thiếu chuyên nghiệp": 2, "Có phần cứng nhắc": 2,
  // Very Low
  "Không tốt": 1, "Rất chậm / Không tìm thấy nhân viên": 1, "Kế hoạch kém": 1, "Không": 1, "Kém": 1
};

export async function GET() {
  try {
    const questions = await prisma.surveyQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    const responses = await prisma.surveyResponse.findMany({
      orderBy: { submittedAt: 'desc' }
    });

    // 1. Summary Stats
    const totalCount = responses.length;
    const spamResponses = responses.filter(r => r.isSpam);
    const validResponses = responses.filter(r => !r.isSpam);
    const spamCount = spamResponses.length;

    // 2. Radar Data Logic (for choice questions)
    // We'll focus on the Satisfaction questions (Order 2 to 12)
    const satisfactionCategories = questions
      .filter(q => q.type === 'choice' && q.order >= 2 && q.order <= 12)
      .map(q => ({
        id: q.id,
        name: q.text.replace("Bạn đánh giá ", "").replace(" như thế nào?", "").replace(" ?", "").split("?")[0].trim()
      }));

    const radarData = satisfactionCategories.map(cat => {
      let totalScore = 0;
      let count = 0;

      validResponses.forEach(r => {
        const answers = r.answers as any[];
        const ans = answers.find(a => a.questionId === cat.id);
        if (ans && SCORE_MAP[ans.answer]) {
          totalScore += SCORE_MAP[ans.answer];
          count++;
        }
      });

      return {
        name: cat.name,
        value: count > 0 ? parseFloat((totalScore / count).toFixed(1)) : 0
      };
    });

    // 3. Overall Star Avg
    const allScores = radarData.map(d => d.value).filter(v => v > 0);
    const avgOverall = allScores.length > 0 
      ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) 
      : "0.0";

    // 4. Latest Comments (from text questions 13, 14, 15)
    const textQuestionIds = questions.filter(q => q.type === 'text').map(q => q.id);
    const latestComments = validResponses.slice(0, 10).map(r => {
        const answers = r.answers as any[];
        const commentAnswers = answers.filter(a => textQuestionIds.includes(a.questionId));
        return {
            id: r.id,
            bookingCode: r.bookingCode || "Ẩn danh",
            date: r.submittedAt,
            comments: commentAnswers.map(a => a.answer).filter(Boolean).join(" | ")
        };
    }).filter(c => c.comments.length > 0);

    return NextResponse.json({
      summary: {
        totalReviews: totalCount,
        validReviews: validResponses.length,
        spamCount,
        avgOverall
      },
      radarData,
      latestComments
    });
  } catch (error) {
    console.error("Feedback Analytics API Error:", error);
    return NextResponse.json({ error: "Lỗi khi tải dữ liệu phân tích." }, { status: 500 });
  }
}

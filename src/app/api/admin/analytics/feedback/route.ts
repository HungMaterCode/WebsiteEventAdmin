import { NextRequest, NextResponse } from "next/server";
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

const NOISE_PHRASES = [
  "không", "không có", "không có gì", "không góp ý", "bình thường", 
  "không có gì ấn tượng", "n/a", "no", "none", ".", "-", "...", "chưa có"
];

const POSITIVE_KEYWORDS = ["tuyệt", "hài lòng", "đẹp", "nhiệt tình", "chuyên nghiệp", "ấn tượng", "cảm ơn", "xịn", "hay", "vui"];
const NEGATIVE_KEYWORDS = ["tệ", "kém", "chậm", "thất vọng", "không hài lòng", "bẩn", "đắt", "lâu", "khó chịu", "kém chất lượng", "ồn"];

function getSentiment(text: string) {
  const lowerText = text.toLowerCase();
  if (NEGATIVE_KEYWORDS.some(k => lowerText.includes(k))) return "negative";
  if (POSITIVE_KEYWORDS.some(k => lowerText.includes(k))) return "positive";
  return "neutral";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "desc"; // desc = newest, asc = oldest
    const limitParam = searchParams.get("limit") || "10";
    
    const questions = await prisma.surveyQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    const responses = await prisma.surveyResponse.findMany({
      orderBy: { submittedAt: sort === 'asc' ? 'asc' : 'desc' }
    });

    // 1. Summary Stats
    const totalCount = responses.length;
    const spamResponses = responses.filter(r => r.isSpam);
    const validResponses = responses.filter(r => !r.isSpam);
    const spamCount = spamResponses.length;

    // 2. Radar Data Logic
    const satisfactionCategories = questions
      .filter(q => q.type === 'choice' && q.order >= 2 && q.order <= 12)
      .map(q => ({
        id: q.id,
        name: q.text.trim()
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

    // 4. Detailed Comments with Filter Logic
    const textQuestionIds = questions.filter(q => q.type === 'text').map(q => q.id);
    
    let commentList = validResponses.map(r => {
        const answers = r.answers as any[];
        const commentAnswers = answers.filter(a => textQuestionIds.includes(a.questionId));
        const combinedText = commentAnswers.map(a => a.answer).filter(Boolean).join(" | ");
        
        // Check if comments are meaningful (not noise)
        const isMeaningful = combinedText.length > 5 && !NOISE_PHRASES.some(phrase => 
          combinedText.toLowerCase().trim() === phrase || combinedText.toLowerCase().trim() === (phrase + " | " + phrase)
        );

        return {
            id: r.id,
            bookingCode: r.bookingCode || "Ẩn danh",
            date: r.submittedAt,
            comments: combinedText,
            sentiment: getSentiment(combinedText),
            isMeaningful
        };
    }).filter(c => c.comments.length > 0);

    // Apply limit
    const displayComments = limitParam === 'all' ? commentList : commentList.slice(0, parseInt(limitParam));

    return NextResponse.json({
      summary: {
        totalReviews: totalCount,
        validReviews: validResponses.length,
        spamCount,
        avgOverall
      },
      radarData,
      latestComments: displayComments
    });
  } catch (error) {
    console.error("Feedback Analytics API Error:", error);
    return NextResponse.json({ error: "Lỗi khi tải dữ liệu phân tích." }, { status: 500 });
  }
}

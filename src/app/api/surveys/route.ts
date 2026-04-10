import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SurveySubmissionSchema } from "@/lib/validations/survey";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fast validation using Zod
    const validation = SurveySubmissionSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dữ liệu khảo sát không hợp lệ.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { answers, totalTimeSpend, bookingCode } = validation.data;
    
    // SPAM DETECTION LOGIC
    let isSpam = false;
    
    // 1. Total time check (< 45s is suspicious for 15 questions)
    if (totalTimeSpend < 45) {
      isSpam = true;
    }

    // 2. Individual click speed check (< 1.2s for any MCQ question)
    answers.forEach(a => {
      if (a.timeSpentMs < 1200) isSpam = true;
    });

    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        bookingCode,
        answers: answers as any, 
        totalTimeSpend,
        isSpam,
      },
    });

    return NextResponse.json(
      { success: true, data: { id: surveyResponse.id, isSpam } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lưu khảo sát." },
      { status: 500 }
    );
  }
}

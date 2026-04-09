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

    const { answers, totalTimeSpend } = validation.data;

    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        answers: answers as any, // Cast to any for JSON column
        totalTimeSpend,
      },
    });

    return NextResponse.json(
      { success: true, data: { id: surveyResponse.id } },
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

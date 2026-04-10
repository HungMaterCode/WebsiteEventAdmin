import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache survey questions for 1 hour, revalidate on demand with tag 'survey-questions'
const getCachedQuestions = unstable_cache(
  async () => {
    return await prisma.surveyQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["survey-questions"],
  { revalidate: 3600, tags: ["survey-questions"] }
);

export async function GET() {
  try {
    const questions = await getCachedQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

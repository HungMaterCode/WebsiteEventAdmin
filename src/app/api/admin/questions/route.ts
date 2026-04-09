import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await prisma.surveyQuestion.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Admin fetch questions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, type, options, placeholder, order, isActive } = body;

    const question = await prisma.surveyQuestion.create({
      data: {
        text,
        type,
        options,
        placeholder,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    revalidateTag("survey-questions", "default");

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error("Admin create question error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

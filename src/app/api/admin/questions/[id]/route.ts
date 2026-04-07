import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { text, type, options, placeholder, order, isActive } = body;

    const question = await prisma.surveyQuestion.update({
      where: { id },
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

    return NextResponse.json(question);
  } catch (error) {
    console.error("Admin update question error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.surveyQuestion.delete({
      where: { id },
    });

    revalidateTag("survey-questions", "default");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete question error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

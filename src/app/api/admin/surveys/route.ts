import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const responses = await prisma.surveyResponse.findMany({
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Fetch surveys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

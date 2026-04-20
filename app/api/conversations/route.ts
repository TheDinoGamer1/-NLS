import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createConversationSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: parsed.data.title || "New Chat",
      selectedModel: parsed.data.selectedModel || "gpt-4.1-mini",
    },
    select: { id: true },
  });

  return NextResponse.json(conversation, { status: 201 });
}

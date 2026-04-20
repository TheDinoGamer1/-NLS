import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateConversationSchema } from "@/lib/validations";
import { assertConversationOwnership } from "@/server/authz";

export async function PATCH(req: Request, { params }: { params: { conversationId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = updateConversationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await assertConversationOwnership(user.id, params.conversationId);

  const updated = await prisma.conversation.update({
    where: { id: params.conversationId },
    data: parsed.data,
    select: { id: true, title: true, selectedModel: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { conversationId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await assertConversationOwnership(user.id, params.conversationId);

  await prisma.conversation.delete({ where: { id: params.conversationId } });

  return NextResponse.json({ ok: true });
}

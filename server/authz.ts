import { prisma } from "@/lib/prisma";

export async function assertConversationOwnership(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    select: { id: true, userId: true, selectedModel: true, title: true },
  });

  if (!conversation) {
    throw new Error("NOT_FOUND");
  }

  return conversation;
}

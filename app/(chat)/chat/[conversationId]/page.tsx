import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatView } from "@/components/chat/chat-view";

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const conversation = await prisma.conversation.findFirst({
    where: { id: params.conversationId, userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) notFound();

  return <ChatView conversation={conversation} />;
}

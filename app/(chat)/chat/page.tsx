import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChatIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const existing = await prisma.conversation.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  if (existing) redirect(`/chat/${existing.id}`);

  const conversation = await prisma.conversation.create({
    data: { userId: user.id, title: "New Chat" },
    select: { id: true },
  });

  redirect(`/chat/${conversation.id}`);
}

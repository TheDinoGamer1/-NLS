import * as React from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/sidebar";

export async function ChatShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <div className="flex h-screen bg-[#fcfcfc]">
      <Sidebar conversations={conversations} user={{ name: user.name, email: user.email }} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

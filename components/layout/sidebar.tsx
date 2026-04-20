"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConversationItem = { id: string; title: string; updatedAt: Date };

export function Sidebar({
  conversations,
  user,
}: {
  conversations: ConversationItem[];
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const router = useRouter();

  const createConversation = async () => {
    const res = await fetch("/api/conversations", { method: "POST" });
    if (!res.ok) return;
    const data = await res.json();
    router.push(`/chat/${data.id}`);
    router.refresh();
  };

  return (
    <aside className="hidden w-[280px] flex-col border-r border-border bg-white md:flex">
      <div className="border-b border-border p-4">
        <p className="text-lg font-semibold">ChatPear</p>
        <Button variant="outline" className="mt-3 w-full justify-start gap-2" onClick={createConversation}>
          <Plus className="h-4 w-4" /> New Chat
        </Button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {conversations.map((c) => {
          const active = pathname === `/chat/${c.id}`;
          return (
            <div key={c.id} className={cn("group flex items-center justify-between rounded-md", active && "bg-muted")}>
              <Link href={`/chat/${c.id}`} className="truncate px-3 py-2 text-sm w-full">{c.title}</Link>
              <button
                aria-label="Delete conversation"
                className="mr-1 hidden rounded p-1 text-muted-foreground hover:bg-white group-hover:block"
                onClick={async () => {
                  await fetch(`/api/conversations/${c.id}`, { method: "DELETE" });
                  router.refresh();
                  if (active) router.push("/chat");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <p className="truncate text-sm font-medium">{user.name || "User"}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => signOut({ callbackUrl: "/sign-in" })}>
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageMarkdown } from "@/components/markdown/message-markdown";
import { useChatStream } from "@/hooks/use-chat-stream";
import { MODEL_LABELS, SUPPORTED_MODELS, SupportedModel } from "@/lib/models";

type ConversationProps = {
  conversation: {
    id: string;
    title: string;
    selectedModel: string;
    messages: Message[];
  };
};

export function ChatView({ conversation }: ConversationProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<SupportedModel>(
    SUPPORTED_MODELS.includes(conversation.selectedModel as SupportedModel)
      ? (conversation.selectedModel as SupportedModel)
      : "gpt-4.1-mini",
  );
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const { isStreaming, send } = useChatStream();
  const router = useRouter();

  const canSend = input.trim().length > 0 && !isStreaming;
  const assistantDraft = useMemo(() => messages.find((m) => m.id === "draft"), [messages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;

    setError(null);
    setInput("");

    const optimisticUser: Message = {
      id: `${Date.now()}-user`,
      conversationId: conversation.id,
      role: "user",
      content,
      model,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticUser, { ...optimisticUser, id: "draft", role: "assistant", content: "", model }]);

    try {
      await send({ conversationId: conversation.id, content, model }, (token) => {
        setMessages((prev) => prev.map((m) => (m.id === "draft" ? { ...m, content: m.content + token } : m)));
      });
      router.refresh();
    } catch {
      setError("Could not generate response. Please retry.");
      setMessages((prev) => prev.filter((m) => m.id !== "draft"));
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
      <header className="border-b border-border px-5 py-4">
        <input
          className="w-full bg-transparent text-lg font-semibold outline-none"
          defaultValue={conversation.title}
          onBlur={async (e) => {
            const title = e.target.value.trim();
            if (!title) return;
            await fetch(`/api/conversations/${conversation.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title }),
            });
            router.refresh();
          }}
        />
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? <p className="pt-8 text-center text-sm text-muted-foreground">Start a conversation with ChatPear.</p> : null}
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[95%]"}>
            <div className={message.role === "user" ? "rounded-xl bg-muted px-4 py-3 text-sm" : "px-1 text-sm"}>
              {message.role === "assistant" ? <MessageMarkdown content={message.content || "..."} /> : message.content}
            </div>
          </div>
        ))}
      </div>

      <footer className="border-t border-border bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Model</label>
          <select
            className="rounded-md border border-border bg-white px-2 py-1 text-xs"
            value={model}
            onChange={(e) => setModel(e.target.value as SupportedModel)}
          >
            {SUPPORTED_MODELS.map((m) => (
              <option key={m} value={m}>{MODEL_LABELS[m]}</option>
            ))}
          </select>
          {assistantDraft && <span className="text-xs text-muted-foreground">Generating…</span>}
        </div>
        <div className="rounded-xl border border-border bg-white p-2 shadow-sm">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message ChatPear"
            className="max-h-48 min-h-[90px] resize-y border-0 p-2 focus-visible:ring-0"
          />
          <div className="mt-2 flex justify-end">
            <Button disabled={!canSend} onClick={handleSend}>Send</Button>
          </div>
        </div>
        {error && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
            <Button size="sm" variant="outline" onClick={handleSend}>Retry</Button>
          </div>
        )}
      </footer>
    </div>
  );
}

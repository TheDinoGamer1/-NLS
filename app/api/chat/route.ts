import { NextResponse } from "next/server";
import { MessageRole } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { truncateTitle } from "@/lib/utils";
import { sendMessageSchema } from "@/lib/validations";
import { assertConversationOwnership } from "@/server/authz";
import { streamAssistantResponse } from "@/server/openai/responses";
import { checkRateLimit } from "@/server/rate-limit";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = checkRateLimit(`chat:${user.id}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rate.retryAfter || 60) } });
  }

  const body = await req.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { conversationId, content, model } = parsed.data;
  const conversation = await assertConversationOwnership(user.id, conversationId);

  const previousMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  await prisma.message.create({
    data: { conversationId, role: MessageRole.user, content, model },
  });

  if (conversation.title === "New Chat") {
    await prisma.conversation.update({ where: { id: conversationId }, data: { title: truncateTitle(content), selectedModel: model } });
  } else {
    await prisma.conversation.update({ where: { id: conversationId }, data: { selectedModel: model } });
  }

  const stream = await streamAssistantResponse({
    model,
    messages: [...previousMessages, { role: "user", content }],
  });

  let assistantText = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            assistantText += event.delta;
            controller.enqueue(new TextEncoder().encode(`0:${event.delta}\n`));
          }
        }
        await prisma.message.create({
          data: { conversationId, role: MessageRole.assistant, content: assistantText, model },
        });
        controller.close();
      } catch {
        controller.error("stream_error");
      } finally {
        await stream.finalResponse().catch(() => null);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

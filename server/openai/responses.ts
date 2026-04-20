import OpenAI from "openai";
import type { ResponseInput } from "openai/resources/responses/responses";
import { env } from "@/lib/env";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

type MessageInput = { role: "user" | "assistant"; content: string };

export async function streamAssistantResponse({
  model,
  messages,
  instructions,
}: {
  model: string;
  messages: MessageInput[];
  instructions?: string | null;
}) {
  const input: ResponseInput = messages.map((message) => ({
    role: message.role,
    content: [{ type: "input_text", text: message.content }],
  }));

  return client.responses.stream({
    model,
    input,
    instructions: instructions || undefined,
  });
}

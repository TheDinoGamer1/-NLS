"use client";

import { useState } from "react";

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);

  const send = async (payload: Record<string, unknown>, onToken: (chunk: string) => void) => {
    setIsStreaming(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok || !res.body) {
      setIsStreaming(false);
      throw new Error("Unable to stream response");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      for (const line of text.split("\n")) {
        if (line.startsWith("0:")) {
          const chunk = line.slice(2).trim();
          if (chunk) onToken(chunk);
        }
      }
    }

    setIsStreaming(false);
  };

  return { isStreaming, send };
}

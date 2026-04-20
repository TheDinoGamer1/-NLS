import { describe, expect, it } from "vitest";
import { sendMessageSchema } from "@/lib/validations";

describe("sendMessageSchema", () => {
  it("rejects invalid model", () => {
    const parsed = sendMessageSchema.safeParse({
      conversationId: "ck123",
      content: "hello",
      model: "bad-model",
    });
    expect(parsed.success).toBe(false);
  });
});

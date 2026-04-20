import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/server/rate-limit";

describe("checkRateLimit", () => {
  it("blocks when request count exceeds limit", () => {
    const key = `test-${Date.now()}`;
    checkRateLimit(key, 1, 5000);
    const second = checkRateLimit(key, 1, 5000);
    expect(second.allowed).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { truncateTitle } from "@/lib/utils";

describe("truncateTitle", () => {
  it("returns default title for blank input", () => {
    expect(truncateTitle("   ")).toBe("New Chat");
  });

  it("truncates long input", () => {
    expect(truncateTitle("a".repeat(100), 10)).toBe("aaaaaaaaaa...");
  });
});

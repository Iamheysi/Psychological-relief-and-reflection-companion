import { describe, it, expect } from "vitest";
import { isOverLimit, softLimitReached, DAILY_MESSAGE_LIMITS } from "@/lib/ai/token-tracking";

describe("plan caps", () => {
  it("free is capped at 30 messages/day", () => {
    expect(DAILY_MESSAGE_LIMITS.free).toBe(30);
    expect(isOverLimit("free", { messagesSent: 30, tokensUsed: 0 })).toBe(true);
    expect(isOverLimit("free", { messagesSent: 29, tokensUsed: 0 })).toBe(false);
  });

  it("pro is uncapped", () => {
    expect(isOverLimit("pro", { messagesSent: 100000, tokensUsed: 0 })).toBe(false);
    expect(softLimitReached("pro", { messagesSent: 100000, tokensUsed: 0 })).toBe(false);
  });

  it("soft limit fires at 80%", () => {
    expect(softLimitReached("free", { messagesSent: 23, tokensUsed: 0 })).toBe(false);
    expect(softLimitReached("free", { messagesSent: 24, tokensUsed: 0 })).toBe(true);
  });
});

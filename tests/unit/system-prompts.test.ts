import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/lib/ai/system-prompts";

describe("buildSystemPrompt", () => {
  it("uses English base for en locale", () => {
    const p = buildSystemPrompt({ locale: "en", tone: "listen", safetyFlagged: false });
    expect(p).toContain("Mira");
    expect(p).toContain("NOT a licensed therapist");
  });

  it("uses Russian base for ru locale", () => {
    const p = buildSystemPrompt({ locale: "ru", tone: "listen", safetyFlagged: false });
    expect(p).toContain("Мира");
    expect(p).toContain("НЕ лицензированный");
  });

  it("appends the safety overlay when flagged", () => {
    const p = buildSystemPrompt({ locale: "en", tone: "listen", safetyFlagged: true });
    expect(p).toContain("SAFETY CONTEXT");
    expect(p).toContain("Do not provide methods");
  });

  it("appends the practical tone directive", () => {
    const p = buildSystemPrompt({ locale: "en", tone: "practical", safetyFlagged: false });
    expect(p).toContain("the user wants something concrete");
  });

  it("includes display name guidance when provided", () => {
    const p = buildSystemPrompt({ locale: "en", tone: "listen", safetyFlagged: false, userDisplayName: "Sam" });
    expect(p).toContain("Sam");
  });
});

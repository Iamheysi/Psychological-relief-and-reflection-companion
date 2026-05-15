import { describe, it, expect } from "vitest";
import { keywordScan } from "@/lib/ai/safety";

describe("keywordScan — English", () => {
  it("flags explicit suicide ideation", () => {
    const r = keywordScan("I want to kill myself tonight.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("suicide");
  });

  it("flags self-harm cutting", () => {
    const r = keywordScan("I've been cutting myself again.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("self_harm");
  });

  it("flags acute overdose context", () => {
    const r = keywordScan("I took the pills an hour ago.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("acute_crisis");
  });

  it("flags abuse disclosure", () => {
    const r = keywordScan("He hits me when he drinks.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("abuse");
  });

  it("does not flag ordinary sadness", () => {
    const r = keywordScan("I've been feeling really down at work this week.");
    expect(r.flagged).toBe(false);
  });

  it("does not flag a benign cooking message", () => {
    const r = keywordScan("I want to make pasta tonight, any tips?");
    expect(r.flagged).toBe(false);
  });
});

describe("keywordScan — Russian", () => {
  it("flags 'не хочу жить'", () => {
    const r = keywordScan("Я больше не хочу жить.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("suicide");
  });

  it("flags 'покончить с собой'", () => {
    const r = keywordScan("Думаю покончить с собой.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("suicide");
  });

  it("flags self-harm in Russian", () => {
    const r = keywordScan("Я опять режу себя.");
    expect(r.flagged).toBe(true);
    expect(r.categories).toContain("self_harm");
  });

  it("does not flag everyday Russian text", () => {
    const r = keywordScan("Сегодня устал на работе, лягу пораньше.");
    expect(r.flagged).toBe(false);
  });
});

describe("keywordScan — boundary behavior", () => {
  it("returns ['none'] when nothing matched", () => {
    const r = keywordScan("hello there");
    expect(r.categories).toEqual(["none"]);
    expect(r.source).toBe("none");
  });

  it("dedupes categories", () => {
    const r = keywordScan("I want to kill myself. I really want to end it.");
    const suicideCount = r.categories.filter((c) => c === "suicide").length;
    expect(suicideCount).toBe(1);
  });
});

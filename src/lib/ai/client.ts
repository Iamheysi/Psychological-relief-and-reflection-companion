import Anthropic from "@anthropic-ai/sdk";

export type Plan = "free" | "pro" | "pro_plus";

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

export function modelForPlan(plan: Plan): string {
  switch (plan) {
    case "pro_plus":
      return process.env.ANTHROPIC_MODEL_PRO_PLUS ?? "claude-opus-4-7";
    case "pro":
      return process.env.ANTHROPIC_MODEL_PRO ?? "claude-sonnet-4-6";
    case "free":
    default:
      return process.env.ANTHROPIC_MODEL_FREE ?? "claude-sonnet-4-6";
  }
}

export function classifierModel(): string {
  return process.env.ANTHROPIC_MODEL_CLASSIFIER ?? "claude-haiku-4-5-20251001";
}

export function extendedThinkingForPlan(plan: Plan): { type: "enabled"; budget_tokens: number } | undefined {
  if (plan === "pro") return { type: "enabled", budget_tokens: 2000 };
  if (plan === "pro_plus") return { type: "enabled", budget_tokens: 4000 };
  return undefined;
}

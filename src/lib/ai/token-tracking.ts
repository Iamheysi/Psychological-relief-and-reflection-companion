import type { Plan } from "./client";

export const DAILY_MESSAGE_LIMITS: Record<Plan, number> = {
  free: 30,
  pro: Number.POSITIVE_INFINITY,
  pro_plus: Number.POSITIVE_INFINITY,
};

export interface UsageSnapshot {
  messagesSent: number;
  tokensUsed: number;
}

export function isOverLimit(plan: Plan, usage: UsageSnapshot): boolean {
  return usage.messagesSent >= DAILY_MESSAGE_LIMITS[plan];
}

export function softLimitReached(plan: Plan, usage: UsageSnapshot): boolean {
  const cap = DAILY_MESSAGE_LIMITS[plan];
  if (!Number.isFinite(cap)) return false;
  return usage.messagesSent >= Math.floor(cap * 0.8);
}

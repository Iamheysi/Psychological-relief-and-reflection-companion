import { z } from "zod";
import { getAnthropicClient, modelForPlan, classifierModel, extendedThinkingForPlan, type Plan } from "@/lib/ai/client";
import { evaluateSafety, type SafetyResult } from "@/lib/ai/safety";
import { buildSystemPrompt, type Locale, type Tone } from "@/lib/ai/system-prompts";
import { DAILY_MESSAGE_LIMITS } from "@/lib/ai/token-tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  message: z.string().min(1).max(8000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .max(40)
    .default([]),
  locale: z.enum(["en", "ru"]).default("en"),
  tone: z.enum(["listen", "reflect", "challenge", "practical"]).default("listen"),
  plan: z.enum(["free", "pro", "pro_plus"]).default("free"),
  displayName: z.string().max(64).nullish(),
  // Server should ideally resolve usage from auth — accepted from client only for stub/dev.
  messagesSentToday: z.number().int().min(0).default(0),
});

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return new Response(JSON.stringify({ error: "invalid_request", details: String(err) }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const plan: Plan = body.plan;

  // Server-side daily cap. The client is untrusted; in production this lookup
  // happens against the authenticated user's usage_counters row.
  const cap = DAILY_MESSAGE_LIMITS[plan];
  if (Number.isFinite(cap) && body.messagesSentToday >= cap) {
    return new Response(JSON.stringify({ error: "daily_limit_reached" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const client = getAnthropicClient();

  // Safety evaluation BEFORE the conversational model call.
  let safety: SafetyResult;
  try {
    safety = await evaluateSafety(body.message, client, classifierModel());
  } catch {
    safety = { flagged: false, categories: ["none"], matchedPhrases: [], source: "none" };
  }

  const system = buildSystemPrompt({
    locale: body.locale as Locale,
    tone: body.tone as Tone,
    safetyFlagged: safety.flagged,
    userDisplayName: body.displayName ?? null,
  });

  const model = modelForPlan(plan);
  const thinking = extendedThinkingForPlan(plan);

  const messages = [
    ...body.history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: body.message },
  ];

  const sendUserMetadata = process.env.ANTHROPIC_SEND_USER_METADATA === "1";

  const stream = await client.messages.stream({
    model,
    max_tokens: 1024,
    system,
    messages,
    ...(thinking ? { thinking } : {}),
    ...(sendUserMetadata ? { metadata: { user_id: "anonymous" } } : {}),
  });

  const encoder = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      // First frame: safety result, so the UI can show the amber banner & hotlines immediately.
      controller.enqueue(
        encoder.encode(
          `event: safety\ndata: ${JSON.stringify({ flagged: safety.flagged, categories: safety.categories })}\n\n`,
        ),
      );

      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(
              encoder.encode(`event: token\ndata: ${JSON.stringify({ text: event.delta.text })}\n\n`),
            );
          }
        }
        const finalMsg = await stream.finalMessage();
        controller.enqueue(
          encoder.encode(
            `event: done\ndata: ${JSON.stringify({
              usage: finalMsg.usage,
              stopReason: finalMsg.stop_reason,
            })}\n\n`,
          ),
        );
      } catch (err) {
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body$, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

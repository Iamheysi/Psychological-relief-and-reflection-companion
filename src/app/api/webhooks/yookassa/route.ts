export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stub. YooKassa sends notifications signed by HMAC; verify with YOOKASSA_WEBHOOK_SECRET.
// Map payment.succeeded / subscription events to the same `subscriptions` table.
export async function POST(req: Request) {
  const _payload = await req.json().catch(() => null);
  // TODO: verify signature, then update subscription state.
  return new Response("ok");
}

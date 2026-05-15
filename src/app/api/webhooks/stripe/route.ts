export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stub. Verify Stripe signature using STRIPE_WEBHOOK_SECRET and the raw body.
// On checkout.session.completed / customer.subscription.updated, upsert the
// `subscriptions` row keyed by external_id and update the user's plan.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("missing signature", { status: 400 });
  const _raw = await req.text();
  // TODO: stripe.webhooks.constructEvent(_raw, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  return new Response("ok");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// User-initiated data export. Streams a JSON+Markdown bundle of the user's
// decrypted conversations, journal entries, and account data. In production:
//   1. Authenticate the user.
//   2. Unwrap the user's encryption key.
//   3. Decrypt content rows as we stream.
//   4. Sign the resulting bundle URL (or stream directly).
export async function GET() {
  return new Response(JSON.stringify({ status: "not_implemented" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
}

import Link from "next/link";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl">Welcome to Mira</h1>
          <p className="mt-2 text-sm text-ink/70">No passwords — we'll email you a magic link.</p>
        </div>
        <form className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-ink/15 px-4 py-3"
          />
          <button className="w-full rounded-full bg-ink text-paper py-3">Send magic link</button>
        </form>
        <div className="text-center text-sm text-ink/60">or</div>
        <div className="space-y-2">
          <button className="w-full rounded-full border border-ink/15 py-2.5">Continue with Google</button>
          <button className="w-full rounded-full border border-ink/15 py-2.5">Continue with Apple</button>
          <Link href="/chat" className="block text-center w-full rounded-full border border-ink/15 py-2.5">
            Try anonymously
          </Link>
        </div>
        <p className="text-xs text-ink/55 text-center">
          By continuing you agree to our <Link href="/legal/terms" className="underline">Terms</Link>{" "}
          and <Link href="/legal/medical" className="underline">Medical Disclaimer</Link>. You must be 18+.
        </p>
      </div>
    </div>
  );
}

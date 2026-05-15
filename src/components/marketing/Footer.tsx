import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24 py-10 text-sm text-ink/70">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap gap-6 justify-between">
        <div className="space-y-1">
          <div className="font-serif text-lg text-ink">Mira</div>
          <div>© {new Date().getFullYear()}. Not a medical service.</div>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/safety">Safety</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/medical">Medical disclaimer</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <Link href="/legal/acceptable-use">Acceptable use</Link>
        </nav>
      </div>
    </footer>
  );
}

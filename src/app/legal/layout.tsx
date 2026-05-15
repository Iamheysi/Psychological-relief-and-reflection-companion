import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl">Mira</Link>
          <Link href="/" className="text-sm">← Back</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16 leading-relaxed text-ink/85">
        {children}
        <p className="mt-12 text-xs text-ink/50">
          This page is a placeholder pending counsel review. Do not ship to production without
          legal sign-off.
        </p>
      </main>
    </div>
  );
}

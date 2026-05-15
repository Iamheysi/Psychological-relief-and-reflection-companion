import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl">Mira</Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/pricing">Pricing</Link>
            <Link href="/safety">Safety</Link>
            <Link href="/about">About</Link>
            <Link href="/sign-in" className="rounded-full bg-ink text-paper px-4 py-1.5">
              Start
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

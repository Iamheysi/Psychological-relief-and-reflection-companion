import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
          <Link href="/chat" className="font-serif text-xl">Mira</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/chat">Chat</Link>
            <Link href="/conversations">Conversations</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/library">Library</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

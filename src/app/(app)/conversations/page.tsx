export const metadata = { title: "Conversations" };

export default function ConversationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl">Conversations</h1>
      <p className="mt-4 text-ink/70">
        Your past conversations live here, encrypted with a key only you unlock. This view is
        scaffolded — the listing query is implemented in <code>lib/db/queries.ts</code>.
      </p>
    </div>
  );
}

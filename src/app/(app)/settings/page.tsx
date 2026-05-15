export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="mt-4 text-ink/70">Theme, motion, language, account, data.</p>
      </div>
      <section>
        <h2 className="font-serif text-xl">Your data</h2>
        <p className="mt-2 text-ink/70 text-sm">
          Export everything we hold about you, or delete your account. Deletion completes within
          30 days, with a 7-day reversible grace period.
        </p>
        <div className="mt-3 flex gap-3">
          <a href="/api/export" className="rounded-full border border-ink/20 px-4 py-2 text-sm">
            Export my data
          </a>
          <button className="rounded-full border border-ink/20 px-4 py-2 text-sm">
            Delete my account
          </button>
        </div>
      </section>
    </div>
  );
}

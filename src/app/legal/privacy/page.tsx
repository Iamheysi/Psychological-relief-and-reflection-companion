export const metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <>
      <h1 className="font-serif text-4xl">Privacy Policy</h1>
      <p className="mt-6">
        Mira is a trust product. Privacy is a feature, not a footnote.
      </p>
      <h2 className="font-serif text-2xl mt-10">What we store</h2>
      <ul className="mt-3 list-disc pl-6 space-y-2">
        <li>Account email (for login and account recovery only).</li>
        <li>Encrypted chat and journal content. Only you can read it.</li>
        <li>Usage counters (messages/day) used for plan enforcement.</li>
      </ul>
      <h2 className="font-serif text-2xl mt-10">What we never do</h2>
      <ul className="mt-3 list-disc pl-6 space-y-2">
        <li>Sell or share your data with advertisers.</li>
        <li>Use your conversations to train any AI model.</li>
        <li>Log chat content in analytics or error monitoring.</li>
      </ul>
      <h2 className="font-serif text-2xl mt-10">Your rights</h2>
      <p className="mt-3">
        You can export everything we hold about you, or request deletion. Deletion is completed
        within 30 days, with a 7-day reversible grace period. Backups are purged on a rolling
        30-day window. EU users have GDPR rights of access, rectification, erasure, portability,
        and objection.
      </p>
      <h2 className="font-serif text-2xl mt-10">Russia (152-FZ)</h2>
      <p className="mt-3">
        For users whose personal data is collected within Russia, we follow Federal Law No. 152-FZ.
        Storage of identifiable personal data may be performed on infrastructure located in Russia;
        encrypted blobs may be stored abroad with keys held domestically.
      </p>
    </>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 prose-like">
      <h1 className="font-serif text-4xl">About Mira</h1>
      <p className="mt-6 text-ink/80 leading-relaxed">
        Mira is a quiet, private companion for the kinds of moments that don't quite warrant a
        therapist — and the moments where you just need to think out loud without being measured.
        It is not a clinical service. It is a place to slow down, name what's going on, and feel
        less alone with it.
      </p>
      <p className="mt-4 text-ink/80 leading-relaxed">
        Built with privacy as the default: conversations are encrypted at rest with a key only you
        unlock, never used to train any model, and yours to export or delete at any time.
      </p>
    </div>
  );
}

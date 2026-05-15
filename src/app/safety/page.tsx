import hotlines from "@/lib/safety/hotlines.json";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export const dynamic = "force-static";
export const metadata = { title: "Safety" };

interface HotlineLine {
  name: string;
  phone?: string;
  text?: string;
  hours?: string;
  lang?: string;
}
interface CountryEntry {
  name_en: string;
  name_ru: string;
  lines: HotlineLine[];
}

export default function SafetyPage() {
  const t = getDictionary("en");
  const countries = hotlines.countries as Record<string, CountryEntry>;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl">Mira</Link>
          <Link href="/" className="text-sm">← Back</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl">{t.safety.title}</h1>
        <p className="mt-4 text-ink/80 leading-relaxed">{t.safety.intro}</p>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">{t.safety.international}</h2>
          <div className="mt-4 rounded-2xl border border-ink/10 p-5 bg-paper">
            <div className="font-medium">{hotlines.international_fallback.name}</div>
            <p className="text-sm text-ink/70 mt-1">
              {hotlines.international_fallback.description.en}
            </p>
            <a
              href={hotlines.international_fallback.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline mt-2 inline-block"
            >
              {hotlines.international_fallback.url}
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">{t.safety.by_country}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(countries).map(([code, c]) => (
              <div key={code} className="rounded-2xl border border-ink/10 p-5 bg-paper">
                <div className="font-medium">
                  {c.name_en} · {c.name_ru}
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {c.lines.map((l) => (
                    <li key={l.name}>
                      <div>{l.name}</div>
                      {l.phone && <div className="text-ink/70">☎ {l.phone}</div>}
                      {l.text && <div className="text-ink/70">✉ {l.text}</div>}
                      {l.hours && <div className="text-ink/50 text-xs">{l.hours}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-xs text-ink/50">
          Hotlines version {hotlines.version}. Next review: {hotlines.review_due}. If something
          here is out of date, please email safety@mira.example.
        </p>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Companion } from "@/components/companion/Companion";
import { getDictionary } from "@/lib/i18n";

export default function LandingPage() {
  const t = getDictionary("en");
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <div className="flex justify-center mb-10">
        <Companion size={140} />
      </div>
      <h1 className="font-serif text-5xl leading-tight tracking-tight">{t.marketing.hero_title}</h1>
      <p className="mt-6 text-lg text-ink/75 max-w-2xl mx-auto">{t.marketing.hero_sub}</p>
      <div className="mt-10 flex gap-4 justify-center">
        <Link href="/sign-in" className="rounded-full bg-ink text-paper px-6 py-3">
          {t.marketing.cta_start}
        </Link>
        <Link href="/pricing" className="rounded-full border border-ink/20 px-6 py-3">
          {t.marketing.cta_pricing}
        </Link>
      </div>
      <p className="mt-12 text-sm text-ink/60 max-w-xl mx-auto">{t.marketing.not_clinical}</p>
    </div>
  );
}

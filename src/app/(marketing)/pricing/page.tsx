import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    rubPrice: null,
    bullets: ["30 messages / day", "Conversation in-session only", "Sonnet model"],
    cta: "Start free",
    href: "/sign-in",
  },
  {
    name: "Pro",
    price: "$9 / mo",
    rubPrice: "~700 ₽ / мес",
    bullets: ["Unlimited messages", "History & journal", "Voice input", "Sonnet with extended thinking"],
    cta: "Choose Pro",
    href: "/sign-in?plan=pro",
    highlight: true,
  },
  {
    name: "Pro+",
    price: "$19 / mo",
    rubPrice: "~1500 ₽ / мес",
    bullets: ["Everything in Pro", "Opus model", "Insights & audio exercises", "Multiple companions"],
    cta: "Choose Pro+",
    href: "/sign-in?plan=pro_plus",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-serif text-4xl text-center">Simple, honest pricing</h1>
      <p className="mt-4 text-center text-ink/70">
        Stripe for international cards, YooKassa for Russian cards. We pick automatically.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl p-6 border ${
              p.highlight ? "border-sage bg-sage/10" : "border-ink/10 bg-paper"
            }`}
          >
            <div className="font-serif text-2xl">{p.name}</div>
            <div className="mt-2 text-2xl">{p.price}</div>
            {p.rubPrice && <div className="text-sm text-ink/60">{p.rubPrice}</div>}
            <ul className="mt-5 space-y-2 text-sm">
              {p.bullets.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
            <Link
              href={p.href}
              className="mt-6 inline-block rounded-full bg-ink text-paper px-5 py-2 text-sm"
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

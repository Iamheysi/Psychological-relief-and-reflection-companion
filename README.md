# Mira

A private, AI-assisted wellness companion. **Not a medical service.**

> A web app providing on-demand conversational support from an AI styled as a
> thoughtful psychologist. Private by default, safe by default, encrypted, and
> yours.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY at minimum
pnpm dev
```

Open <http://localhost:3000>.

## Stack

- Next.js 15 (App Router) + React 19, TypeScript strict
- Tailwind CSS v4
- Anthropic Claude (Sonnet for free/Pro, Opus for Pro+, Haiku for the safety classifier)
- Postgres via Drizzle ORM
- Stripe (international) + YooKassa (Russia)
- Vercel hosting

See `02_technical_spec_for_claude_code.md` for the full architecture brief.

## Layout

See the spec §3 for the canonical tree. Notable entry points:

- `src/app/api/chat/route.ts` — streaming chat with safety pre-check (SSE).
- `src/lib/ai/safety.ts` — keyword + model-classifier crisis detection (mandatory; ≥80% test coverage target).
- `src/lib/ai/system-prompts.ts` — the Mira persona in English and Russian.
- `src/lib/safety/hotlines.json` — crisis hotlines by country (reviewed quarterly).
- `src/app/safety/page.tsx` — static, no-auth `/safety` page.
- `src/lib/db/schema.ts` — Drizzle schema (encrypted message/journal content).

## Safety

Mental-health-adjacent products without crisis handling are negligent. Before
any change to `src/app/api/chat/route.ts` or `src/lib/ai/safety.ts`, read
`docs/safety-protocols.md` and re-run the safety unit tests:

```bash
pnpm test tests/unit/safety.test.ts
```

## Scripts

- `pnpm dev` — local dev server
- `pnpm build` / `pnpm start` — production
- `pnpm typecheck` — TS strict check
- `pnpm test` — Vitest unit + integration
- `pnpm test:e2e` — Playwright (against a running server)
- `pnpm db:generate` / `pnpm db:migrate` — Drizzle migrations

## License

AGPL-3.0-only. See `LICENSE`. Brand assets (companion illustrations,
logotype, hand-drawn icons) are not covered by the AGPL grant — see
`docs/brand-license.md` (to be added).

## Security

Please report vulnerabilities privately. See `SECURITY.md`.

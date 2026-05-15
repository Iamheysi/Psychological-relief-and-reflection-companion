# Contributing

Thanks for your interest in Mira. Some ground rules specific to this product:

1. **Safety code is special.** Changes to `src/lib/ai/safety.ts` or
   `src/app/api/chat/route.ts` require a second reviewer and explicit
   re-run of the safety test suite in both English and Russian.
2. **No analytics on chat content.** Ever. Not even in dev.
3. **Encryption matters.** Don't log message content. Don't bypass the
   per-user-key envelope. Don't store plaintext to disk.
4. **The persona is product surface.** Treat `system-prompts.ts` like UI
   copy: version-controlled, reviewed, and translated, not machine-translated.

## Local dev

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

To work on the safety classifier with realistic prompts but without billing,
set `ANTHROPIC_API_KEY` to a sandbox key and run the unit tests rather than
hitting the live model.

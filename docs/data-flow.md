# Data flow

## Chat request

1. User types into `ChatView`. The client posts to `/api/chat` with
   `{ message, history, locale, tone, plan, messagesSentToday }`.
2. The server validates input (`zod`), checks the daily cap against the
   user's `usage_counters` row (in production — the dev stub trusts the
   client value).
3. The user's message runs through `evaluateSafety`:
   - keyword scan first;
   - if clean, the Haiku classifier is invoked.
4. The server composes a system prompt with `buildSystemPrompt`, optionally
   adding the safety overlay.
5. `client.messages.stream(...)` is called against Sonnet or Opus.
6. The response is streamed back as SSE:
   - `event: safety` (first frame) — UI shows the amber banner if flagged.
   - `event: token` — incremental text deltas.
   - `event: done` — final usage and stop reason.

## Storage

- Both the user message and the streamed assistant reply are persisted on
  request completion: encrypted with the user's per-user key (unwrapped
  from `profiles.encrypted_key` via the app key) and written to the
  `messages` table.
- `usage_counters` is incremented atomically.
- Crisis-flagged conversations include `safety_flag` JSON on the row but
  are otherwise stored identically.

## Encryption at rest

- App key (`APP_ENCRYPTION_KEY`, 32 random bytes, base64) is held by the
  runtime only — never written to the database.
- Each user has a per-user key generated at account creation, encrypted by
  the app key, stored as `profiles.encrypted_key`.
- All message and journal content is AES-256-GCM encrypted with the
  per-user key. See `src/lib/crypto.ts`.

## Analytics

- PostHog receives event names and plan/locale dimensions only.
- It does **not** receive message content, journal content, or any safety
  flag (positive or negative).
- Sentry has PII scrubbing on; request bodies are stripped before send.

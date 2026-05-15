# Security policy

## Reporting a vulnerability

Please email `security@mira.example` with details. We aim to acknowledge within
72 hours.

Please do **not** open public GitHub issues for security reports.

## Scope

In scope:

- The web app and its API routes
- The safety classifier (`src/lib/ai/safety.ts`)
- Database schema and encryption-at-rest implementation (`src/lib/crypto.ts`, `src/lib/db/`)
- Payment webhook handlers

Out of scope:

- Denial of service against rate-limited endpoints
- Self-XSS without a clear privilege boundary
- Reports against staging environments without explicit permission

## Coordinated disclosure

We follow a 90-day coordinated disclosure timeline by default, with extensions
agreed on a case-by-case basis when a fix requires schema migration.

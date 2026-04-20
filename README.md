# ChatPear

A production-oriented, minimalist AI chat web app built with Next.js App Router, TypeScript, Tailwind, Prisma, NextAuth, PostgreSQL, and OpenAI Responses streaming.

## Stack
- Next.js 14 (App Router)
- TypeScript + strict mode
- Tailwind CSS + shadcn-style primitives
- NextAuth (Credentials)
- Prisma + PostgreSQL
- OpenAI Responses API with server-side streaming
- Vitest for unit tests

## Architecture Summary
- `app/` contains routes, auth pages, chat pages, and API handlers.
- `components/` has modular UI/auth/layout/chat/markdown pieces.
- `server/` includes ownership checks, rate-limiting scaffold, and OpenAI abstraction.
- `lib/` contains environment parsing, prisma client singleton, validation, and model metadata.
- `prisma/` has schema and initial migration SQL.
- `tests/` validates title generation, schema constraints, and rate limiting/ownership helpers.

## Setup
1. Copy envs:
   ```bash
   cp .env.example .env
   ```
2. Install deps:
   ```bash
   npm install
   ```
3. Generate prisma client + migrate:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start app:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - local development
- `npm run build` - production build
- `npm run start` - run build output
- `npm run lint` - lint
- `npm run test` - unit tests

## Environment Variables
- `DATABASE_URL` PostgreSQL connection URL
- `NEXTAUTH_URL` app URL (e.g. http://localhost:3000)
- `NEXTAUTH_SECRET` random signing secret
- `OPENAI_API_KEY` server-side API key
- `OPENAI_MODEL_FAST` default fast model
- `OPENAI_MODEL_PRO` premium model

## Security Notes
- OpenAI key is server-only in `lib/env.ts` and used only in `server/openai/responses.ts`.
- Route-level auth checks with NextAuth and middleware.
- Ownership enforced by `assertConversationOwnership` before conversation/message writes.
- Zod validation used for all write payloads.
- Basic in-memory rate limit scaffold on `/api/chat`.

## Migration Notes
- Initial migration is pre-generated in `prisma/migrations/20260420153000_init/migration.sql`.
- If schema changes, run:
  ```bash
  npx prisma migrate dev --name <change_name>
  ```

## Manual Steps Before Production
1. Use a managed PostgreSQL database.
2. Replace in-memory rate limiting with Redis-backed strategy.
3. Add CSRF-hardening and account verification/reset flows.
4. Configure HTTPS + secure cookies + stronger auth provider if desired.
5. Add observability (Sentry/log drains) and usage metering.

## Recommended v1.1 Features
- Regenerate endpoint using response id history.
- Editable/deletable individual messages.
- Conversation search and pagination.
- Per-user custom instructions UI wired to settings.
- Optional OAuth providers in addition to credentials.

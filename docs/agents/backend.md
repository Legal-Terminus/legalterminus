# Backend standards — logging, Firestore performance, validation, data model

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

## 📊 LOGGING STANDARDS (Backend)

**Use the structured logger — `console.*` is banned in `backend/src/`.**

- Import the shared pino logger: `import { logger } from "../config/logger.js";` (adjust depth). Inside a request handler prefer `req.log` (carries the request id) when available.
- **Object first, message second:** `logger.error({ err }, "Failed to create user")`, `logger.info({ uid, role }, "User updated")`. Put the `Error` object under the `err` key (pino serializes the stack) — never `err.message`, never string-concatenate context into the message.
- Levels: `error` (handled exceptions / failures), `warn` (recoverable anomalies), `info` (lifecycle/business events), `debug` (verbose dev detail, off in prod via `LOG_LEVEL`).
- **Never log secrets/PII**: no tokens, passwords, private keys, full Aadhaar/PAN. The logger redacts `authorization` / `password` / `private_key` / `hash`, but don't rely on it — don't pass them.
- `console.log`/`console.error` are only acceptable in standalone scripts (`backend/src/scripts/`) that run outside the server.

## ⚡ PERFORMANCE & DATA-ACCESS STANDARDS (Firestore)

**Designed to stay fast and cheap as data grows — Firestore bills per document read.**

1. **Never read a whole collection to filter/sort/count in memory.** No `collection().get()` followed by JS `.filter()`/`.sort()`/`.length` on the full set. Push work to Firestore: `where()`, `orderBy()`, `limit()`, and `.count()` aggregation.
2. **All list endpoints paginate.** Use `limit` + cursor (`startAfter(doc)`); return `{ data, nextCursor }`. Validate `limit`/`cursor` with `paginationSchema`. Frontend consumes with `useInfiniteQuery`; large tables use TanStack Virtual (see `UsersPage.tsx`).
3. **Counts via aggregation, not document reads.** Use `query.count().get()` (see `getUserCounts`) — one cheap query, accurate at any scale.
4. **Enrich by targeted lookup, not full scans.** To join/enrich, collect the keys you need and look them up in chunks of ≤30 via `where(field, "in", chunk)` / `array-contains-any` (see leads report) — cost scales with the working set, not the whole collection.
5. **Add the composite index** for any `where() + orderBy()` combo to `firestore.indexes.json`.
6. **Don't read Firestore on the hot path per request.** The auth role fallback is cached (`auth.middleware.js`); custom claims are the source of truth. `getDb()` is memoized — reuse it.

## ✅ INPUT VALIDATION STANDARDS (Backend)

- **Validate every write endpoint with a Zod schema** via `validate(schema)` middleware (`middleware/validate.middleware.js`). Schemas live in `backend/src/schemas/`. Use `.strict()` to reject unknown fields; the parsed value replaces `req.body`.
- Don't hand-roll `String(x).slice(...)` checks in controllers when a schema can express it. Controllers keep only **authorization** logic (e.g. `canAssignRole`) — not shape/format validation.
- Reuse field primitives (email/phone/name) across schemas so rules stay consistent.

## 🗃️ DATA MODEL HYGIENE

- **Single-tenant by decision.** The portal serves ONE organization. Never add `tenantId`, org scoping, or any multi-tenancy scaffolding — it is deliberate scope, not an oversight.
- **One field, one source of truth.** Don't mirror a value into a second field that must be kept in sync (the legacy `type`-mirrors-`role` pattern was removed — use `role` only).
- **firestore.rules must match real document paths.** When you add a collection/subcollection the client SDK can reach, add a matching rule (e.g. payments live at `users/{uid}/payments/{txnId}` — the rule is there, not at a top-level `/payments`). Everything else is denied by the catch-all.

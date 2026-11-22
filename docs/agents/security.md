# Security standards (backend API)

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

## 🔒 SECURITY STANDARDS (Backend API)

**MANDATORY for every new/changed endpoint. These rules exist because each was a real vulnerability found in a security review — do not regress them.**

### 1. Every route must declare its authorization
- **Default to locked.** A new route gets `verifyToken` + `requireRole(...)` UNLESS it is *intentionally* public.
- **Mutations are never public.** Any `POST` / `PUT` / `PATCH` / `DELETE` that writes data, and any `GET` that returns PII or internal data, MUST require `verifyToken` and an explicit `requireRole(...)`.
- **Only these are public:** the marketing-site contact-form `POST /api/contact`, `GET /api/public/pricing` (the website's prices — a read of what the site already shows; E24-S01), `GET /api/orders/config` and `POST /api/orders/webhook` (the payment gateway's message — authenticated by a signature over the raw body, never by a token; E24-S02), `POST /api/public/account/{password-reset,sign-in-link}` (the sign-in page's "can't get in" requests — per-IP limit, `.strip()` schema, uniform 202; see `routes/publicAccount.routes.js`, #203), payment gateway callbacks (`/api/payment/redirect`), public content **reads** (`GET` blogs/categories/employees/testimonials), and `GET /api/auth/firebase-config`. Anything else is authenticated.
- Pattern for content management routes:
  ```js
  router.get("/all", getAll);                          // public read
  const manage = [verifyToken, requireRole("admin", "manager")];
  router.post("/create", ...manage, create);           // protected write
  router.delete("/delete/:id", ...manage, remove);     // protected delete
  ```
- ⚠️ A handler-internal role check is NOT a substitute for a route guard — put `requireRole` on the route so unauthorized requests never reach handler logic.

### 2. Never trust the client for identity, role, price, or amount
- **User identity comes from the verified token only:** `req.user.uid` — NEVER from `req.body.userId` / query params.
- **Role comes from `req.user.role`** (set by `verifyToken`) — NEVER from the request body/query/header.
- **Authorization to assign a role** goes through `canAssignRole(req.user.role, targetRole)` (in `backend/src/config/roles.js`). Never inline `req.user.role === "admin"` string checks — use `requireRole` + the role service so the escalation guard is consistent everywhere.
- **Payment amounts/prices must be resolved server-side** from a trusted source, never taken from the client. For gateway callbacks, trust only hash-verified fields (PayU `udf*`) or the gateway's Verify API — never unsigned query params.

### 3. Never leak internal errors to clients
- On `catch`, **log the real error server-side** (`console.error("[CONTEXT]", error)`) and return a **generic** message:
  ```js
  } catch (error) {
    console.error("[CREATE_USER_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
  }
  ```
- ❌ NEVER `res.json({ error: error.message })` or `{ message: error.message }` for 5xx — it exposes Firestore/stack internals. (Deliberate 4xx validation messages you authored are fine.)

### 4. Validate and sanitize all input
- Strip HTML/tags, clamp string lengths, and validate format (email/phone) on every user-supplied field before writing to Firestore. Mirror the pattern in `contact.controller.firestore.js` (`stripTags`, length limits, email regex).

### 5. File uploads
- `multer` configs MUST set a `fileFilter` with a **mimetype allowlist** (`image/jpeg|png|webp`) AND a `limits.fileSize` cap. Reject everything else before processing.

### 6. App-wide middleware (already in `server.js` — keep it)
- `helmet` (security headers), rate limiting (strict on `/api/auth`, `/api/payment`, `/api/contact`), `express.json({ limit: "1mb" })`, and a global error handler that hides internals. New sensitive public endpoints should be added to the strict rate limiter.

### 7. Secrets & keys
- Service-account JSON, `.pem`, `.key`, `.p12`, and any `.env*` (except `.env.example`) are gitignored — never commit them. If a key is ever exposed, **rotate it** (don't just delete the file): GCP service-account keys via `gcloud iam service-accounts keys create/delete`, then update local env + GitHub Secrets together.

### 8. Document downloads are proxied through the backend
- File/document downloads MUST stream through an authenticated backend endpoint (`verifyToken` + role/ownership check) — the backend fetches from Storage and pipes the bytes to the client.
- **NEVER return a client-visible signed URL** (even short-lived): signed links leak via history/logs/sharing and bypass role checks for their lifetime.

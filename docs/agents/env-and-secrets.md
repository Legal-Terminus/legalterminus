# Environment variables and secrets

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

### 🔐 Environment Variables & Secrets Management

**NEVER hardcode:**
- API keys, tokens, secrets
- Firebase credentials
- Database URLs or connection strings
- Feature flags or feature URLs
- Admin emails or internal IDs

**Environment file strategy (best practices):**

| File | Purpose | Who | Committed? |
|------|---------|-----|------------|
| `.env.local` | Local development secrets | Developer | ❌ No (in .gitignore) |
| `.env.example` | Template showing structure | Everyone | ✅ Yes |
| GitHub Secrets | CI/CD secrets (QA/Prod) | GitHub Actions | N/A |

**All three apps use the same naming:**
- Frontend: `.env.local` + `.env.example`
- Backend: `.env.local` + `.env.example` (NOT `.env.qa`)
- Portal: `.env.local` + `.env.example`

**GitHub Secrets format:** `BACKEND_FIREBASE_PRIVATE_KEY`, `FRONTEND_API_URL`, etc.

### When adding new env variables or GitHub Secrets:
1. Add to `.env.example` (empty value only, no secrets)
2. Add to `.env.local` with actual value (for local testing)
3. Add to GitHub Secrets via Settings → Secrets and variables → Actions
4. **Update ALL related workflows** to export the new secret as an env var:
   - `.github/workflows/firebase-preview-qa.yml` (QA deployment)
   - `.github/workflows/firebase-prod.yml` (if exists)
   - Any other CI/CD workflows
5. Update `spec.md` if this is a new feature configuration

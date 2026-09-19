# Ambyflow → Legal Terminus release sync

Legal Terminus runs in **production**. Ambyflow is where features and fixes are
written. Nothing reaches LT without passing through here first.

```
  Ambyflow main
        │  release cut          →  vX.Y.Z
        ▼
  LT-QA workspace               →  the team tests the release
        │  approved
        ▼
  LT repo                       →  vX.Y.Z-lt.N
        │
        ▼
  LT production                 →  deploy, confirm on /health
```

## The version scheme

An LT tag names the Ambyflow release it carries, plus an LT-local counter:

| Tag | Means |
|---|---|
| `v1.2.0-lt.1` | Ambyflow v1.2.0, first LT build of it |
| `v1.2.0-lt.2` | an LT-only patch on top of the same Ambyflow code |

The base version answers *"which Ambyflow code is this?"* at a glance. The
suffix exists because LT is production and will eventually need a fix that
cannot wait for the next Ambyflow release — and tagging that as a plain
`v1.2.1` would claim an Ambyflow release that does not contain it.

**Releases are taken in order. Nothing is skipped.** A release with nothing
applicable to LT still gets an LT tag (a no-op sync), so the numbers never
diverge and "same base version = same code" stays true. A gap in the sequence
would otherwise need explaining every time someone reads the history.

## Why this is a ledger, not a git operation

The two repositories have **no shared commit history** — Ambyflow was
generalised out of the LT codebase and re-started, so not one SHA is common to
both. Nothing can be cherry-picked, and `git log A..B` cannot tell you what LT
is missing.

So what has been ported is recorded here, by hand, at the moment it happens.
`npm run sync:status` compares the tags; this file records the judgement that
went with each one.

## The ledger

| Ambyflow | LT tag | Ported | What carried across |
|---|---|---|---|
| — | `v1.0.0` | 2026-09-19 | Production baseline, before the sync process existed. LT's own 1198-commit history. |
| `v1.1.0` | `v1.1.0-lt.1` | 2026-09-19 | **Baseline alignment, not a code port.** Sets both repos to the same release number so drift is measurable from here. Carried across: versioning (`/health` build identity, release script), the sync process and this ledger, the client-activity fixes (raw HTML → formatted text, `COMPLETE_STEP` → "Step completed"). |

*Add a row when an Ambyflow release reaches LT. An Ambyflow release that is not
applicable still gets a row, marked "no-op — nothing applicable".*

### Known gap at the baseline

`v1.1.0-lt.1` aligns the NUMBERS; it does not claim LT contains every Ambyflow
feature. LT is missing several whole epics — conditions and client data
collection (E34), the statutory deadline engine (E35), the customer workbook
export (E37.4), service deletion, and the multi-assignee step work — plus the
multi-tenant and platform machinery that will never apply.

That is deliberate. Those are features, not fixes: each needs porting by
content and testing on LT-QA before it reaches production, which is exactly the
process below. Tagging them as "synced" without that work would make the
version number lie.

**So read `v1.1.0-lt.1` as: same release line, same recent fixes, features
still to come.** The next sync that ports a feature says so in its row.

## Cutting a sync

1. **Check what is pending**

   ```bash
   npm run sync:status            # both repos, side by side
   npm run sync:status -- --verbose
   ```

2. **Test on LT-QA.** The workspace exists for exactly this. Sign in as the
   seeded roles and exercise what the release touched.

3. **Apply the changes to the LT repo.** By content, not cherry-pick — see
   above. Only what is applicable: the marketing site is a separate repo, and
   `/platform/*` is Ambyflow's own business console, which LT has no use for.

4. **Tag and publish**

   ```bash
   cd <lt-repo>
   git tag -a v1.2.0-lt.1 -m "Ambyflow v1.2.0"
   git push --follow-tags
   gh release create v1.2.0-lt.1 --notes-file <notes>
   ```

   The release notes must name the Ambyflow release they came from, so the
   lineage is readable from the Releases page without opening this file.

5. **Add a row to the ledger above**, and deploy.

6. **Confirm what is live**

   ```bash
   curl -s https://<lt-backend>/health
   ```

   `/health` reports `{ version, commit, builtAt }`. If `commit` is `unknown`,
   the deploy pipeline is not passing `APP_VERSION` / `GIT_SHA` / `BUILT_AT` —
   fix that rather than guessing what is running.

## What never syncs

- **The marketing site** (`cometflowwebsite`) — its own repo and release line.
- **`/platform/*`** — tenant provisioning, licence plans, the sales-lead inbox.
  Ambyflow's business console, not part of the product LT runs.
- **Multi-tenancy machinery** — workspace resolution, the control plane. LT is
  a single installation; these have no meaning there.
- **BMAD artifacts and internal docs** — `_bmad-output/`, `docs/business/`.

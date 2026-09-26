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
| `v1.1.0` | `v1.1.0-lt.2` | 2026-09-19 | **E37.4 — firm workbook export.** `GET /api/reports/workbook`, admin-only. Ported by content: `req.db` → module `db`, workspace vocabulary → firm. 9 tests came with it (suite 56 → 65). Adds `xlsx`. |
| `v1.1.0` | `v1.1.0-lt.3` | 2026-09-19 | **E35 — statutory deadline engine.** Date-anchored `dueRule`s (forward, backward, statutory) + the firm-editable calendar at `/api/settings/statutory-calendar`. Wired into matter creation and every transition through one resolver. 25 tests. |
| `v1.1.0` | `v1.1.0-lt.3` | 2026-09-19 | **E34 — step conditions & form steps.** Server-evaluated `stepCondition` on the matter, and `GET/PUT /api/tasks/:id/form/:stepNumber`. 38 tests. |
| `v1.1.0` | `v1.1.0-lt.4` | 2026-09-19 | **E34/E35 screens.** Settings → Statutory Calendar; deadline-rule and condition editors in the workflow editor; the form step on the matter page. Backends shipped in `-lt.3` with no way to reach them. |
| `v1.1.0` | `v1.1.0-lt.5` | 2026-09-19 | **E28 — rebuilt workflow editor.** 1083-line page → 431 + extracted step components, so the -lt.4 deadline/condition editors sit inside StepCard rather than bolted below the form. Library seeding and the automation runtime deliberately excluded. |
| `v1.1.0` | `v1.1.0-lt.6` | 2026-09-19 | **Fixes.** The public-API IPv6 rate-limit bypass (E21-S02, from Ambyflow `74a2604`); editor behaviour the E28 port regressed; e2e advances by authored position, not step number (#195). *Row added retroactively on 2026-09-26: this tag was cut without one.* |
| `v1.2.0` | `v1.2.0-lt.1` | 2026-09-26 | **Epic 42 — Legal Terminus production feedback.** #204 client completes client-assigned steps, #192 every assignee can complete a shared step, #198 internal step reminders, #199 activity newest-first, #200 @mentions (+ autosuggest), #201 client contact in the matters list, #202 amount paid from the payment history (LT `0020e28d`, `9e8e903f`). Story 42.8: deleted users refused at once on every route, reopen by flow position (LT `ccb58237`, adapted to single-tenant auth). **Not ported, not applicable:** platform-console build exclusion (`b65358a` — LT has no platform console); the end-user manual and its release notes (`d01b1c8`, `e04789b`, `e69c965` — LT has no docs site); GitHub-Release step in the release script (`6e8a83f` — LT releases are cut by hand per this file); `automationLog.at` index (LT has no collection-group automation-log query). **Not ported yet:** DataGrid table semantics (accessibility; LT's grid has diverged). **LT-only at this tag:** #196/#197 Lead Dashboard fields and the DM Cost / Income / Reporting module (`86885f44`). |

*Add a row when an Ambyflow release reaches LT. An Ambyflow release that is not
applicable still gets a row, marked "no-op — nothing applicable".*

### Known gap at the baseline

`v1.1.0-lt.1` aligns the NUMBERS; it does not claim LT contains every Ambyflow
**All queued epics are now ported.** E37.4 (workbook export), E35 (statutory
deadlines) and E34 (conditions and forms) are in LT as of `v1.1.0-lt.3`; the
multi-assignee step work (#192) was applied directly earlier.

What remains unported is deliberate and always will be: the multi-tenant
machinery (workspace resolution, the control plane) and the platform console,
neither of which has meaning in a single-firm installation. Service deletion is
the one open item — small, and not yet requested.

LT's backend test suite went 56 → 128 across the three ports, because the tests
travelled with the code rather than being left behind.

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

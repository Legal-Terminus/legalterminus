# How changes reach QA and production

Legal Terminus uses **trunk-based delivery** (adopted 2026-10-04).

```
short-lived branch ──merge──▶ main ──automatic──▶ QA          https://legal-terminus-qa.web.app
                                │
                                └── tag vX.Y.Z-lt.N ──approval──▶ PRODUCTION   https://legalterminus.com
```

| What you do | What happens |
|---|---|
| Merge to `main` | `deploy-qa.yml` deploys the changed apps to QA. Production does not move. |
| Push a tag `vX.Y.Z-lt.N` on a commit of `main` | `deploy-production.yml` waits for approval, then deploys the whole tagged commit to production. |
| Run "Deploy to Production" by hand in GitHub Actions | The same, for one or more apps, also behind the approval. |

## Rules

1. **`main` is the only long-lived branch.** Work on a short-lived branch and
   merge it within a day or two. There is no `qa` or `release` branch.
2. **Everything on `main` must be safe to release.** Unfinished work goes in
   switched OFF — behind a setting, or simply not linked from any page — because
   the next release tag ships whatever `main` contains. "Buy Now" on the website
   is hidden for exactly this reason while payments are built.
3. **Look at it on QA before tagging.** A tag is a statement that this commit was
   seen working on QA.
4. **A production release is a tag.** The version in the tag is what `/health`
   reports and what `docs/releases/SYNC.md` records.
5. **An urgent fix is a normal change:** merge to `main`, check QA, tag. If `main`
   holds something that cannot ship and is not switched off, branch from the last
   release tag, fix there, tag that — and fix the missing switch afterwards.

## The approval

The production job runs in the GitHub Environment `production`. Its **required
reviewers** are the approval: the job waits until one of them approves it in the
Actions tab. They are set by a repository admin under
*Settings → Environments → production → Required reviewers*.

**If no reviewer is configured, a tag deploys immediately.** Check before tagging.

## Cutting a release

```bash
git checkout main && git pull
git tag -a v1.6.0-lt.1 -m "Ambyflow v1.6.0"
git push origin v1.6.0-lt.1          # starts the production deploy, pending approval
gh release create v1.6.0-lt.1 --notes-file <notes>
```

Then add the row to `docs/releases/SYNC.md`.

Anything a release needs in the live database — a seed, an index, a new setting —
is done before or with the release and listed in its notes. QA has its own
database, so data set up on QA is **not** in production.

## What QA is

A second deployment inside the live project, with its own database and files but
the same sign-in accounts. See `docs/qa-environment.md` — especially before
running any seed script.

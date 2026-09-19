#!/usr/bin/env node
/**
 * Where is Legal Terminus, relative to Ambyflow?
 *
 *   npm run sync:status
 *   npm run sync:status -- --verbose      # list the commits in each pending release
 *
 * WHY THIS EXISTS. Ambyflow is where features and fixes land. They are tested
 * on the LT-QA workspace, and only once approved are they pushed to the LT
 * repo, which is production. That makes "which Ambyflow release is LT actually
 * on, and what is waiting?" the question that governs every release
 * conversation — and until now it could only be answered by reading two git
 * logs side by side.
 *
 * ── The version scheme ──
 *
 * LT tags carry the Ambyflow release they came from, plus an LT-local counter:
 *
 *   v1.2.0-lt.1     ← Ambyflow v1.2.0, first LT build of it
 *   v1.2.0-lt.2     ← an LT-only patch on top of the same Ambyflow release
 *
 * So the base version answers "which Ambyflow code is this?" at a glance, and
 * the suffix leaves room for the hotfix LT will eventually need without
 * pretending it came from an Ambyflow release that does not contain it.
 *
 * ── Read-only ──
 *
 * This reports; it does not push, tag or port anything. Making the drift
 * visible is the first job, and a tool that silently moves code between two
 * repositories is where quiet mistakes live.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Run from the LT repo: the OTHER repo is Ambyflow. Same comparison, mirrored.
const LT_DIR = process.env.LT_REPO_DIR ?? process.cwd();
const AMBY_DIR = process.env.AMBYFLOW_REPO_DIR
  ?? path.resolve(process.cwd(), '../../cometflow');

const verbose = process.argv.includes('--verbose');

const sh = (cmd, cwd = process.cwd()) => {
  try {
    return execSync(cmd, { encoding: 'utf8', cwd, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
};

const die = (msg) => { console.error(`✖ ${msg}`); process.exit(1); };

if (!existsSync(AMBY_DIR)) {
  die(`Ambyflow repo not found at ${AMBY_DIR}\n  set AMBYFLOW_REPO_DIR to override.`);
}

/** `v1.2.0` → { major, minor, patch, lt: null }; `v1.2.0-lt.3` → { …, lt: 3 }. */
function parseTag(tag) {
  const m = /^v(\d+)\.(\d+)\.(\d+)(?:-lt\.(\d+))?$/.exec(tag);
  if (!m) return null;
  return {
    tag,
    base: `${m[1]}.${m[2]}.${m[3]}`,
    major: +m[1], minor: +m[2], patch: +m[3],
    lt: m[4] === undefined ? null : +m[4],
  };
}

/** Semver order; an -lt build sorts AFTER the plain release it derives from. */
const cmp = (a, b) => (a.major - b.major) || (a.minor - b.minor)
  || (a.patch - b.patch) || ((a.lt ?? -1) - (b.lt ?? -1));

const tagsIn = (dir) => sh('git tag', dir).split('\n')
  .map(parseTag).filter(Boolean).sort(cmp);

const ambyTags = tagsIn(AMBY_DIR).filter((t) => t.lt === null);
const ltTags = tagsIn(LT_DIR);

if (!ambyTags.length) die('Ambyflow has no release tags yet — run `npm run release` first.');

const ambyLatest = ambyTags[ambyTags.length - 1];
const ltLatest = ltTags.length ? ltTags[ltTags.length - 1] : null;

// What LT has NOT yet taken: every Ambyflow release newer than LT's base.
const pending = ltLatest
  ? ambyTags.filter((t) => cmp(t, { ...ltLatest, lt: null }) > 0)
  : ambyTags;

const line = (s = '') => console.log(s);

line();
line('  Ambyflow → Legal Terminus');
line('  ─────────────────────────');
line(`  Ambyflow   ${ambyLatest.tag}`);
line(`  LT         ${ltLatest ? ltLatest.tag : '(no releases)'}`
  + (ltLatest?.lt ? `   ← LT build ${ltLatest.lt} of Ambyflow ${ltLatest.base}` : ''));
line();

if (!pending.length) {
  line(`  \u2714 In sync. LT is on Ambyflow ${ltLatest.base}.`);
  line();
  process.exit(0);
}

line(`  ${pending.length} release${pending.length === 1 ? '' : 's'} pending for LT:`);
line();

// The two repositories share NO commit history — Ambyflow was generalised out
// of the LT codebase and re-started, so `git log A..B` cannot say what LT is
// missing. What each release contains is read from the Ambyflow CHANGELOG,
// which the release script generates; what has actually been ported is
// recorded by hand in docs/releases/SYNC.md.
const ambyChangelog = path.join(AMBY_DIR, 'CHANGELOG.md');
const changelog = existsSync(ambyChangelog) ? readFileSync(ambyChangelog, 'utf8') : '';

/** The CHANGELOG section for one tag, as its own lines. */
function notesFor(tag) {
  const start = changelog.indexOf(`## ${tag}`);
  if (start < 0) return [];
  const next = changelog.indexOf('\n## v', start + 4);
  return changelog.slice(start, next > 0 ? next : undefined)
    .split('\n').slice(1).filter((l) => l.trim());
}

/**
 * Lines that cannot apply to LT. The marketing site is a separate repo and
 * `/platform/*` is Ambyflow's own business console; flagging them keeps the
 * reviewer's attention on what actually has to be ported.
 */
const isNotApplicable = (l) =>
  /\*\*(platform|website|pricing|catalog|release)\*\*/i.test(l)
  || /marketing site|platform console|workspace|tenant|multi-tenan/i.test(l);

for (const rel of pending) {
  const notes = notesFor(rel.tag);
  const items = notes.filter((l) => l.startsWith('- '));
  const applicable = items.filter((l) => !isNotApplicable(l));
  const skipped = items.length - applicable.length;

  line(`    ${rel.tag}  ${applicable.length} to review`
    + (skipped ? `, ${skipped} likely not applicable` : '')
    + (items.length ? '' : '  (no changelog section)'));

  if (verbose) {
    for (const l of applicable) line(`        ${l.replace(/^- /, '+ ')}`);
    for (const l of items.filter(isNotApplicable)) {
      line(`        ${l.replace(/^- /, '\u00b7 ')}   (check)`);
    }
    line();
  }
}

if (!verbose) {
  line();
  line('  --verbose to list what each release contains.');
}

line();
line(`  Next LT tag would be:  v${pending[pending.length - 1].base}-lt.1`);
line('  Process + ledger:      docs/releases/SYNC.md');
line();

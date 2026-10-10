/**
 * Run the content check on every static route of the site (E-25).
 *
 *   node scripts/theme/content-check-all.mjs <baseA> <baseB> [outFile] [--ignore-case]
 *   node scripts/theme/content-check-all.mjs https://legalterminus.com http://localhost:5186 report.txt
 *
 * Routes come from src/App.jsx. Prints one line per route and a summary; the
 * full output of every differing route goes to outFile.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const [baseA, baseB, outFile, ...flags] = process.argv.slice(2);
const app = fs.readFileSync(new URL("../../src/App.jsx", import.meta.url), "utf8");
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
  .filter((p, i, a) => a.indexOf(p) === i && !p.includes(":") && !p.includes("*") && !/my-profile|payment/.test(p));
const script = fileURLToPath(new URL("./content-check.mjs", import.meta.url));
const run = (path) => new Promise((res) => execFile("node", [script, baseA + path, baseB + path, ...flags], { maxBuffer: 1 << 24, timeout: 300_000 }, (err, stdout, stderr) => res({ path, ok: !err, out: stdout + stderr })));

const results = []; let i = 0;
const worker = async () => { while (i < routes.length) { const r = await run(routes[i++]); results.push(r); console.log(`${r.ok ? "same  " : "DIFFER"} ${r.path}`); } };
await Promise.all([worker(), worker(), worker()]);
const bad = results.filter((r) => !r.ok);
console.log(`\n${results.length - bad.length} of ${results.length} routes identical; ${bad.length} differ.`);
if (outFile) fs.writeFileSync(outFile, bad.map((r) => `### ${r.path}\n${r.out}\n`).join("\n"));
process.exit(bad.length ? 1 : 0);

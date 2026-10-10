#!/usr/bin/env python3
"""
Find the families of copied components (E-25).

The website's ~1,100 component stylesheets are copies of a few originals with the
class-name prefix changed. This groups them: two stylesheets are in the same
cluster when they are identical after every class name is replaced by a
placeholder numbered in order of first appearance. For a cluster, the n-th class
of one member IS the n-th class of every other member — which gives an exact
class-to-class mapping without guessing from names.

  python3 scripts/theme/clusters.py            # summary of clusters
  python3 scripts/theme/clusters.py --json out # write the full mapping
  python3 scripts/theme/clusters.py --relaxed  # same selector structure, any values
"""
import glob, hashlib, json, os, re, sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "src")
CLASS = re.compile(r"\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)")

def strip(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"@import[^;]+;", "", css)
    return re.sub(r"\s+", " ", css).strip()

def signature(css, relaxed=False):
    """(hash, ordered class list). Classes only count inside selectors."""
    css = strip(css)
    order = []
    # walk: text before "{" is a selector (or at-rule prelude); text before "}" is declarations
    tokens = re.split(r"([{}])", css)
    res = []
    for idx, tok in enumerate(tokens):
        if tok in ("{", "}"):
            res.append(tok); continue
        following = tokens[idx + 1] if idx + 1 < len(tokens) else ""
        if following == "{":  # selector or at-rule prelude
            def sub(m):
                name = m.group(1)
                if name not in order: order.append(name)
                return f".C{order.index(name)}"
            res.append(CLASS.sub(sub, tok.strip()))
        else:
            # declarations: normalise spacing and case, sort so property order is irrelevant
            if relaxed:
                continue  # same selectors in the same order is enough: values were hand-tweaked per copy
            decls = sorted(d.strip().lower().replace(" ", "") for d in tok.split(";") if d.strip())
            res.append(";".join(decls))
    return hashlib.sha1("".join(res).encode()).hexdigest()[:12], order

def main():
    clusters = {}
    for path in sorted(glob.glob(os.path.join(ROOT, "Components", "*", "*.css"))):
        sig, order = signature(open(path, encoding="utf-8", errors="ignore").read(), relaxed="--relaxed" in sys.argv)
        if not order: continue
        clusters.setdefault(sig, []).append((os.path.relpath(path, os.path.join(ROOT, "..")), order))
    groups = sorted(clusters.values(), key=len, reverse=True)
    multi = [g for g in groups if len(g) > 1]
    covered = sum(len(g) for g in multi)
    total = sum(len(g) for g in groups)
    print(f"{total} stylesheets; {len(multi)} clusters of identical copies cover {covered}; {total - covered} are unique")
    for g in multi[:40]:
        print(f"{len(g):4d}  {len(g[0][1]):3d} classes  e.g. {os.path.basename(g[0][0])}, {os.path.basename(g[1][0])}")
    if "--json" in sys.argv:
        out = sys.argv[sys.argv.index("--json") + 1]
        json.dump([[{"file": f, "classes": o} for f, o in g] for g in groups], open(out, "w"), indent=1)
        print("wrote", out)

if __name__ == "__main__":
    main()

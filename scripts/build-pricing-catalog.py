#!/usr/bin/env python3
"""
E24-S01 — build shared/pricing/catalog.json from the website's pricing components.

Every price on the website used to live in a `const PLANS = [...]` inside one of
83 components, and the checkout sent that number to the server to be charged.
This script reads those arrays ONCE into a catalogue the server owns. From then
on the catalogue in Firestore is the source of truth (seeded from this file by
`npm run db:seed:pricing`); the arrays in the components remain only as the
fallback shown if the price API cannot be reached.

Only components reachable from the app's routes are included: 21 of the 83 are
dead code, among them one that prices a trademark plan at Rs 1.

    python3 scripts/build-pricing-catalog.py            # write the catalogue
    python3 scripts/build-pricing-catalog.py --check    # fail if it would change

A product is keyed by the `source` its component passes to the checkout.
"""
import collections, glob, json, os, re, sys

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'Frontend', 'src')
OUT = os.path.join(ROOT, 'shared', 'pricing', 'catalog.json')

# Website product -> the portal service it corresponds to, where the two use
# different words. A product whose key equals a portal service key maps by
# itself. Everything else has no portal service yet (serviceKey: null) — a paid
# order for it cannot open a matter automatically.
SERVICE_ALIASES = {
    'change-address-company': 'change-company-address',
    'change-object-company': 'change-company-object',
    'change-name-llp': 'change-llp-name',
    'increase-authorised-capital': 'increase-capital',
    'dissolve-private': 'dissolve-private-limited',
    'gst-return-filing': 'gst-returns',
    'trademark-exam-reply': 'trademark-examination-reply',
    'proprietorship-to-private': 'proprietorship-to-company',
}

# Website keys that LOOK like a portal service key but name a different thing.
# Matching by key alone linked "Change of Company Name" (cic-registration) to the
# portal's "Community Interest Company Registration", and four more like it —
# a payment for one would have opened a matter for the other. These are never
# linked automatically; staff link them by hand under Website Prices.
NOT_THE_SAME = {'bc-registration', 'cic-registration', 'cio-registration', 'cir-registration', 'company-to-llp'}

def existing_codes():
    """key -> product code already issued. A code, once given, never changes or is reused."""
    if not os.path.exists(OUT): return {}
    return {k: v['code'] for k, v in json.load(open(OUT))['products'].items() if v.get('code')}

def portal_service_keys():
    seed = open(os.path.join(ROOT, 'backend', 'src', 'scripts', 'seedServiceConfig.js')).read()
    return set(re.findall(r"key: '([a-z0-9-]+)'", seed))

def number(raw):
    """`6999`, `"Rs.6,999"` -> 6999. None when there is no number."""
    raw = (raw or '').strip()
    if raw.startswith('"'):                      # "Rs.6,999" — a display string
        digits = re.sub(r'[^0-9]', '', re.sub(r'^"\s*Rs\.?', '', raw))
        return int(digits) if digits else None
    return int(float(raw)) if re.fullmatch(r'[0-9]+(\.[0-9]+)?', raw) else None

def title(key):
    return ' '.join(w.upper() if w in ('llp', 'gst', 'epf', 'esi', 'esic', 'iec', 'iso', 'itr', 'opc', 'plc', 'cic', 'cio', 'cir', 'bc', 'olwf', 'clra', 'fssai')
                    else w.capitalize() for w in key.split('-'))

def reachable(files):
    def resolve(frm, spec):
        if not spec.startswith('.'): return None
        base = os.path.normpath(os.path.join(os.path.dirname(frm), spec))
        for c in (base, base + '.jsx', base + '.js', os.path.join(base, 'index.jsx'), os.path.join(base, 'index.js')):
            if c in files: return c
    imp = re.compile(r'(?:from\s+|import\s*\(\s*|import\s+)["\']([^"\']+)["\']')
    start = [f for f in files if f.endswith((os.path.join('src', 'main.jsx'), os.path.join('src', 'App.jsx')))]
    seen, stack = set(start), list(start)
    while stack:
        f = stack.pop()
        for spec in imp.findall(files[f]):
            r = resolve(f, spec)
            if r and r not in seen:
                seen.add(r); stack.append(r)
    return seen

def _resolve(files, frm, spec):
    if not spec.startswith('.'): return None
    base = os.path.normpath(os.path.join(os.path.dirname(frm), spec))
    for c in (base, base + '.jsx', base + '.js', os.path.join(base, 'index.jsx'), os.path.join(base, 'index.js')):
        if c in files: return c

_IMPORT = re.compile(r'(?:from\s+|import\s*\(\s*|import\s+)["\']([^"\']+)["\']')

def page_titles():
    """route path -> the page's title, from the SEO metadata (the name people know a page by)."""
    seo = open(os.path.join(SRC, 'data', 'seoMeta.js')).read()
    out = {}
    for m in re.finditer(r"'(/[^']*)':\s*\{\s*title:\s*(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\")", seo):
        title = (m.group(2) or m.group(3) or '').replace("\\'", "'")
        out[m.group(1)] = re.sub(r'\s*[|–—-]\s*Legal Terminus\s*$', '', title).strip()
    return out

def routes_by_component(files):
    """pricing-component file -> [route path, ...]: every page of the site that shows it."""
    app_path = next(f for f in files if f.endswith(os.path.join('src', 'App.jsx')))
    app = files[app_path]
    lazy = {m.group(1): _resolve(files, app_path, m.group(2))
            for m in re.finditer(r'const (\w+) = (?:React\.)?lazy\(\(\) => import\(["\']([^"\']+)["\']\)\)', app)}
    for m in re.finditer(r'import (\w+) from ["\']([^"\']+)["\']', app):
        lazy.setdefault(m.group(1), _resolve(files, app_path, m.group(2)))
    out = collections.defaultdict(list)
    for m in re.finditer(r'<Route\s+path="([^"]+)"\s+element=\{<(\w+)', app):
        path, start = m.group(1), lazy.get(m.group(2))
        if not start: continue
        seen, stack = {start}, [start]
        while stack:
            f = stack.pop()
            for spec in _IMPORT.findall(files[f]):
                r = _resolve(files, f, spec)
                if r and r not in seen:
                    seen.add(r); stack.append(r)
        for f in seen: out[f].append(path)
    return out

def parse(source):
    plans = []
    for _name, body in re.findall(r'const ((?:DEFAULT_)?\w*PLANS\w*) = \[(.*?)\n\];', source, re.S):
        for chunk in re.split(r'(?=\{\s*id:\s*")', body):
            m = re.match(r'\{\s*id:\s*"([^"]+)"', chunk)
            if not m: continue
            name = re.search(r'\bname:\s*"([^"]+)"', chunk)
            price = re.search(r'\bprice:\s*("[^"]*"|[0-9.]+)', chunk)
            old = re.search(r'\boldPrice:\s*("[^"]*"|[0-9.]+)', chunk)
            plans.append({'id': m.group(1), 'name': name.group(1) if name else m.group(1),
                          'price': number(price.group(1)) if price else None,
                          'oldPrice': number(old.group(1)) if old else None})
    return plans

def build():
    files = {os.path.normpath(f): open(f).read() for f in glob.glob(os.path.join(SRC, '**', '*.js*'), recursive=True)}
    live = reachable(files)
    routes, titles = routes_by_component(files), page_titles()
    services = portal_service_keys()
    products, problems, notes = collections.OrderedDict(), [], []
    for f in sorted(files):
        s = files[f]
        if f not in live or not re.search(r'const (?:DEFAULT_)?\w*PLANS\w* = \[', s): continue
        # The tag contains `=>` (an arrow function), so it cannot be matched with
        # [^>]*: take everything up to the self-closing `/>` instead.
        tags = re.findall(r'<(?:Pro)?CheckoutModal\b.*?/>', s, re.S)
        keys = sorted({k for t in tags for k in re.findall(r'\bsource="([^"]+)"', t)})
        rel = os.path.relpath(f, ROOT)
        if len(keys) != 1:
            problems.append(f'{rel}: expected one checkout source, found {keys}'); continue
        key, plans = keys[0], parse(s)
        bad = [p['id'] for p in plans if not p['price'] or p['price'] < 100]
        if bad: problems.append(f'{rel}: no usable price for {bad}')
        ids = [p['id'] for p in plans]
        if len(ids) != len(set(ids)): problems.append(f'{rel}: duplicate plan ids {ids}')
        # Where on the site this is sold. The product is NAMED after its page:
        # staff know a service by the page they send customers to, not by the
        # key the code uses ("cio-registration").
        pages = [{'path': r, 'title': titles.get(r, '')} for r in sorted(routes.get(f, []), key=lambda r: (len(r), r))]
        if key in products:
            # Two components may sell the same product (a landing page and a
            # service page). They must agree on what is CHARGED; a differing
            # strikethrough price is reported but does not stop the build.
            charged = lambda ps: [(p['id'], p['price']) for p in ps]
            if charged(products[key]['plans']) != charged(plans):
                problems.append(f'{rel}: product "{key}" is also defined in {products[key]["components"][0]} with different plans')
            elif products[key]['plans'] != plans:
                notes.append(f'{rel} and {products[key]["components"][0]} show different strikethrough prices or names for "{key}"')
            products[key]['components'].append(rel)
            for pg in pages:
                if pg not in products[key]['pages']: products[key]['pages'].append(pg)
            continue
        service = None if key in NOT_THE_SAME else (key if key in services else SERVICE_ALIASES.get(key))
        named = next((pg['title'] for pg in pages if pg['title']), '')
        products[key] = {'label': named or title(key), 'serviceKey': service if service in services else None,
                         'plans': plans, 'pages': pages, 'components': [rel]}
    # Product codes: SVC-001, SVC-002, … Existing codes are kept; a new product
    # takes the next free number. The code is what staff and customers can quote
    # to say WHICH service, and it appears on the price screen, on orders and at
    # checkout — two pages can share a title, but never a code.
    codes = existing_codes()
    used = {int(c.split('-')[1]) for c in codes.values()}
    nxt = max(used, default=0) + 1
    for key in sorted(products):
        if key not in codes:
            codes[key] = f'SVC-{nxt:03d}'; nxt += 1
    products = collections.OrderedDict(
        (key, collections.OrderedDict([('code', codes[key]), *p.items()])) for key, p in products.items())
    return products, problems, notes

def main():
    products, problems, notes = build()
    for n in notes: print('note:', n)
    if problems:
        print('Cannot build the catalogue:\n  ' + '\n  '.join(problems)); sys.exit(1)
    text = json.dumps({'products': products}, indent=2, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        if not os.path.exists(OUT) or open(OUT).read() != text:
            print('shared/pricing/catalog.json is out of date — run scripts/build-pricing-catalog.py'); sys.exit(1)
        print('catalogue is up to date'); return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(text)
    plans = sum(len(p['plans']) for p in products.values())
    mapped = sum(1 for p in products.values() if p['serviceKey'])
    print(f'{len(products)} products, {plans} plans, {mapped} mapped to a portal service -> shared/pricing/catalog.json')

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Patch all pricing components to use CheckoutModal.
"""
import re
import os

BASE = r"c:\Users\Shipra\OneDrive\Desktop\Legal-Terminus Project\Frontend\src\Components"

SKIP = {"ProPlanandPricing.jsx", "BlogDetailsPricingPlans.jsx"}

PRICING_KEYWORDS = [
    "Plan", "plan", "Pric", "pric", "Plans", "plans",
    "WindupPLCPP", "PRFland", "LLRland", "BCplanand",
    "PublicltdRightPlan", "PublictoPrivateRightPlan", "CICplan", "ISOplan",
]


def strip_jsx_comments(text):
    """Remove JSX block comments {/* ... */} from text."""
    return re.sub(r'\{/\*.*?\*/\}', '', text, flags=re.DOTALL)


def extract_plans(content):
    """Extract plan data from JSX content by splitting on <article> tags."""

    # Remove commented-out card blocks so they aren't mistakenly parsed
    cleaned = strip_jsx_comments(content)

    # Find all <article ...>...</article> blocks
    articles = re.findall(r'<article\b[^>]*>(.*?)</article>', cleaned, re.DOTALL)

    if not articles:
        # Fall back: try old plan-* class strategy
        return extract_plans_legacy(content)

    plans = []
    for article in articles:
        # ── Name: first short text inside any *name* or *title* div ──────────
        name = None
        for pat in [
            r'className=["\'][^"\']*(?:name|title)[^"\']*["\'][^>]*>\s*([^<\n]+?)\s*</',
            r'<(?:h[2-4]|strong)[^>]*>\s*([^<\n]{2,40}?)\s*</(?:h[2-4]|strong)>',
        ]:
            m = re.search(pat, article)
            if m:
                candidate = m.group(1).strip()
                if candidate and len(candidate) < 50:
                    name = candidate
                    break
        if not name:
            continue

        # ── Price: last ₹ amount in the card (discounted > original) ─────────
        prices_raw = re.findall(r'₹([\d,]+)', article)
        if not prices_raw:
            continue
        price = int(prices_raw[-1].replace(',', ''))

        # ── Services: all <li> text in the card ──────────────────────────────
        services = [s.strip()
                    for s in re.findall(r'<li\b[^>]*>\s*([^<]+?)\s*</li>', article)
                    if s.strip()]

        plans.append({'name': name, 'price': price, 'services': services})

    return plans


def extract_plans_legacy(content):
    """Fallback using plan-* class names (original strategy)."""
    names = re.findall(
        r'className=["\'][^"\']*plan-name[^"\']*["\'][^>]*>\s*([^<\n]+?)\s*</', content
    )
    names = [n.strip() for n in names if n.strip()]

    prices_raw = re.findall(
        r'className=["\'][^"\']*plan-price[^"\']*["\'][^>]*>\s*₹([\d,]+)', content
    )
    prices = [int(p.replace(',', '')) for p in prices_raw]

    list_blocks = re.findall(
        r'className=["\'][^"\']*\bplan-list\b[^"\']*["\'][^>]*>(.*?)</(?:ul|ol)>',
        content, re.DOTALL
    )
    service_groups = []
    for block in list_blocks:
        svcs = re.findall(
            r'className=["\'][^"\']*plan-list-item[^"\']*["\'][^>]*>\s*([^<]+?)\s*<', block
        )
        svcs = [s.strip() for s in svcs if s.strip()]
        if svcs:
            service_groups.append(svcs)

    n = min(len(names), len(prices))
    if service_groups:
        n = min(n, len(service_groups))

    plans = []
    for i in range(n):
        plans.append({
            'name': names[i],
            'price': prices[i],
            'services': service_groups[i] if i < len(service_groups) else [],
        })
    return plans


def patch_gst_reg(content):
    """Special handler for data-driven GSTRegPlans component."""
    if 'CheckoutModal' in content or 'setActivePlan' in content:
        return 'SKIP', 'already processed'

    # Add CheckoutModal import after CSS import
    css_m = re.search(r'import ["\'][^"\']+\.css["\'];?\n', content)
    if not css_m:
        return 'ERROR', 'no css import'
    pos = css_m.end()
    content = (
        content[:pos]
        + 'import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";\n'
        + content[pos:]
    )

    # Add setActivePlan state (component already has useState for expanded)
    # Find existing useState call and add alongside it
    existing_state = re.search(r'const \[expanded, setExpanded\] = useState\(\{\}\);', content)
    if existing_state:
        pos = existing_state.end()
        content = (
            content[:pos]
            + '\n  const [activePlan, setActivePlan] = useState(null);'
            + content[pos:]
        )
    else:
        return 'ERROR', 'existing state not found'

    # Wire Buy Now button to open modal using current package data
    content = content.replace(
        '<button className="gst-reg-btn">Buy Now</button>',
        '<button className="gst-reg-btn" onClick={() => setActivePlan({ id: pkg.title.toLowerCase(), name: pkg.title, price: parseInt(pkg.price.replace(\'₹\', \'\')), services: pkg.features })}>Buy Now</button>'
    )

    # Wrap return in fragment and add modal
    ret_m = re.search(r'\n  return \(\n', content)
    if not ret_m:
        return 'ERROR', 'return not found'

    export_pos = content.rfind('\nexport default')
    close_pos = content.rfind('\n  );', 0, export_pos)
    if close_pos == -1:
        return 'ERROR', 'closing ); not found'

    ret_body = content[ret_m.end(): close_pos]
    modal = (
        '\n\n      {activePlan && (\n'
        '        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />\n'
        '      )}'
    )
    new_return = (
        '\n  return (\n'
        '    <>\n'
        + ret_body
        + modal + '\n'
        '    </>\n'
        '  );'
    )
    content = content[:ret_m.start()] + new_return + content[close_pos + len('\n  );'):]

    return 'OK', content


def plans_to_js(plans):
    lines = ['const PLANS = [']
    for i, p in enumerate(plans):
        comma = ',' if i < len(plans) - 1 else ''
        svcs = ', '.join(f'"{s}"' for s in p['services'])
        pid = p['name'].lower().replace(' ', '-')
        lines.append(
            f'  {{ id: "{pid}", name: "{p["name"]}", price: {p["price"]}, services: [{svcs}] }}{comma}'
        )
    lines.append('];')
    return '\n'.join(lines)


def process_file(filepath):
    fname = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'CheckoutModal' in content or 'setActivePlan' in content:
        return 'SKIP', 'already processed'
    if 'Buy Now' not in content:
        return 'SKIP', 'no Buy Now button'

    # Special handler for data-driven GST component
    if fname == 'GSTRegPlans.jsx':
        return patch_gst_reg(content)

    plans = extract_plans(content)
    if not plans:
        return 'ERROR', 'could not extract plan data'

    # ── 1. Ensure useState imported ─────────────────────────────────────────
    if 'useState' not in content:
        content = re.sub(
            r'import React from ["\']react["\']',
            'import React, { useState } from "react"',
            content,
        )
        content = re.sub(
            r'import React, \{([^}]+)\} from ["\']react["\']',
            lambda m: 'import React, {' + m.group(1).rstrip() + ', useState } from "react"'
            if 'useState' not in m.group(1) else m.group(0),
            content,
        )

    # ── 2. Add CheckoutModal import after CSS import ─────────────────────────
    css_m = re.search(r'import ["\'][^"\']+\.css["\'];?\n', content)
    if css_m:
        pos = css_m.end()
        content = (
            content[:pos]
            + 'import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";\n'
            + content[pos:]
        )
    else:
        imports = list(re.finditer(r'^import .+;\n', content, re.MULTILINE))
        if imports:
            pos = imports[-1].end()
            content = content[:pos] + 'import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";\n' + content[pos:]

    # ── 3. Insert PLANS constant before component ────────────────────────────
    comp_m = re.search(r'\nconst \w+\s*=\s*\(\)\s*=>\s*\{', content)
    if not comp_m:
        return 'ERROR', 'component definition not found'
    plans_js = plans_to_js(plans)
    content = content[:comp_m.start()] + '\n\n' + plans_js + '\n' + content[comp_m.start():]

    # ── 4. Add useState before return ────────────────────────────────────────
    ret_m = re.search(r'\n(\s+)return\s*\(', content)
    if not ret_m:
        return 'ERROR', 'return not found'
    indent = ret_m.group(1)
    content = (
        content[:ret_m.start()]
        + f'\n{indent}const [activePlan, setActivePlan] = useState(null);\n'
        + content[ret_m.start():]
    )

    # ── 5. Add onClick to each Buy Now button ────────────────────────────────
    btn_iter = list(re.finditer(r'<button\b[^>]*>Buy Now</button>', content))
    if not btn_iter:
        return 'ERROR', 'Buy Now buttons not found'

    offset = 0
    for i, m in enumerate(btn_iter):
        if i >= len(plans):
            break
        s, e = m.start() + offset, m.end() + offset
        old_btn = content[s:e]
        new_btn = re.sub(
            r'>Buy Now',
            f' onClick={{() => setActivePlan(PLANS[{i}])}}>Buy Now',
            old_btn, count=1,
        )
        content = content[:s] + new_btn + content[e:]
        offset += len(new_btn) - len(old_btn)

    # ── 6. Wrap return in fragment + add modal ───────────────────────────────
    export_pos = content.rfind('\nexport default')
    if export_pos == -1:
        return 'ERROR', 'export default not found'

    ret_m2 = re.search(r'\n(\s+)return\s*\(\n', content)
    if not ret_m2:
        return 'ERROR', 'return block not found'

    ret_indent = ret_m2.group(1)
    inner_indent = ret_indent + '  '
    modal_indent = ret_indent + '    '

    close_pos = content.rfind(f'\n{ret_indent});', 0, export_pos)
    if close_pos == -1:
        close_pos = content.rfind('\n  );', 0, export_pos)
    if close_pos == -1:
        return 'ERROR', 'closing ); not found'

    ret_body = content[ret_m2.end(): close_pos]
    modal_block = (
        f'\n\n{modal_indent}{{activePlan && (\n'
        f'{modal_indent}  <CheckoutModal plan={{activePlan}} onClose={{() => setActivePlan(null)}} />\n'
        f'{modal_indent})}}'
    )
    new_return = (
        f'\n{ret_indent}return (\n'
        f'{inner_indent}<>\n'
        f'{ret_body}'
        f'{modal_block}\n'
        f'{inner_indent}</>\n'
        f'{ret_indent});'
    )
    content = (
        content[:ret_m2.start()]
        + new_return
        + content[close_pos + len(f'\n{ret_indent});'):]
    )

    return 'OK', content


def main():
    all_files = []
    for root, dirs, files in os.walk(BASE):
        for fname in files:
            if fname in SKIP or not fname.endswith('.jsx'):
                continue
            if any(kw in fname for kw in PRICING_KEYWORDS):
                all_files.append(os.path.join(root, fname))

    ok, skipped, errors = [], [], []

    for filepath in sorted(all_files):
        fname = os.path.basename(filepath)
        status, result = process_file(filepath)

        if status == 'OK':
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(result)
            print(f'[OK   ] {fname}')
            ok.append(fname)
        elif status == 'SKIP':
            print(f'[SKIP ] {fname}: {result}')
            skipped.append(fname)
        else:
            print(f'[ERROR] {fname}: {result}')
            errors.append(f'{fname}: {result}')

    print(f'\nDone: {len(ok)} updated, {len(skipped)} skipped, {len(errors)} errors')
    for e in errors:
        print(f'  {e}')


if __name__ == '__main__':
    main()

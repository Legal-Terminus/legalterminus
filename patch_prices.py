#!/usr/bin/env python3
"""
Two jobs:
1. Replace hardcoded price strings inside the JSX plan cards with
   {PLANS[i].price.toLocaleString("en-IN")} so the card display and
   the checkout modal always read from the same PLANS constant.
2. Fix any PLANS prices that the previous script got wrong because a
   ₹ amount appeared inside a service description (e.g. TMApplica).
"""
import re
import os

BASE = r"c:\Users\Shipra\OneDrive\Desktop\Legal-Terminus Project\Frontend\src\Components"

# ── Manual overrides for prices the auto-script extracted incorrectly ────────
# Format: { "ComponentFileName.jsx": [(plan_index, correct_price), ...] }
PRICE_OVERRIDES = {
    # Elemental plan shows ₹1,499 on card — script grabbed ₹9,000 from service text
    "TMApplicaPlanandPricing.jsx": [(0, 1499)],
}


def apply_overrides(content, fname):
    if fname not in PRICE_OVERRIDES:
        return content, 0
    fixes = 0
    for idx, correct_price in PRICE_OVERRIDES[fname]:
        # Match the specific plan entry: price: WRONG_VALUE
        # We target the i-th { id: "...", ... } block
        plan_blocks = list(re.finditer(r'\{ id: "[^"]*"[^}]+\}', content))
        if idx >= len(plan_blocks):
            continue
        block = plan_blocks[idx]
        old_block = block.group(0)
        new_block = re.sub(r'price: \d+', f'price: {correct_price}', old_block)
        if new_block != old_block:
            content = content[:block.start()] + new_block + content[block.end():]
            fixes += 1
    return content, fixes


def replace_price_displays(content):
    """
    Find every JSX element whose className contains 'price' but NOT 'old',
    whose text content is a bare ₹X,XXX amount, and replace that amount
    with {PLANS[i].price.toLocaleString("en-IN")}.
    """
    if 'const PLANS' not in content:
        return content, 0

    # Count plans
    plans_count = content.count('{ id: "')
    if plans_count == 0:
        return content, 0

    # Regex: opening tag with className, price literal, closing tag
    # Group 1: opening tag (including className attribute)
    # Group 2: className value  (used to filter)
    # Group 3: optional whitespace before ₹
    # Group 4: digits+commas after ₹
    # Group 5: optional whitespace after
    # Group 6: closing tag
    pattern = re.compile(
        r'(<\w[\w]*\s+className=["\']([^"\']*)["\'][^>]*>)'   # open tag + className
        r'(\s*)₹([\d,]+)(\s*)'                                # ₹ price
        r'(</\w[\w]*>)',                                       # close tag
        re.DOTALL
    )

    plan_index = [0]
    replacements = [0]

    def replacer(m):
        classname = m.group(2)
        # Only target elements whose class contains "price" but not "old"
        cls_lower = classname.lower()
        if 'price' not in cls_lower or 'old' in cls_lower:
            return m.group(0)

        i = plan_index[0]
        plan_index[0] += 1
        replacements[0] += 1

        if i >= plans_count:
            # More price elements than plans — leave unchanged
            plan_index[0] -= 1
            replacements[0] -= 1
            return m.group(0)

        return (
            m.group(1)          # opening tag
            + m.group(3)        # leading whitespace
            + f'{{PLANS[{i}].price.toLocaleString("en-IN")}}'
            + m.group(5)        # trailing whitespace
            + m.group(6)        # closing tag
        )

    new_content = pattern.sub(replacer, content)
    return new_content, replacements[0]


def process_file(filepath):
    fname = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'PLANS' not in content:
        return 'SKIP', 'no PLANS constant'

    changed = False

    # Step 1: apply manual price overrides
    content, n_fixes = apply_overrides(content, fname)
    if n_fixes:
        changed = True

    # Step 2: replace hardcoded price displays with PLANS references
    content, n_replaced = replace_price_displays(content)
    if n_replaced:
        changed = True

    if not changed:
        return 'SKIP', 'nothing to change'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'OK', f'overrides={n_fixes}, price_displays={n_replaced}'


def main():
    all_files = []
    for root, dirs, files in os.walk(BASE):
        for fname in files:
            if fname.endswith('.jsx'):
                all_files.append(os.path.join(root, fname))

    ok, skipped = [], []
    for fp in sorted(all_files):
        status, msg = process_file(fp)
        fname = os.path.basename(fp)
        if status == 'OK':
            print(f'[OK   ] {fname}: {msg}')
            ok.append(fname)
        else:
            skipped.append(fname)

    print(f'\nDone: {len(ok)} updated, {len(skipped)} unchanged')


if __name__ == '__main__':
    main()

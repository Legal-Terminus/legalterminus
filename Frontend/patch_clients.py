import re, glob

files = glob.glob("src/Components/**/*.jsx", recursive=True)
patched = []

for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()

    if 'import client1 from "../../assets/our (1).webp"' not in content:
        continue

    rel = "../../assets/clientLogos"

    # Remove all individual client image imports
    content_new = re.sub(
        r'import client\d+ from "../../assets/our \(\d+\)\.webp";\n',
        "",
        content
    )

    # Replace logos array with single import + assignment
    content_new = re.sub(
        r'const logos = \[\n(?:[ \t]+client\d+(?:, client\d+)*,?\n)+\];',
        f'import {{ clientLogos }} from "{rel}";\nconst logos = clientLogos;',
        content_new,
        flags=re.DOTALL
    )

    if content_new != content:
        with open(fpath, "w") as f:
            f.write(content_new)
        patched.append(fpath)

print(f"Patched {len(patched)} files:")
for p in sorted(patched):
    print(" ", p)

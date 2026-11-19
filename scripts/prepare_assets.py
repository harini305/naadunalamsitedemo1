"""
Build the site's data files and optimised images from the Phase 1 audit.

Reads only from docs/source-audit/ (never modifies it) and writes:
  src/data/products.json, categories.json, posts.json, policies.json
  public/images/products/*.webp   (product photos / label artwork)
  public/images/categories/*.webp
  public/images/editorial/*.webp
  public/images/brand/*            (emblem, favicon)

Run:  python -I scripts/prepare_assets.py
"""
import csv
import json
import os
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
AUDIT = ROOT / "docs" / "source-audit"
DATA = AUDIT / "data"
PUB = ROOT / "public" / "images"
OUT = ROOT / "src" / "data"

for d in ["products", "categories", "editorial", "brand"]:
    (PUB / d).mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- manifest
url_to_local = {}
with open(AUDIT / "04-assets-manifest.csv", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        if r["original_url"] and r["local_path"]:
            url_to_local[r["original_url"]] = AUDIT / r["local_path"]


def local_for(url):
    p = url_to_local.get(url)
    if p and p.exists():
        return p
    # fall back to matching on the uploads path
    m = re.search(r"/uploads/(.+)$", url)
    if m:
        for base in ["media-library", "uploads-not-in-media-api"]:
            cand = AUDIT / "original-assets" / base / m.group(1)
            if cand.exists():
                return cand
    return None


def to_webp(src, dest, max_w, quality=80):
    if dest.exists() and dest.stat().st_mtime > src.stat().st_mtime:
        im = Image.open(dest)
        return im.size
    im = Image.open(src)
    im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    im.save(dest, "WEBP", quality=quality, method=6)
    return im.size


def render_pdf_preview(url):
    import pypdfium2 as pdfium
    pdf_url = url[: -len("-pdf.jpg")] + ".pdf"
    pdf_path = local_for(pdf_url)
    if not pdf_path:
        return None
    cache = ROOT / ".cache" / "label-previews"
    cache.mkdir(parents=True, exist_ok=True)
    out = cache / Path(url).name.replace(".jpg", ".png")
    if not out.exists():
        page = pdfium.PdfDocument(str(pdf_path))[0]
        page.render(scale=1024 / max(page.get_size())).to_pil().save(out)
    return out


def slugify_file(path):
    stem = Path(path).stem
    return re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")


# ---------------------------------------------------------------- categories
EMPTY_LEGACY = {"spices", "fresh-fruits", "fresh-vegetables", "grocery-frozen", "uncategorized"}
cats_raw = json.load(open(DATA / "product-categories.json", encoding="utf-8"))
products_raw = json.load(open(DATA / "products.json", encoding="utf-8"))

# split "English (Tamil)" display names
def split_name(name):
    m = re.match(r"^(.*?)\s*\(([^()]*)\)\s*$", name)
    return (m.group(1).strip(), m.group(2).strip()) if m else (name.strip(), "")

categories = []
for c in cats_raw:
    if c["slug"] in EMPTY_LEGACY or not c["count"]:
        continue
    en, ta = split_name(c["name"])
    img = None
    src = local_for(c["image"]) if c.get("image") else None
    if src:
        name = "cat-" + c["slug"] + ".webp"
        w, h = to_webp(src, PUB / "categories" / name, 900, 78)
        img = {"src": f"/images/categories/{name}", "w": w, "h": h}
    categories.append({
        "slug": c["slug"], "name": en, "nameTa": ta, "count": c["count"],
        "description": c.get("description") or "", "image": img,
    })

# ---------------------------------------------------------------- products
products = []
missing = []
for p in products_raw:
    imgs = []
    for i, im in enumerate(p["images"]):
        src = local_for(im["src"])
        if not src and im["src"].endswith("-pdf.jpg"):
            # WordPress preview JPG not downloaded in Phase 1; render page 1 of the
            # original label PDF the same way WordPress generated the preview.
            src = render_pdf_preview(im["src"])
        if not src:
            missing.append((p["slug"], im["src"]))
            continue
        name = slugify_file(src.name) + ".webp"
        dest = PUB / "products" / name
        w, h = to_webp(src, dest, 1024, 80)
        imgs.append({
            "src": f"/images/products/{name}", "w": w, "h": h,
            "alt": im.get("alt") or f"{p['name_en']} ({p['name_ta']})",
            "label": src.name.endswith("-pdf.jpg"),
        })
    variants = []
    if p["slug"] == "organic-turmeric-powder":
        # Store API: price range ₹40–₹70 across packs 100 g / 250 g; 100 g = ₹40 is shown on the live page.
        variants = [{"pack": "100 g", "price": 40}, {"pack": "250 g", "price": 70}]
    products.append({
        "slug": p["slug"], "sku": p["sku"],
        "name": p["name_en"], "nameTa": p["name_ta"],
        "price": round(p["price_inr"]), "pack": p["pack"], "variants": variants,
        "categories": [c["slug"] for c in p["categories"]],
        "vendor": p["vendor"],
        "short": (p.get("short_description") or "").strip(),
        "descTa": (p.get("description_ta") or "").strip(),
        "images": imgs,
    })

# ---------------------------------------------------------------- blog (curated)
KEEP_POSTS = ["cold-pressed-vs-refined-oils", "many-sellers-one-basket", "choosing-your-honey"]
posts_raw = json.load(open(DATA / "blog-posts.json", encoding="utf-8"))
posts = []
for p in posts_raw:
    if p["slug"] not in KEEP_POSTS:
        continue
    img = None
    src = local_for(p["featured_image"]) if p.get("featured_image") else None
    if src:
        name = "post-" + p["slug"] + ".webp"
        w, h = to_webp(src, PUB / "editorial" / name, 1400, 80)
        img = {"src": f"/images/editorial/{name}", "w": w, "h": h}
    paras = [x.strip() for x in re.split(r"\n\s*\n", p["content"]) if x.strip()]
    posts.append({
        "slug": p["slug"], "title": p["title"], "date": p["date"][:10],
        "excerpt": re.sub(r"<[^>]+>", "", p["excerpt"]).strip(),
        "categories": p.get("categories", []), "image": img, "body": paras,
    })
posts.sort(key=lambda x: KEEP_POSTS.index(x["slug"]))

# ---------------------------------------------------------------- policies
POLICIES = {
    "shipping-policy": "page_shipping-policy.txt",
    "refund-policy": "page_refund-policy.txt",
    "terms": "page_terms.txt",
    "privacy-policy": "page_privacy-policy.txt",
}
policies = {}
for slug, fn in POLICIES.items():
    txt = (DATA / "page-text" / fn).read_text(encoding="utf-8")
    body = txt.split("\n---\n", 1)[1].strip().splitlines()
    body = [l.strip() for l in body if l.strip()]
    # drop the kicker line, keep H1, intro, last-updated; drop "ON THIS PAGE" jump list
    assert body[0] == "NAADU NALAM", body[0]
    title = body[1]
    intro = body[2]
    updated = body[3]
    i = body.index("ON THIS PAGE") + 1
    while i < len(body) and not re.match(r"^\d+\.\s", body[i]):
        i += 1
    sections = []
    for line in body[i:]:
        m = re.match(r"^(\d+)\.\s+(.*)$", line)
        if m:
            sections.append({"heading": m.group(2), "lines": []})
        elif sections:
            sections[-1]["lines"].append(line)
    policies[slug] = {"slug": slug, "title": title, "intro": intro, "updated": updated, "sections": sections}

# ---------------------------------------------------------------- editorial / brand images
EDITORIAL = {
    "store-still-life.webp": ("media-library/2026/08/naadu-nalam-store-banner.webp", 1536),
    "seeraga-samba.webp": ("media-library/2026/08/Seeraga-Samba-Arisi.webp", 1024),
}
for name, (rel, w) in EDITORIAL.items():
    to_webp(AUDIT / "original-assets" / rel, PUB / "editorial" / name, w, 82)

# Crop of the About-page still life: only the field, cold-pressed oils and grain bowls
# (its right side shows fruit and vegetables, which are not sold).
src = AUDIT / "original-assets" / "media-library/2026/08/naadu-nalam-store-banner.webp"
crop = Image.open(src).convert("RGB").crop((0, 0, 840, 1024))
crop.save(PUB / "editorial" / "oils-grains-field.webp", "WEBP", quality=84, method=6)

emblem = AUDIT / "original-assets/uploads-not-in-media-api/2026/09/naadu-nalam-logo-header__extracted-embedded-raster.webp"
im = Image.open(emblem).convert("RGBA")
im.save(PUB / "brand" / "emblem.webp", "WEBP", quality=92, method=6)
im.save(PUB / "brand" / "emblem.png")
ico = im.copy(); ico.thumbnail((192, 192), Image.LANCZOS)
(ROOT / "src" / "app").mkdir(parents=True, exist_ok=True)
ico.save(ROOT / "src" / "app" / "icon.png")

# ---------------------------------------------------------------- write
def dump(name, obj):
    with open(OUT / name, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)

dump("products.json", products)
dump("categories.json", categories)
dump("posts.json", posts)
dump("policies.json", policies)

print("products", len(products), "categories", len(categories), "posts", len(posts), "policies", len(policies))
print("missing images", missing)

"""
Crop the client-supplied composite (docs/client-supplied/tamil-family-and-five-elements.png,
1536x1024) into web images for the homepage. The original is never modified.

Crops stay at native resolution (no upscaling). The element photos are cropped
above the baked-in icons and labels, so the site sets its own Tamil/English text.

Run: python -I scripts/prepare_client_images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "client-supplied" / "tamil-family-and-five-elements.png"
OUT = ROOT / "public" / "images" / "home"
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB")
CROPS = {
    # family photographs (top row)
    "family-fields": (779, 0, 1536, 528),      # family of nine beside the paddy fields
    "family-home": (0, 0, 770, 528),           # family in a village-house courtyard with grain baskets
    "family-home-elders": (96, 214, 410, 528), # grandfather and grandmother with the grain baskets
    # five elements, cropped above the icons/labels
    "element-air": (40, 565, 266, 791),
    "element-fire": (370, 565, 596, 791),
    "element-water": (660, 565, 886, 791),
    "element-earth": (992, 565, 1218, 791),
    "element-space": (1262, 565, 1488, 791),
}
for name, box in CROPS.items():
    c = im.crop(box)
    c.save(OUT / f"{name}.webp", "WEBP", quality=90, method=6)
    print(name, c.size)

# Full-screen hero version: 2x Lanczos enlargement + gentle unsharp mask.
# (Checked at 1:1 on a 1440px screen; a higher-resolution original would still be better.)
from PIL import ImageFilter
hd = im.crop(CROPS["family-fields"])
hd = hd.resize((hd.width * 2, hd.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
hd.save(OUT / "family-fields-hd.webp", "WEBP", quality=86, method=6)
print("family-fields-hd", hd.size)

# ---- hero photo v2 (client-supplied 2026-11-19, 1600x1408) — used as supplied, no edits
V2 = ROOT / "docs" / "client-supplied" / "hero-family-fields-v2.jpg"
if V2.exists():
    base = Image.open(V2).convert("RGB")
    base.save(OUT / "hero-family.webp", "WEBP", quality=86, method=6)
    print("hero-family", base.size)

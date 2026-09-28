"""Turn mascot renders with a baked-in (fake) transparency checkerboard into
real transparent WebP cutouts.

  python scripts/cutout-mascot.py

Reads public/mascot/{main pose,mengintip,ekspresif}.png (left untouched) and
writes public/mascot/{hero,peek,wave}.webp.

How: dark, colourless pixels (the checkerboard sits at brightness 0–50) that
connect to the image border are background. Enclosed dark patches (e.g. the
gap between an arm and the body) are only removed when they actually look
like the checkerboard — a mix of near-black and ~40-grey squares — so the
character's own grey trousers and shadows survive. Small stray foreground
blobs (the baked-in caption) are dropped and the edge is feathered.
"""
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path("public/mascot")
JOBS = {"main pose.png": "hero.webp", "mengintip.png": "peek.webp", "ekspresif.png": "wave.webp"}
# The peek render's cloud is cut flat with a dark seam along the bottom.
BOTTOM_TRIM = {"mengintip.png": 5}

MAX_BG_BRIGHTNESS = 52   # checker squares are ~0–50
MAX_BG_CHROMA = 14       # ...and neutral grey
MIN_BG_REGION = 400      # enclosed patches smaller than this always stay


def components(mask, w, h):
    """Yield lists of pixel indices for each 4-connected True region."""
    seen = bytearray(w * h)
    for start in range(w * h):
        if not mask[start] or seen[start]:
            continue
        seen[start] = 1
        q, comp = deque([start]), []
        while q:
            i = q.popleft()
            comp.append(i)
            x, y = i % w, i // w
            for j in (i - 1 if x else -1, i + 1 if x < w - 1 else -1, i - w if y else -1, i + w if y < h - 1 else -1):
                if j >= 0 and mask[j] and not seen[j]:
                    seen[j] = 1
                    q.append(j)
        yield comp


def cutout(src: Path, dst: Path):
    im = Image.open(src).convert("RGB")
    # The renders have a 1–2px light frame on the outer edge; trim it.
    im = im.crop((3, 3, im.width - 3, im.height - 3))
    w, h = im.size
    px = list(im.getdata())

    cand = [max(p) <= MAX_BG_BRIGHTNESS and max(p) - min(p) <= MAX_BG_CHROMA for p in px]
    bg = bytearray(w * h)
    for comp in components(cand, w, h):
        touches_border = any(i % w in (0, w - 1) or i // w in (0, h - 1) for i in comp)
        looks_checker = False
        if not touches_border and len(comp) >= MIN_BG_REGION:
            lum = [max(px[i]) for i in comp]
            black = sum(1 for v in lum if v <= 8) / len(lum)
            grey = sum(1 for v in lum if 35 <= v <= 50) / len(lum)
            looks_checker = black >= 0.2 and grey >= 0.2
        if touches_border or looks_checker:
            for i in comp:
                bg[i] = 1

    # Keep only substantial foreground blobs (drops the caption letters).
    fg = [not b for b in bg]
    comps = sorted(components(fg, w, h), key=len, reverse=True)
    keep = bytearray(w * h)
    for comp in comps:
        if len(comp) >= 0.02 * len(comps[0]):
            for i in comp:
                keep[i] = 1

    alpha = Image.new("L", (w, h))
    a = [255 if keep[i] else 0 for i in range(w * h)]
    # Edge pixels still carry dark checker colour: fade the darkest ones.
    for i in range(w * h):
        if not keep[i]:
            continue
        x, y = i % w, i // w
        edge = any(
            0 <= j < w * h and not keep[j]
            for j in (i - 1 if x else -1, i + 1 if x < w - 1 else -1, i - w, i + w)
        )
        if edge:
            a[i] = 0 if max(px[i]) < 110 else 140
    alpha.putdata(a)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    out = im.convert("RGBA")
    out.putalpha(alpha)
    bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 4
    out = out.crop((max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, w), min(bbox[3] + pad, h)))
    trim = BOTTOM_TRIM.get(src.name, 0)
    if trim:
        out = out.crop((0, 0, out.width, out.height - trim - pad))
    out.save(dst, "WEBP", quality=90, method=6)
    print(f"{src.name} -> {dst.name} {out.size} {dst.stat().st_size // 1024}KB")


if __name__ == "__main__":
    for s, d in JOBS.items():
        cutout(SRC / s, SRC / d)

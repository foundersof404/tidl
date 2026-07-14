#!/usr/bin/env python3
"""
Regenerate a clean, consistent, correctly-labeled set of peptide vial images.

Every featured TIDL peptide gets the same studio vial (gray cap + glass body)
with a freshly composited label: generic molecule mark, a teal name/strength
block, volume, and the clinical-use line. This fixes the previous set, which
mixed real catalog photos of different styles and — worse — showed WRONG labels
(tb-500 photo actually said "BPC157", retatrutide said "GLP3-R") because the
old matcher fell back to another product's image when the real one had none.

Base vial: public/peptides/bpc-157.png (526x1062, clean gray-cap studio shot).
Output: overwrites public/peptides/<slug>.png for every slug below.

Requires: pillow
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PEPT = ROOT / "public" / "peptides"
BASE = PEPT / "bpc-157.png"
FONTS = Path("C:/Windows/Fonts")

TEAL = (44, 126, 158, 255)
INK = (26, 23, 20, 255)
MUTED = (110, 116, 120, 255)
LABEL_BG = (236, 238, 240, 255)
LABEL_BORDER = (214, 218, 221, 255)
MOL = (47, 127, 176, 255)

# slug -> (display name, strength, volume). Names with " / " wrap to two lines.
PRODUCTS: dict[str, tuple[str, str, str]] = {
    "glp-1-weight-loss": ("TIRZEPATIDE", "17MG", "2ML"),
    "retatrutide": ("RETATRUTIDE", "100MG", "10ML"),
    "bpc-157": ("BPC-157", "10MG", "10ML"),
    "tb-500": ("TB-500", "10MG", "10ML"),
    "wolverine": ("BPC-157 / TB-500", "10/10MG", "10ML"),
    "cjc-1295-ipamorelin": ("CJC-1295 / IPAMORELIN", "10/10MG", "10ML"),
    "tesamorelin": ("TESAMORELIN / IPAMORELIN", "12/3MG", "10ML"),
    "mots-c": ("MOTS-C", "10MG", "10ML"),
    "nad-plus": ("NAD+", "1000MG", "10ML"),
    "ghk-cu": ("GHK-CU", "50MG", "10ML"),
    "sermorelin": ("SERMORELIN", "10MG", "5ML"),
}


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def text_w(draw: ImageDraw.ImageDraw, s: str, f: ImageFont.FreeTypeFont) -> int:
    b = draw.textbbox((0, 0), s, font=f)
    return b[2] - b[0]


def fit_font(draw, s: str, max_w: int, start: int, min_size: int, fname="arialbd.ttf"):
    size = start
    while size > min_size:
        f = font(fname, size)
        if text_w(draw, s, f) <= max_w:
            return f
        size -= 2
    return font(fname, min_size)


def draw_molecule(d: ImageDraw.ImageDraw, cx: float, cy: float, s: float) -> None:
    """Generic 6-node molecule mark (same for every product)."""
    nodes = [
        (0.00, 0.10, 0.16),   # center
        (-0.45, -0.35, 0.11),
        (0.18, -0.55, 0.11),
        (0.62, -0.02, 0.14),
        (-0.62, 0.42, 0.12),
        (-0.10, 0.62, 0.14),
    ]
    pts = [(cx + nx * s, cy + ny * s) for nx, ny, _ in nodes]
    links = [(0, 1), (0, 2), (0, 3), (0, 5), (1, 4), (5, 4)]
    for a, b in links:
        d.line([pts[a], pts[b]], fill=MOL, width=max(3, int(s * 0.05)))
    for (px, py), (_, _, r) in zip(pts, nodes):
        rr = r * s
        d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=MOL)


def rounded(d, box, radius, **kw):
    d.rounded_rectangle(box, radius=radius, **kw)


def build(orig: Image.Image, slug: str, name: str, strength: str, volume: str) -> None:
    base = orig.copy()
    W, H = base.size
    d = ImageDraw.Draw(base)

    # 1) Blank the existing label area (covers old text/molecule/teal block).
    lx0, ly0, lx1, ly1 = int(W * 0.028), int(H * 0.285), int(W * 0.972), int(H * 0.905)
    rounded(d, (lx0, ly0, lx1, ly1), radius=int(W * 0.05), fill=LABEL_BG,
            outline=LABEL_BORDER, width=2)

    cx = W / 2

    # 2) Molecule mark (upper third of label).
    draw_molecule(d, cx, H * 0.40, W * 0.20)

    # 3) Teal name/strength block.
    bx0, by0, bx1, by1 = int(W * 0.09), int(H * 0.545), int(W * 0.91), int(H * 0.74)
    rounded(d, (bx0, by0, bx1, by1), radius=int(W * 0.03), fill=TEAL)
    inner_w = int((bx1 - bx0) * 0.86)

    lines = [p.strip() for p in name.split("/")] if " / " in name else [name]
    if len(lines) > 1:
        nf = fit_font(d, max(lines, key=len), inner_w, int(W * 0.085), int(W * 0.05))
        # vertical stack for name, then strength
        y = by0 + (by1 - by0) * 0.14
        for ln in lines:
            w = text_w(d, ln, nf)
            d.text((cx - w / 2, y), ln, font=nf, fill=(255, 255, 255, 255))
            y += nf.size * 1.02
        sf = fit_font(d, strength, inner_w, int(W * 0.085), int(W * 0.05))
        sw = text_w(d, strength, sf)
        d.text((cx - sw / 2, by1 - sf.size * 1.35), strength, font=sf,
               fill=(255, 255, 255, 255))
    else:
        nf = fit_font(d, name, inner_w, int(W * 0.135), int(W * 0.06))
        nw = text_w(d, name, nf)
        d.text((cx - nw / 2, by0 + (by1 - by0) * 0.14), name, font=nf,
               fill=(255, 255, 255, 255))
        sf = fit_font(d, strength, inner_w, int(W * 0.10), int(W * 0.055))
        sw = text_w(d, strength, sf)
        d.text((cx - sw / 2, by1 - sf.size * 1.45), strength, font=sf,
               fill=(255, 255, 255, 255))

    # 4) Volume (bold ink) + clinical-use line (muted).
    vf = font("arialbd.ttf", int(W * 0.085))
    vw = text_w(d, volume, vf)
    d.text((cx - vw / 2, H * 0.77), volume, font=vf, fill=INK)

    cf = font("arial.ttf", int(W * 0.042))
    for i, ln in enumerate(("CLINICAL USE OR", "PROVIDER USE ONLY")):
        w = text_w(d, ln, cf)
        d.text((cx - w / 2, H * 0.835 + i * cf.size * 1.25), ln, font=cf, fill=MUTED)

    out = PEPT / f"{slug}.png"
    base.save(out, "PNG", optimize=True)
    print(f"wrote {out.name}  ({name} · {strength} · {volume})", flush=True)


def main() -> None:
    if not BASE.exists():
        raise SystemExit(f"missing base vial: {BASE}")
    orig = Image.open(BASE).convert("RGBA")  # capture clean base before overwriting
    for slug, (name, strength, volume) in PRODUCTS.items():
        build(orig, slug, name, strength, volume)
    print("done")


if __name__ == "__main__":
    main()

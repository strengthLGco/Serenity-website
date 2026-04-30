#!/usr/bin/env python3
"""
Serenity Research Labs — Asset Optimization Pipeline

Creates optimized WebP derivatives for product and stack PNGs while keeping the
original PNGs as editable source assets. Requires either `cwebp` (preferred) or
ImageMagick `magick` on PATH.

Usage:
  python3 scripts/optimize_assets.py

Outputs:
  images/products/*.webp
  images/stacks/*.webp
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIRS = [ROOT / "images" / "products", ROOT / "images" / "stacks"]
QUALITY = "82"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def optimize_png(path: Path) -> Path:
    out = path.with_suffix(".webp")
    if shutil.which("cwebp"):
        run(["cwebp", "-quiet", "-q", QUALITY, str(path), "-o", str(out)])
    elif shutil.which("magick"):
        run(["magick", str(path), "-quality", QUALITY, str(out)])
    else:
        raise SystemExit("Missing optimizer: install cwebp or ImageMagick `magick`.")
    return out


def main() -> None:
    pngs: list[Path] = []
    for image_dir in IMAGE_DIRS:
        pngs.extend(sorted(image_dir.glob("*.png")))

    if not pngs:
        print("No PNG assets found.")
        return

    print(f"Optimizing {len(pngs)} PNG assets at quality {QUALITY}...")
    total_before = 0
    total_after = 0
    for png in pngs:
        before = png.stat().st_size
        webp = optimize_png(png)
        after = webp.stat().st_size
        total_before += before
        total_after += after
        saved = 100 - (after / before * 100) if before else 0
        print(f"  ✓ {png.relative_to(ROOT)} → {webp.name} ({saved:.1f}% smaller)")

    print("\nDone.")
    print(f"Original PNG total: {total_before / 1024:.1f} KB")
    print(f"Optimized WebP total: {total_after / 1024:.1f} KB")
    if total_before:
        print(f"Savings: {100 - (total_after / total_before * 100):.1f}%")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Serenity Research Labs — Print-Ready Vial Label Generator

Generates SVG labels for 10mL vial wraps with:
- 3mm bleed on all sides
- Trim marks at corners
- SERENITY branding
- Product name, weight, purity
- "For Research Use Only" disclaimer
- Lot number placeholder
- Storage instructions

Label dimensions (trim): 70mm × 25mm (standard 10mL vial wrap)
With bleed: 76mm × 31mm
"""

import os

PRODUCTS = [
    {"name": "BPC-157", "weight": "5mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "TB-500", "weight": "5mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "CJC-1295 / Ipamorelin", "weight": "5mg", "form": "Lyophilized Blend", "purity": "99%+"},
    {"name": "GHK-Cu", "weight": "50mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "Melanotan II", "weight": "10mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "IGF-1 LR3", "weight": "1mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "Retatrutide", "weight": "5mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {"name": "TB-500", "weight": "5mg", "form": "Lyophilized Powder", "purity": "99%+"},
    {
        "name": "G-LOW",
        "weight": "70mg",
        "form": "Lyophilized Compound Set",
        "purity": "99%+",
        "subtitle": "TB-500 10mg · BPC-157 10mg · GHK-Cu 50mg",
    },
    {"name": "Bacteriostatic Water", "weight": "30mL", "form": "Sterile Diluent", "purity": "USP Grade"},
]

# Remove duplicate TB-500
seen = set()
unique_products = []
for p in PRODUCTS:
    key = p["name"]
    if key not in seen:
        seen.add(key)
        unique_products.append(p)
PRODUCTS = unique_products

# Dimensions in mm
TRIM_W = 70
TRIM_H = 25
BLEED = 3
TOTAL_W = TRIM_W + 2 * BLEED  # 76mm
TOTAL_H = TRIM_H + 2 * BLEED  # 31mm
MARK_LEN = 2  # trim mark length

# Convert mm to SVG units (1mm = 1 unit, viewBox handles scaling)
def mm(v):
    return v


def generate_label_svg(product):
    name = product["name"]
    weight = product["weight"]
    form_text = product["form"]
    purity = product["purity"]
    subtitle = product.get("subtitle", "")

    # Adjust font size for long names
    name_size = 5.5 if len(name) <= 10 else 4.5 if len(name) <= 18 else 3.8

    # Brand color
    brand_blue = "#0a84ff"

    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="{TOTAL_W}mm" height="{TOTAL_H}mm"
     viewBox="0 0 {TOTAL_W} {TOTAL_H}">

  <!-- Print metadata -->
  <title>Serenity Research Labs — {name} Label</title>
  <desc>Print-ready vial label. Trim size: {TRIM_W}×{TRIM_H}mm. Bleed: {BLEED}mm all sides.</desc>

  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap');
      text {{ font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; }}
    </style>
  </defs>

  <!-- ===== BLEED AREA (full background) ===== -->
  <rect x="0" y="0" width="{TOTAL_W}" height="{TOTAL_H}" fill="white"/>

  <!-- ===== TRIM MARKS ===== -->
  <g stroke="#000" stroke-width="0.15" fill="none" opacity="0.6">
    <!-- Top-left -->
    <line x1="0" y1="{BLEED}" x2="{MARK_LEN}" y2="{BLEED}"/>
    <line x1="{BLEED}" y1="0" x2="{BLEED}" y2="{MARK_LEN}"/>
    <!-- Top-right -->
    <line x1="{TOTAL_W - MARK_LEN}" y1="{BLEED}" x2="{TOTAL_W}" y2="{BLEED}"/>
    <line x1="{TOTAL_W - BLEED}" y1="0" x2="{TOTAL_W - BLEED}" y2="{MARK_LEN}"/>
    <!-- Bottom-left -->
    <line x1="0" y1="{TOTAL_H - BLEED}" x2="{MARK_LEN}" y2="{TOTAL_H - BLEED}"/>
    <line x1="{BLEED}" y1="{TOTAL_H - MARK_LEN}" x2="{BLEED}" y2="{TOTAL_H}"/>
    <!-- Bottom-right -->
    <line x1="{TOTAL_W - MARK_LEN}" y1="{TOTAL_H - BLEED}" x2="{TOTAL_W}" y2="{TOTAL_H - BLEED}"/>
    <line x1="{TOTAL_W - BLEED}" y1="{TOTAL_H - MARK_LEN}" x2="{TOTAL_W - BLEED}" y2="{TOTAL_H}"/>
  </g>

  <!-- ===== SAFE AREA (content within trim) ===== -->
  <g transform="translate({BLEED}, {BLEED})">

    <!-- Trim boundary (hidden in print, visible in preview) -->
    <rect x="0" y="0" width="{TRIM_W}" height="{TRIM_H}"
          fill="none" stroke="#ccc" stroke-width="0.1" stroke-dasharray="1,1"/>

    <!-- ── Top section: Brand ── -->
    <!-- Diamond icon -->
    <polygon points="5,3.5 6.2,2 7.4,3.5 6.2,5" fill="{brand_blue}" opacity="0.9"/>
    <text x="9" y="4.8" font-size="3" font-weight="800" letter-spacing="0.25" fill="#1d1d1f">SERENITY</text>
    <text x="9" y="7" font-size="1.4" font-weight="600" letter-spacing="0.18" fill="{brand_blue}" text-transform="uppercase">RESEARCH LABS</text>

    <!-- Thin separator -->
    <line x1="4" y1="8.5" x2="{TRIM_W - 4}" y2="8.5" stroke="#e0e0e0" stroke-width="0.15"/>

    <!-- ── Middle section: Product name ── -->
    <text x="{TRIM_W / 2}" y="14" font-size="{name_size}" font-weight="700"
          text-anchor="middle" letter-spacing="0.05" fill="#1d1d1f">{name}</text>
"""

    if subtitle:
        svg += f"""    <text x="{TRIM_W / 2}" y="16.5" font-size="1.6" font-weight="400"
          text-anchor="middle" fill="#6e6e73">{subtitle}</text>
"""

    spec_y = 17.5 if not subtitle else 19

    svg += f"""
    <!-- ── Specs line ── -->
    <text x="{TRIM_W / 2}" y="{spec_y}" font-size="1.8" font-weight="500"
          text-anchor="middle" fill="#6e6e73">{weight}  ·  {purity} Purity  ·  {form_text}</text>

    <!-- Thin separator -->
    <line x1="4" y1="{spec_y + 1.5}" x2="{TRIM_W - 4}" y2="{spec_y + 1.5}" stroke="#e0e0e0" stroke-width="0.15"/>

    <!-- ── Bottom section: Compliance ── -->
    <text x="4" y="{spec_y + 3.8}" font-size="1.3" font-weight="600"
          letter-spacing="0.1" fill="#ba1a1a">FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION</text>

    <text x="4" y="{spec_y + 5.5}" font-size="1.1" font-weight="400" fill="#86868b">Lot: ____________  |  Store at 2–8°C  |  serenityresearchlabs.com</text>

  </g>
</svg>"""

    return svg


def main():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Generating {len(PRODUCTS)} print-ready labels...\n")

    for product in PRODUCTS:
        filename = product["name"].lower().replace(" ", "_").replace("/", "_").replace("-", "_")
        svg_path = os.path.join(output_dir, f"label_{filename}.svg")
        svg_content = generate_label_svg(product)

        with open(svg_path, "w") as f:
            f.write(svg_content)

        print(f"  ✓ {product['name']:25s} → label_{filename}.svg")

    # Generate an index HTML for easy preview
    html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Serenity Research Labs — Label Preview</title>
<style>
  body { font-family: 'Inter', system-ui, sans-serif; background: #f5f5f7; padding: 40px; }
  h1 { font-size: 24px; font-weight: 700; color: #1d1d1f; margin-bottom: 8px; }
  p.sub { font-size: 13px; color: #6e6e73; margin-bottom: 40px; }
  .label-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
  .label-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .label-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #1d1d1f; }
  .label-card img { width: 100%; border: 1px solid #e0e0e0; border-radius: 4px; }
  .specs { font-size: 11px; color: #86868b; margin-top: 8px; }
</style>
</head>
<body>
<h1>Print-Ready Label Preview</h1>
<p class="sub">Trim size: 70×25mm · Bleed: 3mm · Format: SVG (vector, infinite resolution)</p>
<div class="label-grid">
"""
    for product in PRODUCTS:
        filename = product["name"].lower().replace(" ", "_").replace("/", "_").replace("-", "_")
        html += f"""  <div class="label-card">
    <h3>{product["name"]}</h3>
    <img src="label_{filename}.svg" alt="{product["name"]} label"/>
    <p class="specs">{product["weight"]} · {product["form"]} · {product["purity"]} Purity</p>
  </div>
"""

    html += """</div>
<p style="margin-top:40px; font-size:11px; color:#86868b;">
  These SVG files are vector-based and resolution-independent. Open in Adobe Illustrator, Inkscape, or
  any vector editor. For PDF export: File → Save As → PDF in Illustrator, or use Inkscape's PDF export.
  Trim marks and bleed are included per industry print standards.
</p>
</body>
</html>"""

    html_path = os.path.join(output_dir, "preview.html")
    with open(html_path, "w") as f:
        f.write(html)

    print(f"\n  ✓ Preview page → preview.html")
    print(f"\nDone. Open preview.html in a browser to review all labels.")
    print(f"SVG files are AI-compatible — open directly in Adobe Illustrator.")


if __name__ == "__main__":
    main()

# Serenity Label Workflow

This folder contains print-ready SVG vial label placeholders plus a preview page.

## Generate labels

```bash
python3 labels/generate_labels.py
```

Outputs one SVG per SKU and refreshes `preview.html`.

## Current label spec
- Trim: 70mm × 25mm
- Bleed: 3mm on all sides
- Format: SVG vector, Illustrator/Inkscape-compatible
- Required compliance text included: `FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION`
- Lot placeholder: `Lot: ____________`
- Storage placeholder: `Store at 2–8°C`

## Before printing
Confirm these with supplier/manufacturer:
- Exact vial size and label wrap dimensions
- Required lot/batch/date format
- Net quantity and concentration language
- Storage requirements per SKU
- Whether QR code should point to SKU COA, batch COA, or general lab reports page

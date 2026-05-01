# Serenity Label + Packaging System

Status: V1 design system started from existing print-ready vial labels.

## Existing assets
- Vial label generator: `labels/generate_labels.py`
- Label preview: `labels/preview.html`
- Output format: SVG vector labels
- Trim size: 70mm × 25mm
- Bleed: 3mm all sides
- Current style: Apple/Stripe-inspired white, Serenity blue `#0a84ff`, Inter-style typography

## Compliance baseline
Use research-only language everywhere:
- `FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION`
- Include lot/batch placeholder
- Include storage instruction: `Store at 2–8°C` unless supplier-specific storage differs
- Include website: `serenityresearchlabs.com`
- Avoid dose, treatment, cure, prevention, therapy, patient, or human-use claims

## Current vial label content
- Brand: SERENITY RESEARCH LABS
- Product name
- Amount / purity / form
- Research-use disclaimer
- Lot placeholder
- Storage instruction
- Website

## Packaging direction
Visual lane: premium clinical/lab luxury, not supplement/gym-bro.

### Front panel
- Serenity Research Labs logo/wordmark
- Product name
- Net quantity / size
- `For Research Use Only` badge
- Minimal blue accent line or diamond mark

### Side panel
- Storage instructions
- Lot / batch / MFG / EXP placeholders
- QR placeholder for COA once batch is known

### Back panel
- Research-use disclaimer
- Handling statement
- Company/domain/support contact
- No human-consumption language

## First SKUs to package
Use current active/core products first:
- BPC-157 5mg
- TB-500 5mg
- CJC-1295 / Ipamorelin 5mg
- Retatrutide 5mg
- NAD+ — needs label added if live/current

Then expansion candidates after processor/supplier confidence:
- GHK-Cu 50mg
- Tirzepatide 10mg / 30mg
- PT-141 10mg

## Supplier-ready checklist
Before ordering labels/boxes:
- [ ] Confirm exact vial size and label printable area
- [ ] Confirm box dieline dimensions from supplier/printer
- [ ] Confirm product list and amounts
- [ ] Confirm storage requirements per COA/supplier
- [ ] Add COA QR codes after batch data exists
- [ ] Export print PDFs from SVG/source files
- [ ] Proof one physical label before bulk order

## Open design tasks
- [ ] Add NAD+, Tirzepatide, PT-141 labels to generator once final SKU sizes are confirmed.
- [ ] Create box dieline once printer/supplier gives dimensions.
- [ ] Create 2–3 packaging concepts before image-gen credit spend.

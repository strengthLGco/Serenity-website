# Serenity Research Labs — Label + Packaging Concept Pack

Date: 2026-05-01
Status: Prepared locally; no image-generation credits spent and no supplier/printer order placed.

## Objective
Prepare the next packaging/design step so that once processor status is confirmed, Serenity can move directly into image generation, dieline work, and supplier-ready packaging proofing.

## Non-negotiable compliance language
Use this exact direction across label, box, inserts, renders, and mockups:

- FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION
- Store at 2–8°C unless supplier/COA specifies otherwise.
- Include lot/batch placeholder.
- Include MFG/EXP placeholders only when supplier/printer confirms required format.
- Include QR placeholder for COA once batch data exists.
- Avoid dose, treatment, cure, prevention, therapy, patient, fitness benefit, before/after, or human-use claims.

## Existing assets confirmed
- Vial label generator: `labels/generate_labels.py`
- Current SVG labels generated successfully: 9
- Existing label size: 70mm × 25mm trim, 3mm bleed
- Preview file: `labels/preview.html`

## Packaging concept lanes

### Concept 1 — Clinical Minimal
Best for: immediate first batch / safest printer handoff.

- Background: matte white or pearl white
- Accent: Serenity blue `#0a84ff` hairline border or vertical stripe
- Typography: Inter / Helvetica Neue style, high spacing, clean hierarchy
- Front: logo/wordmark, product name, amount, research-use badge
- Side: storage, lot/batch, QR placeholder
- Back: disclaimer, handling statement, domain/contact
- Visual feel: Apple/Stripe lab aesthetic, very clean, very low regulatory risk

### Concept 2 — Premium Lab Blue
Best for: website hero renders and higher perceived value.

- Background: deep navy/charcoal with subtle blue gradient
- Accent: bright Serenity blue edge line / diamond mark
- Typography: white + light gray, lots of negative space
- Front: product name large, brand small, research-use badge obvious
- Side/back: white-on-dark compliance block with QR placeholder
- Visual feel: high-end research lab, luxury clinical, not supplement/gym-bro

### Concept 3 — Frosted Glass / Cold Chain
Best for: content/renders once physical packaging is settled.

- Background: frosted translucent white/silver effect
- Accent: cold blue highlights, subtle condensation/glass reflections
- Typography: minimal black/gray with blue badge
- Front: clean product name, amount, research-only marker
- Back/side: concise compliance and storage panel
- Visual feel: cold-chain lab, sterile premium, strong visual for site/social

## Image-generation prompt templates

### Bottle/vial + box hero render
Premium clinical product render for Serenity Research Labs, white 10mL research vial with minimalist wrap label, matching rectangular carton box, Apple-inspired clean lab aesthetic, white and soft gray background, Serenity blue accent #0a84ff, subtle shadows, crisp typography, high-end pharmaceutical research presentation, product name placeholder, visible badge reading "For Research Use Only", no human imagery, no medical claims, no syringe, no injection, no treatment language, 9:16 vertical composition, ultra clean studio lighting.

### Flat packaging concept board
Minimal premium packaging concept board for Serenity Research Labs, vial label layout, carton front panel, side panel, back compliance panel, QR code placeholder, lot and batch placeholders, white matte packaging with Serenity blue accent #0a84ff, Inter-style typography, clinical research lab aesthetic, clean grid, no claims, no people, no needles, no supplement/gym style, professional brand presentation.

### Dark premium render
Luxury clinical research packaging render, deep charcoal and navy carton with bright Serenity blue accent line, white research vial, minimalist label, badge text "For Research Use Only", product-name placeholder, clean laboratory studio scene, subtle reflective surface, premium biotech aesthetic, no medical claims, no human use language, no syringe, no injection, no people.

## Negative prompt / avoid list
syringe, injection, doctor, patient, prescription, cure, treatment, therapy, before and after, body transformation, supplement facts panel, FDA approved, medical claims, hospital scene, hands injecting, pills, capsules, gym bro design, neon bodybuilding aesthetic, cheap supplement bottle, cluttered label, dosage instructions, human consumption.

## Supplier/printer questions to answer before ordering
1. Exact vial diameter and label printable area.
2. Box dieline dimensions, fold/glue zones, bleed, and safe margins.
3. Accepted file formats: PDF/X, AI, SVG, CMYK profile.
4. Label material: white BOPP, matte paper, freezer-grade, waterproof, cold-chain compatible?
5. Minimum order quantity and unit cost for labels + cartons.
6. Whether QR/lot/MFG/EXP must be variable data or static placeholders.
7. Proof process: digital proof, hard proof, or first article sample.

## Ready next actions once processor branch is known
- If processor accepted: generate 2–3 image mockups from these prompt lanes, choose one, then request supplier/printer dielines.
- If processor pending: refine copy and product list only; do not spend design/order money.
- If processor rejected/silent: keep this pack ready but prioritize reserve processor outreach.

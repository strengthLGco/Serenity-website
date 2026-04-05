# Design System Document

## 1. Overview & Creative North Star: "The Clinical Gallery"
This design system is built upon the mantra of **'Purity Above All.'** It rejects the cluttered "template" look of traditional e-commerce in favor of a high-end editorial experience that sits at the intersection of pharmaceutical precision and luxury consumer technology.

The Creative North Star is **"The Clinical Gallery."** Imagine a high-end art space where the scientific breakthrough is the masterpiece. We achieve this through:
*   **Intentional Asymmetry:** Breaking the expected 12-column grid to allow products to "breathe" in negative space.
*   **Scale Distortion:** Using massive typographic headers juxtaposed with microscopic, high-detail labels.
*   **Atmospheric Depth:** Replacing harsh lines with tonal layering and light-refractive surfaces.

---

## 2. Colors: The Palette of Authority
The color strategy utilizes a sophisticated Material-inspired scale to create a "liquid" hierarchy. The palette is anchored by `primary` (#005faa) to convey scientific trust, while leveraging an expansive range of whites and grays to define structure.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning or containment. 
Boundaries must be defined solely through:
1.  **Background Color Shifts:** Transitioning from `surface` (#f9f9ff) to `surface_container_low` (#f1f3ff).
2.  **Tonal Transitions:** Utilizing `surface_container_highest` (#dce2f7) to anchor focused content.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. 
*   **Base:** `surface` (#f9f9ff) is the primary floor.
*   **Elevated Sections:** Use `surface_container_low` (#f1f3ff) for large structural blocks.
*   **Interactive Containers:** Use `surface_container_lowest` (#ffffff) for floating cards or interactive modules to create a "lifted" effect.

### Glass & Gradient Transitions
To escape a flat, "out-of-the-box" feel:
*   **Glassmorphism:** Apply to global navigation and floating action panels. Use `surface_container_lowest` at 80% opacity with a 20px backdrop-blur.
*   **Signature Textures:** For Hero CTAs, use a subtle linear gradient from `primary` (#005faa) to `primary_container` (#0078d4) at a 135-degree angle. This adds "soul" and professional polish to the scientific aesthetic.

---

## 3. Typography: Editorial Authority
We utilize **Inter** exclusively. The hierarchy is driven by extreme contrast in size and weight to simulate the layout of a premium scientific journal.

*   **Display Scales (`display-lg`, `display-md`):** Used for singular value propositions. These should be tracked slightly tighter (-0.02em) to feel cohesive and authoritative.
*   **The Technical Label (`label-sm`, `label-md`):** Used for SKU numbers, chemical compositions, and metadata. These should be set in All Caps with wide letter spacing (+0.05em) to provide a "lab-grade" precision.
*   **Body Copy:** Always prioritize `body-lg` for readability. In this design system, text is a luxury; keep it minimal and high-impact.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for a pharmaceutical context. We use light to create volume.

### The Layering Principle
Depth is achieved by stacking `surface_container` tiers. A `surface_container_lowest` (#ffffff) card sitting on a `surface_container_low` (#f1f3ff) section creates a natural, soft lift that requires no external shadow.

### Ambient Shadows
When a floating effect is required (e.g., hover states), use **Ambient Shadows**:
*   **Blur:** 40px to 60px.
*   **Opacity:** 4% - 8%.
*   **Color:** Use a tinted version of `on_surface` (#141b2b). Never use pure black shadows.

### The "Ghost Border" Fallback
If a boundary is required for accessibility in input fields or selection states, use a **Ghost Border**: 
*   **Token:** `outline_variant` (#c0c7d4).
*   **Opacity:** 15%.
*   **Weight:** 1px.

---

## 5. Components: Precision Primitives

### Buttons
*   **Primary:** Background `primary` (#005faa), Text `on_primary` (#ffffff). Shape `md` (0.375rem). No shadow.
*   **Secondary:** Background `transparent`, Ghost Border (15% opacity `outline_variant`). 
*   **Tertiary (The "Apple" Link):** No background. Text `primary_container` (#0078d4) with a chevron (→). High-end, minimal, and direct.

### Input Fields
Avoid the "box" look. Use a `surface_container_lowest` (#ffffff) background with a 1px Ghost Border that transitions to a 2px `primary` underline on focus. Label text should use `label-sm` above the field for technical clarity.

### Cards & Product Grids
**Strict Rule:** No dividers. Separate product information using `spacing-6` (2rem) of vertical whitespace. 
*   **Container:** Use `surface_container_low` for the image background to make the product "pop" against the `surface_container_lowest` card body.

### Progressive Chips
Use `secondary_container` (#d5e3fc) with `on_secondary_container` text for product tags (e.g., "Clinical Grade"). Use `full` roundedness (9999px) for a soft, approachable feel.

---

## 6. Do’s and Don’ts

### Do
*   **Embrace "Aggressive Whitespace":** If you think there is enough space, add 20% more. Use `spacing-20` (7rem) and `spacing-24` (8.5rem) between sections.
*   **Use Intentional Asymmetry:** Center-align a display-lg headline, but left-align the supporting body-md text to create visual tension.
*   **Prioritize Hierarchy:** Only one `primary` button per screen. Everything else is secondary or tertiary.

### Don't
*   **Don't use 100% Opaque Borders:** This shatters the "Purity" mantra.
*   **Don't Over-Animate:** Transitions should be subtle (200ms ease-out). No bouncy or playful physics; the vibe is serious and scientific.
*   **Don't Use Dark Grays for Backgrounds:** Stay within the `surface` and `surface_container` tokens to keep the UI feeling "oxygenated."
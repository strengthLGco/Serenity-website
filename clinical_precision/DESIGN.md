# Design System Strategy: Clinical Luxury

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Clinical Curator."** 

We are moving beyond standard pharmaceutical layouts to create an experience that feels like a high-end digital gallery. The system balances the sterile precision of a research lab with the inviting luxury of a premium lifestyle brand. We achieve this by rejecting the "template" look. Instead of rigid, boxed-in grids, we utilize **intentional asymmetry**, massive breathing room (white space), and a typography-first hierarchy that guides the user through complex scientific data with effortless grace.

The goal is not just to display information, but to present it as an authoritative, premium discovery.

---

## 2. Colors & Surface Philosophy
The palette is rooted in Authority Blue and Clinical White, but its sophistication comes from how we layer these tones.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined through background color shifts. 
*   **Example:** A section containing product specifications (`surface-container-low` #f3f3f5) should sit against the main `background` (#f9f9fb) without a stroke. This creates a soft, modern distinction that feels "grown-up."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass or fine laboratory slides.
*   **Level 0 (Base):** `surface` (#f9f9fb)
*   **Level 1 (Sections):** `surface-container-low` (#f3f3f5)
*   **Level 2 (Cards/Modules):** `surface-container-lowest` (#ffffff)
*   **Level 3 (Interactive/Floating):** Use Glassmorphism (Semi-transparent `primary` or `surface` with a 20px backdrop-blur).

### The "Glass & Gradient" Rule
Flat blue is for utility; gradients are for "soul." Use subtle linear gradients for main CTAs or hero backgrounds, transitioning from `primary` (#005faa) to `primary_container` (#0078d4). This adds a three-dimensional depth that mimics the refraction of light through glass vials.

---

## 3. Typography: The Editorial Voice
We use **Inter** exclusively, but we treat it with the discipline of a luxury magazine. The brand identity is conveyed through extreme contrast between massive headers and delicate, widely-spaced labels.

*   **Display (The Statement):** Use `display-lg` (3.5rem) with tight letter-spacing for hero sections. It should feel authoritative and clinical.
*   **Headline (The Detail):** `headline-md` (1.75rem) provides the scientific context.
*   **The Signature Logo:** The wordmark "SERENITY RESEARCH LABS" must always be uppercase with a letter-spacing of `0.2em` to `0.4em`. This "wide-tracking" is a hallmark of luxury and pharmaceutical exclusivity.
*   **Body & Labels:** `body-md` (0.875rem) for technical descriptions. Use `label-md` (0.75rem) in uppercase for metadata (e.g., "PURITY: 99.8%").

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not shadows. We want the interface to feel light, airy, and "floaty."

*   **Ambient Shadows:** If a floating element (like a modal) is required, use a shadow with a blur of `40px` and an opacity of `4%`. Use a tinted shadow: `#001c39` at 4% opacity instead of pure black to maintain the "Authority Blue" essence.
*   **The "Ghost Border" Fallback:** If a border is essential for accessibility, use `outline-variant` (#c0c7d4) at **15% opacity**. It should be barely visible—a "whisper" of a line.
*   **Glassmorphism:** For top navigation bars or floating action buttons, use a semi-transparent `surface_container_lowest` (#ffffff at 80%) with a `backdrop-filter: blur(12px)`. This integrates the UI into the high-quality product imagery behind it.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#005faa) with `DEFAULT` (0.25rem) roundedness. No shadow. On hover, transition to `primary_container`.
*   **Secondary (Clinical):** Ghost style. A `Ghost Border` (15% opacity `outline-variant`) with `primary` text.
*   **Text (Tertiary):** `primary` text with an arrow icon. Use for "Learn More" links.

### Input Fields
*   **Style:** Minimalist. No background fill. Only a bottom border using `outline-variant` at 20% opacity. 
*   **Active State:** Bottom border transitions to `primary` (#005faa) at 100% opacity.
*   **Helper Text:** Use `label-sm` in `on_surface_variant` (#404752).

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Separate list items using the **Spacing Scale** `6` (2rem). Use white space as the separator.
*   **Product Cards:** Use `surface-container-lowest` (#ffffff) against a `surface-container-low` (#f3f3f5) background. Apply `xl` (0.75rem) roundedness for a premium, approachable feel.

### Lab-Specific Components
*   **Data Visualization:** Use `secondary` (#8235c3) as an accent color for scientific charts or purity graphs to differentiate from the primary brand blue.
*   **Micro-Labels:** Use `label-sm` (#0.6875rem) for chemical formulas or batch numbers, set in a slightly heavier weight (Medium 500).

---

## 6. Do's and Don'ts

### Do
*   **DO** use extreme vertical white space. If you think there’s enough space, add 20% more.
*   **DO** use high-quality, high-key (bright) product photography with soft shadows.
*   **DO** align text to a strict editorial grid but allow images to "break" the container edges for a custom feel.
*   **DO** use `secondary_fixed` (#f1daff) for very subtle highlights in "Health" or "Recovery" sections.

### Don't
*   **DON'T** use pure black (#000000). Use `on_surface` (#1a1c1d) for text to maintain softness.
*   **DON'T** use "Heavy" drop shadows. They feel "cheap" and "tech-heavy" rather than "clinical" and "luxury."
*   **DON'T** use 100% opaque borders. They create visual noise that distracts from the science.
*   **DON'T** crowd the logo. The widely-spaced logo needs a "safety zone" of at least `spacing-16` (5.5rem).
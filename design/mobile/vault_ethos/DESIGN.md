# Design System Specification: Digital Inheritance & Wealth Preservation

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Curator**. 

In the context of a digital inheritance vault, the UI must transcend typical fintech "dashboards" that often feel frantic or transactional. Instead, we aim for a high-end, editorial experience that feels like a quiet, secure, and permanent gallery. We achieve this through **Atmospheric Minimalism**: a layout philosophy that favors intentional asymmetry, extreme legibility, and a sense of "physical" layering. By breaking the rigid, boxed-in feel of standard SaaS templates, we communicate a sense of longevity and calm authority.

## 2. Colors & Surface Philosophy
The palette is built on a foundation of sophisticated slates and atmospheric grays. It is designed to feel anchored and expensive, avoiding the "plastic" look of high-saturation blues.

### The Color Roles
- **Primary (`#4f6073`)**: Used for authoritative actions and key brand moments. It is a "Muted Slate" rather than a bright "Tech Blue."
- **Secondary (`#49636f`)**: Used for supporting interactive elements, providing a subtle tonal shift that maintains a monochromatic elegance.
- **Surface & Background (`#f8f9fa`)**: The canvas. It is intentionally off-white to reduce eye strain and feel more like premium stationery than a digital screen.

### The "No-Line" Rule
To achieve a high-end editorial look, **1px solid borders are prohibited for sectioning.** Do not use lines to separate the header from the body or the sidebar from the content. 
- **Boundaries:** Define sections solely through background shifts. For example, a `surface-container-low` sidebar sitting against a `surface` main content area.
- **Tonal Transitions:** Use the `surface-container` tiers to guide the eye. Contrast is your separator, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical sheets of fine paper.
- **Base Layer:** `surface` (Background).
- **Secondary Sections:** `surface-container-low` (e.g., a subtle inset area for metadata).
- **Actionable Cards:** `surface-container-lowest` (#ffffff). High-priority content should always sit on the brightest white to "pop" against the soft gray background.

### Signature Textures: The "Glass & Gradient" Rule
While we avoid complex gradients, we use "Signature Gradients" for depth. 
- Use a subtle linear transition from `primary` to `primary_container` on main CTAs. This creates a "matte-metallic" finish that feels premium.
- **Glassmorphism:** For floating modals or navigation bars, use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. This ensures the UI feels integrated into a single cohesive environment.

## 3. Typography: Editorial Authority
We utilize a pairing of **Manrope** for high-level expression and **Inter** for functional clarity.

- **Display & Headlines (Manrope):** These are the "Editorial" voice. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. The rounded, geometric nature of Manrope feels modern yet approachable.
- **Titles & Body (Inter):** Inter is our "Functional" voice. It provides the high legibility required for legal and financial data. 
- **Hierarchy as Identity:** Use `title-lg` for card headers but keep the weight at Medium (500). Let the whitespace around the text provide the emphasis, rather than heavy bolding.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders create visual "noise." We convey hierarchy through **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container` background. The subtle shift from `#ffffff` to `#eaeff1` creates a natural lift that feels sophisticated and calm.
- **Ambient Shadows:** Only use shadows for components that truly "float" (e.g., Modals, Dropdowns). Use a large blur (`24px` to `32px`) at a very low opacity (4%–6%) using the `on-surface` color. It should feel like a soft glow, not a dark drop shadow.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` token at **15% opacity**. It should be barely perceptible—a "whisper" of a line.

## 5. Components & Primitives

### Buttons
- **Primary:** `primary` background with `on-primary` text. Use `rounded-md` (0.375rem). Avoid "Pill" shapes; the slight corner radius feels more structural and trustworthy.
- **Tertiary (Ghost):** No background, no border. Use `primary` text weight 600. These should be used for secondary navigation to keep the UI clean.

### Input Fields
- **Styling:** Use `surface-container-lowest` for the fill. 
- **Focus State:** Instead of a heavy border, use a 2px `primary` bottom-border only, or a subtle `primary` glow.
- **Labels:** Use `label-md` in `on-surface-variant`. Labels should always be visible, never hidden as placeholders.

### Cards & Vault Items
- **Rule:** Absolute prohibition of divider lines within cards.
- **Separation:** Use `spacing-4` (1.4rem) between elements or shift the background of a sub-section of the card to `surface-container-high`.
- **Vault Icons:** Use thin-line (1.5px stroke) icons. Icons should be encased in a `secondary-container` square with `rounded-md` to signify "Secure Containers."

### Legacy Progress Indicators
- For a digital inheritance vault, we need a "Time-Capsule" status. Use a subtle, slow-pulse animation on a `tertiary` dot to indicate the "Heartbeat" of the vault is active.

## 6. Do's and Don'ts

### Do:
- **Use Asymmetric Grids:** Align text to a strict 12-column grid, but allow images or cards to span 7 or 5 columns to create an editorial, non-template feel.
- **Embrace the "Empty State":** A vault should feel spacious. If there is no data, use `display-sm` typography to tell a story rather than a "No Data" icon.
- **Apply the 60-30-10 Rule:** 60% `surface`, 30% `on-surface` (text), 10% `primary` (accents).

### Don't:
- **Don't use pure black (#000000):** It is too harsh for this system. Use `on-background` (#2b3437) for all dark text.
- **Don't use 100% Opaque Dividers:** They break the "Physical Sheet" metaphor. Use whitespace (`spacing-6` or higher) to define content groups.
- **Don't use 3D Shadows:** Avoid any shadow that has a positive Y-offset greater than 4px unless it’s a high-level modal. Keep the light source "top-down and ambient."
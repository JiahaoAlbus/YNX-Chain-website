# Download hub design QA — 2026-09-25

Result: PASS for the selected blue/white directory direction, with release-truth adjustments.

Reference: `/Users/huangjiahao/.codex/generated_images/01a094cc-0ba3-7901-bcd5-56fce8330c0d/exec-d59d1400-a8fa-4d7d-9a83-d77b135c72fb.png`

Implementation captures: [desktop](evidence/download-hub-desktop.png) at 1435 × 1128; [mobile](evidence/download-hub-mobile.png) at 390 × 844. Captured from the local Vite preview in the Codex in-app browser. These are visual evidence, not public release evidence.

## Comparison

- Typography and hierarchy: existing site font, Klein-blue headings, compact search, category tabs, selected product, and six-column directory preserve the reference hierarchy. Product titles remain canonical names; 26 short purpose labels are localized in all 12 site languages. Long engineering descriptions no longer appear in the tile/feature teaser.
- Layout and spacing: selected product begins immediately below discovery; 26 tiles fit the six-column desktop grid. At 1265 px, filters move below the category row instead of covering the final category. At 390 px, categories wrap visibly, filters and feature stack, and the grid becomes two columns.
- Color, assets, icons: existing brand palette and Lucide icons are reused. The reference's package glyphs are replaced by the actual site's download glyph, keeping the product icon family consistent. No invented hero artwork, mock product imagery, or CSS illustration was added.
- Content and release truth: the visual reference shows iOS as an available Wallet choice, but the live release registry does not authorize it. The implementation shows only six eligible existing package entries; unavailable files remain in the expandable safety/release detail rather than receiving a quick download action. Product availability still follows the public contract and Wallet file eligibility.
- Interactions: category selection, free-text search, reset, and method filtering were exercised in the local browser. A Finance web entry appears, while a Finance package filter correctly produces an empty state. The final page shows 26 tiles, six eligible Wallet quick links, no document-width overflow, and no browser console errors.
- Accessibility and RTL: controls have names, selected category/tile state uses `aria-pressed`, search has a label, and package links have product/platform labels. Arabic at 1265 px and 390 px showed translated categories, correct RTL order, and no document-width overflow. Existing global focus and contrast tests remain green.

Known boundary: this QA validates the local website surface and current registry-driven links. It does not certify installed-platform behavior, an official Finance Sandbox session, or a newly published Wallet binary.

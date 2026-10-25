# Scorecard, recommendation & testing report

The scorecard and recommendation are presented in the gallery (`/design-concepts/#scorecard`). Summary:

| Criterion | A Catálogo Vivo | B Atlas Editorial | C Investor Desk | D Marès | E Mediterráneo |
|---|---|---|---|---|---|
| Visual quality | 8 | 9 | 8 | 8 | 9 |
| Premium perception | 8 | 9 | 7 | 9 | 8 |
| Originality | 6 | 9 | 8 | 8 | 8 |
| Brand fit | 9 | 7 | 6 | 7 | 8 |
| Catalog alignment | 10 | 6 | 3 | 5 | 6 |
| Business effectiveness | 8 | 7 | 9 | 7 | 8 |
| Offer clarity | 8 | 7 | 9 | 8 | 8 |
| Trust & credibility | 9 | 8 | 8 | 9 | 7 |
| UX & usability | 8 | 7 | 9 | 8 | 8 |
| Responsive potential | 8 | 8 | 8 | 9 | 8 |
| Conversion potential | 8 | 7 | 9 | 7 | 8 |
| Maintainability | 9 | 8 | 7 | 9 | 7 |
| **Average** | **8.3** | 7.7 | 7.6 | 7.8 | 7.8 |

Design judgements, not measured results.

**Recommendation:** Concept A as the base + Concept C's apartment finder as the projects section. Most catalog-aligned: A. Strongest identity: B. Clearest commercial focus: C. Best balance: A (+C finder). Borrow: D's measured area bars, E's "plot to keys" story, B's numbered project features.

## Testing report (2026-10-17, Chromium via Playwright 1.54.2, served by `tools/serve.js`)

- **Build:** none required (static). All routes served over HTTP.
- **Routes tested:** `/design-concepts/`, `/design-concepts/concept-a/` … `concept-e/` — both via gallery links and direct navigation.
- **Viewports:** 390×844, 768×1024, 1366×768, 1920×1080 (`tools/qa.js`): 0 console errors, 0 failed requests, 0 horizontal overflow on all 24 route×viewport combinations. Full-page screenshots in `tools/qa-output/` reviewed (desktop + mobile spot checks of every concept).
- **Interactions (`tools/interact.js`, 78/78 pass):** gallery → each concept → "Gallery" back; switcher current state; previews load; A filter/units dialog/plan/Esc/thumbnails; B contents scroll/units disclosure; C filters (22 → 37 → 16), sort, drawer prev/next, request prefill, tabs, "see its apartments"; D works selector, drawing toggle, area bars; E menu/Esc, reel, modal slider, service tabs; mobile menus A–D; form validation (empty, invalid email, focus to first error, success message) on all five.
- **Accessibility (`tools/a11y.js`):** no missing alt, unnamed controls, heading skips, duplicate ids or unlabelled fields. Contrast of text tokens checked numerically (all ≥ 4.5:1 after fixes). `prefers-reduced-motion` respected (QA screenshots are taken in reduced-motion mode).
- **Errors found and fixed:** A hero text over green panel, nav contrast over photo, corner overlapping thumbnails; C grid min-content overflow on mobile/tablet and visually-hidden span escaping the table scroller; C "see apartments" kept other filters; D bar scale and touch-target height of address links; low-contrast gold (A), sandstone (D), "sold" grey (B).
- **Remaining / unverified:**
  - Not tested in Firefox/Safari or on real devices (only Chromium emulation).
  - No screen-reader run; no axe-core scan (not installed). Formal WCAG conformance not claimed.
  - Opening pages via `file://` hides the recoloured logo and service icons (Chrome blocks CSS masks from `file://`). Use `node tools/serve.js` or any web server.
  - Forms open the visitor's email client (mailto); no backend.
  - Google Fonts require internet.

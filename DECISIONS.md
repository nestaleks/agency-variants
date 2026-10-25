# DECISIONS

## D1 — Framework & routing (2026-10-16)
- Keep the existing stack: **static HTML + CSS + vanilla JS**, no build step, no new runtime dependencies. Reason: site is plain static (GitHub Pages, CNAME tidgroup.es); migrating would be unjustified.
- Routes are folders with `index.html` so they work on any static host and from `file://`:
  - `agency-active/design-concepts/` — gallery
  - `agency-active/design-concepts/concept-a/` … `concept-e/`
- All asset paths are **relative** (`../../images/...`) → works on a sub-path, root domain, or file system.
- Original site files are **not modified** (bugs are documented in the audit instead).

## D2 — CSS isolation
- Each concept page loads only its own `style.css`; no shared global stylesheet → no collisions.
- Shared pieces: `design-concepts/shared/data.js` (real project data, single source of truth), `shared/form.js` (accessible validation + mailto composition), `shared/switcher.js` (concept switcher bar; injects styles under the `dc-sw` prefix only).
- Design tokens as CSS custom properties at `:root` of each concept stylesheet.

## D3 — Content rules
- Only real business content from the site + catalog. No testimonials, statistics, awards, or invented social URLs.
- Facts used: founded 2018 / "more than 7 years" (catalog); 5 projects with unit specs from the site; catalog descriptions (7 apts + private pool S'Olivar; 8 apts + parking Boho Corner; 9 apts + pool Can Marquès; pool + commercial premises, 10 min to beach Foners; 9 apts, 30 m from El Arenal, rooftop Marina Residence); partners Blanc i Blanc and RBK Prime; contacts office@/info@/pmallorca@ tidgroup.es, +34 658 058 102, +34 662 685 172.
- **Prices are NOT shown.** In-progress project prices on the current site repeat identical sequences across 3 projects (likely placeholders). All concepts use "Price on request" / "Request availability". Sold projects shown as "Sold" (per site badge). → *Needs owner confirmation.*
- Data errors not reproduced: S'Olivar project total "70.94 m²", Boho Corner apt 8 "12 bedrooms" (modal says 2 → used 2).
- Concepts are in English (site default). Spanish catalog lines appear as accents where meaningful. EN/ES switching is out of scope for concept previews (existing `translate.js` approach could be reused after selection).

## D4 — Logo
- No invented logo. `images/logo2.png` (full mark) is recolored non-destructively with CSS `mask-image` to the concept color (gold, ivory, ink, cyan). Accessible name via `aria-label`/visually-hidden text.

## D5 — Forms
- No backend exists. Contact forms validate client-side (accessible inline errors, `aria-invalid`, `aria-describedby`, live region) and then open a pre-filled email to `office@tidgroup.es`. Easy to swap for Formspree/Netlify/etc. later.

## D6 — Concepts (final directions)

| | Name | Philosophy | Palette | Type | Signature |
|---|------|-----------|---------|------|-----------|
| A | **Catálogo Vivo** (catalog adaptation, Modern Corporate Premium) | Faithful digital translation of the printed catalog | Green `#2F4A42`, gold `#B8925E`, ivory `#F4F0EA`, blush `#F0E1D6`, ink `#2B2B2B` | Cormorant Garamond (italic display) + Jost | Diagonal green corner with gold keyline, S-curve image masks, chapter openers per project |
| B | **Atlas Editorial** (Bold Editorial Luxury) | Property magazine: chapters, giant numerals, asymmetric spreads | Paper `#EEEAE3`, ink `#141312`, terracotta `#9E4A2C`, stone `#8A8478` | Bodoni Moda (display) + Karla | Oversized serif headlines, numbered chapters, pull quotes, horizontal index |
| C | **Investor Desk** (Contemporary Digital) | Decision tool for buyers/investors: explore units and data | Night `#0E1A22`, slate `#172630`, sand `#D8C3A0`, brand cyan `#04C3E2` (from existing logo), mist `#A9B8C0` | Bricolage Grotesque + IBM Plex Sans + IBM Plex Mono | Interactive unit finder (filters, sortable table, unit drawer with plan), project status tabs |
| D | **Marès** (Minimalist Architectural Precision) | Calm, gallery-like; architecture as drawing + stone | Stone `#E9E5DE`, white `#FAF8F4`, graphite `#1F1F1D`, marès `#B9A68A` | Archivo (variable width) only | 12-col hairline grid, plans as artwork, measured captions, index-style lists |
| E | **Mediterráneo** (Expressive Brand Experience) | Story "from the plot to the keys" across the island, light changing from day to dusk | Sea `#0F4553`, sun `#F4E5C6`, terracotta `#C6623A`, olive `#69764A`, night `#0A2730` | Fraunces + Figtree | Horizontal drag/scroll project reel, sticky process scrollytelling, color shift per chapter |

| F | **Casa de Cal** (Warm organic / Mallorcan vernacular) | Handmade, slow, local: limewash, round arch, green shutters | Limewash `#F1EBE1`, sand `#E4D6C3`, shutter green `#4E5C45`, ochre `#C08A3E`, umber `#3B2E25` | Young Serif + Onest | Arch masks everywhere, hero shutters opening, projects as doorways → “rooms”, compare tray (≤3 apartments, side-by-side dialog) |
| G | **Obra** (Neo-brutalist / construction-site Swiss) | “We actually build”: a builder’s site board as a website | Concrete `#E8E6E1`, paper `#FAFAF7`, ink `#111`, site yellow `#F2C200`, blueprint `#1F3FBF` | Unbounded + Instrument Sans + JetBrains Mono | Giant OBRA + site board, tape ticker (pausable), spec-sheet cards → unit tables, zoom/pan plan viewer |
| H | **Nocturno** (Cinematic dark luxury) | The island after sunset; hospitality brand film | Noir `#0B0B0C`, charcoal `#1A1A1C`, champagne `#CDB68A`, pearl `#EDE8DF`, smoke `#A19E98` | Italiana + Hanken Grotesk | Crossfading showreel with pause (WCAG 2.2.2), full-screen scenes with letterbox bars, cinematic lightbox, credits-roll services |
| I | **Carta Náutica** (Cartographic) | Location is the main value driver → browse by place | Chart paper `#F3EFE4`, sea `#2D5D7B`, ink `#1E2A30`, pine `#3F6B4E`, coral `#E07A5F` | Newsreader + Sora + DM Mono | Hand-drawn SVG chart of Mallorca, interactive Palma chart + Sóller locator with pin buttons, gazetteer list, legend cards |
| J | **Hogar Match** (Friendly product / bento grid) | Approachable for first-time and remote buyers | Almond `#F6F1EA`, sky `#BFD7EA`, mint `#CFE3D4`, peach `#F6C9A8`, navy `#1D2B4F` | Schibsted Grotesk + Literata italic | Bento hero, 3-question home-match quiz ranking real units with “why it matches”, prefilled enquiries |

| K | **Postal** (Retro travel poster) | 1960s Mallorca tourism graphics: posters, stamps, postcards | Sun `#F3B33D`, Mediterranean blue `#1C4E8A`, coral `#D8553A`, cream `#F7EEDC`, ink `#1B1A2E` | Rozha One + Albert Sans + Courier Prime | Poster hero, duotone project posters → postcard dialog with all homes, stamp process, ticket services, postcard form |
| L | **Agua** (Luminous water & light) | Pools and sea as real selling points; surface → depth | White, foam `#EEF6F7`, aqua `#7FCFD6`, deep pool `#0E5E6F`, abyss `#0B2A33` | Syne + Mulish | Canvas caustics hero (pausable), render/plan range slider per project, depth gauge, glass project dialogs |
| M | **Dossier** (Annual report / private bank) | Investor document: traceable figures, footnotes | Report paper `#FBF1E6`, white, ink `#1A1A1A`, oxblood `#7A1F2B`, slate `#4A5560` | Source Serif 4 + Public Sans | Report cover + contents, SVG charts from unit data (accessible table toggle), numbered exhibits, print dossier / per-project A4 one-pager |

Catalog influence: A = direct; B = italic serif heritage + warm stone; C = none visually except gold→sand; D = catalog calm + ivory; E = catalog Mediterranean imagery. F–J (added 2026-10-20) deliberately explore new territory; F is the closest (warm, Mediterranean), G/H/I/J have weak catalog alignment.

## D7 — Skills
- Used: `bencium-impact-designer` (design principles: distinct type pairings per concept, avoid generic AI aesthetics, motion with reduced-motion). Skill asks to consult before committing — not done because the specification already defines directions and asks for autonomous delivery; owner chooses via the gallery.
- Browser QA: globally installed `playwright@1.54.2` (Node) with local Chromium — no Playwright *skill* installed.

## D8 — Tooling location
- Dev/QA scripts live in project root `tools/` (outside `agency-active/`, so they are not deployed).

## Rejected
- React/Vite migration — unnecessary for static brochure site.
- Reusing stock images (bitcoin, toy house, gallery placeholders) — off-brand.
- Shared global CSS framework — risks sameness across concepts.

## D9 — Rendering & viewing (2026-10-17)
- Project-, unit- and service-dependent sections are rendered by small vanilla JS from `shared/data.js` (one source of truth for 37 units across 5 concepts). Static sections are plain HTML. If chosen for production, render the project data server/build-side or inline it for SEO/no-JS.
- Logo recolouring via CSS `mask-image` requires HTTP(S); `file://` is not supported in Chrome. Accepted (site is hosted over HTTPS).

## D10 — Recommendation (pending owner approval)
- Base on Concept A (catalog continuity, lowest risk), add Concept C's apartment finder as the projects section. Alternatives remain separate until the owner chooses.

## D11 — Concepts F–J (2026-10-20)
- Five more directions added on the same principles as A–E (D1–D5, D9): own style.css per concept, data from `shared/data.js`, shared form contract, logo via CSS mask, no invented facts/prices, reduced-motion, single h1.
- `shared/switcher.js` lists A–J; on ≤600px the pill scrolls horizontally.
- Interaction tests for F–J live in `tools/tests/concept-<x>.js` and are loaded by `tools/interact.js`.
- Concept I uses approximate public coordinates for Palma/Port de Sóller, labelled “approx.”; map outline is stylised. Pin positions need owner confirmation before production.
- Concept G leaves out the live site’s “guaranteed monthly profits” wording on purpose (unverifiable claim).
- Scorecard extended to 10 columns; F–J scores are the building agents’ self-assessment, reviewed. Recommendation unchanged (A + C’s finder); F’s compare tray, G’s plan viewer, I’s map and J’s quiz listed as borrowable features.

## D12 — Concepts K–M (2026-10-20)
- Three more directions on the same rules (D1–D5, D9, D11): K Postal, L Agua, M Dossier. Switcher lists A–M; tests in tools/tests/concept-{k,l,m}.js.
- K, L and M also omit the live site's "guaranteed monthly profits" wording. M states no returns and adds an explicit "not an offer" footnote.
- Scorecard extended to 13 columns (agent self-scores, reviewed). Recommendation unchanged; L's slider, M's one-pager and K's poster style listed as borrowable.

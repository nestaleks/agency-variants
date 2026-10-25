# Asset inventory

All paths relative to `agency-active/`. Originals are never modified; concepts reference them by relative path (`../../images/...`). Recoloring is done non-destructively in CSS.

## Logos

| Path | Size | Notes | Use |
|------|------|-------|-----|
| images/logo.png | 957×215 PNG, transparent | Cyan `#04C3E2` + **white** lower mark (invisible on light bg) | Not used directly |
| images/logo2.png | 961×216 PNG, transparent | Cyan + black — full mark | **Master for all concepts** via CSS `mask-image` → solid gold / ivory / ink. Shape preserved exactly, no invented logo |
| favicon.ico | 15 KB | Site favicon | Reused |
| images/partners-blanc-i-blanc.png | 663×114 | Partner logo (black) | Partners strip (A–E), filtered for dark bgs |
| images/partners_rbk.png | 1249×463 | RBK Prime logo (black+gold) | Partners strip |

## Project photography / renders (primary content — all suitable)

| Folder | Content | Quality | Key files |
|--------|---------|---------|-----------|
| images/projects/solivar/ | Real photos: aerial with pool, façade, interiors, plans | 1920×1080, good | -01 aerial (hero-grade), -02 pool, -04/-05 interiors, plan-1..3 |
| images/projects/boho-corner/ | Real photos: façade, roof terrace, 15+ interiors, plans | 1920×1080, good | -01 façade, -02 terrace, -06 rooftop, -07/-08 living |
| images/projects/can-marques/ | Renders: façades, aerial, pool; unit plans | Mixed: 1280×720, portrait 970×1280, **-05 only 546×640** | -01 pool, -02/-04 façades (portrait — good for editorial), -07 street |
| images/projects/foners-club/ | Renders: street façade, aerial, pool | 1920×1080, good | -01 façade, -04 aerial pool, -05 pool |
| images/projects/marina-residence/ | Renders by the sea | 1920×1080, good | -01..-04 (hero-grade) |
| images/projects/*/listings_*.jpeg | Unit thumbnails | **379×267 — low-res**, use small only | Unit tables (C) |
| images/projects/*/…-plan-*.jpg, …apart*.jpg | Floor plans | 1920×1080 line drawings | D (architectural) and C (unit drawer) |

## Location / lifestyle

| Path | Notes | Use |
|------|-------|-----|
| images/top__img.jpg | 1920×1080 aerial Port de Sóller (S'Olivar area) | Hero (A, E) |
| images/top__img1.jpg | 1235×764 S'Olivar façade | Secondary |
| images/mallorca__img.jpg | 1280×853 Port de Sóller harbour | Mallorca story |
| images/*-bg.jpg (solivar, boho-corner, can-marques, foners, marina) | 1000×635 project cards | Card fallbacks |

## Stock / unsuitable (avoid in premium concepts)

| Path | Reason |
|------|--------|
| images/direction-4.jpg (toy house + coins), direction-5.jpg (bitcoin), direction-3.jpg (worker), direction-1 (blueprint), direction-2 (scaffolding) | Generic stock, undermines premium perception; bitcoin imagery is off-brand for real estate |
| images/investments-1..3.jpg | Generic stock (cranes, handshake) |
| images/gallery/01–06/* | 6 folders with **identical** placeholder stock (fire, snow, wheat, books…) — unrelated to the company |
| images/news/* | Generic stock (non-Mallorca houses) |
| images/personal-1.jpg | 154×154 cartoon avatar placeholder |

## Icons

`images/icons/*.svg` — 40 line icons (services, amenities, contact, socials). Single-color strokes; usable as CSS masks for recoloring. Used sparingly in C (amenity chips) and D (none — typographic). Social icons (facebook, instagram, twitter, youtube) used in footers; **actual social URLs are not present** in the project — icons link nowhere on the current site, so concepts omit social links rather than invent URLs.

## Fonts

No local font files. Site uses Google Fonts Poppins + Jost. Concepts use Google Fonts (documented per concept in DECISIONS.md).

## Catalog screenshots

`style-images/*.jpg` are reference material only — not used as website imagery (they are page photos with baked-in layout and text).

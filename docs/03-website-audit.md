# Audit — existing website (`agency-active/`, tidgroup.es)

**Company:** Top Invest Development Group SL ("TID group"), Palma de Mallorca. Boutique residential developer: land selection & purchase, design, construction, sales, rental, renovation, investment consulting. 5 projects: S'Olivar (Port de Sóller, sold), Boho Corner (El Terreno, sold), Foners Club (Foners), Marina Residence (Les Meravelles / El Arenal), Can Marquès (Pere Garau) — in progress.

**Stack:** static HTML (13 pages + 5 project pages + 3 news), CSS via `@import` chain in `app.css` (14 files, ~4,000 lines), jQuery 3.7.1 + Magnific Popup, custom `main.js` (menu, language, accordion, modals, dynamic gallery/news loading) and `translate.js` (EN/ES via `data-key`). No build step, no package.json. Hosting: GitHub Pages-style (`CNAME` = tidgroup.es). No git repository in this working copy.

## 8.1 Visual quality

**Strengths:** real project photography and renders are good; clean white background; project cards with photos; floor plans and unit cards exist.

**Weaknesses**
- Brand mismatch: teal `#237385` + cyan logo + Poppins vs. the new catalog's dark green / gold / italic serif. The website feels like a generic template; the catalog feels premium.
- Weak hierarchy: hero headline is thin white text over a busy aerial photo; most sections share the same small heading style.
- Stock imagery in core "What we do" block (toy house with coins, bitcoin hand, construction worker, blueprint) — undermines premium perception and credibility.
- Five near-identical image/text zig-zag rows → long, monotonous page (~7,100 px at 1440 wide).
- Small body text (≈13–14 px) with justified-looking dense paragraphs; low contrast light-grey on white in places.
- Mixed alignment, inconsistent spacing between sections.

## 8.2 UX

- Navigation: Home / Projects (anchor) / Investments / Services / Contacts. About, Gallery, News pages exist but are **not in the menu**.
- No contact form; the only CTAs are `mailto:` and a phone link. "Special Offer" CTA hidden behind a "Read More" accordion.
- No primary CTA in hero; scroll-down GIF instead.
- Project cards show only name/area; no status/unit count/price range at a glance.
- Unit modals exist on project pages (good), but prices for in-progress projects appear copy-pasted (identical €595k/640k/670k/870k sequences across Can Marquès, Foners, Marina) — likely placeholders → trust risk.
- Accessibility: many `alt=""` on informative images (12 of 20 on home), generic alt "Design Professionals images", heading levels jump (h1 → h3 → h4 → h6), `title="Повернутися нагору"` (Ukrainian) on the English site, language switcher is a non-button `span` without keyboard support, burger `button` without accessible label.

## 8.3 Business effectiveness

| Question | Current answer |
|----------|----------------|
| What is offered | Partially — mixed list of 12 services, investment, construction, repair |
| For whom | Not stated (implicitly international buyers/investors in Mallorca) |
| Problems solved | Generic ("we make your dreams come true") |
| Why choose | Not evidenced; catalog's "since 2018", "7+ years", "quality control at each stage" are missing on the site |
| Differentiation | Boutique buildings of 7–9 units in prime Palma/Sóller locations — not communicated |
| Trust | Two partner logos; completed projects (sold) — under-used |
| Next step | Unclear; no form, no "request availability / brochure" |

Opportunities: lead with the portfolio; show status (sold / in progress) and unit facts; one primary conversion ("Request availability & prices" form); secondary ("Call", "Email", "Investment consultation"); use catalog positioning lines; remove generic stock and generic news.

Not to invent: testimonials, sales numbers, awards, delivery dates, prices.

## 8.4 Technical quality

- **Console errors:** `index.html` and `services.html` call jQuery-based code (`$`) but do not load jQuery → `ReferenceError: $ is not defined`.
- **Broken path:** footer logo on root pages uses `../images/logo.png` → 404 at root.
- `gallery.html` references `../js/...` scripts from the root → 404 (5 failed requests under file://).
- About page loads gallery/news by fetching other HTML pages — fails under `file://`, works only via HTTP.
- CSS via chained `@import` (render-blocking waterfall, 15 requests).
- Two Google Font families with all 18 weights each (very heavy).
- Images: no `width/height`, no `loading="lazy"`, JPEGs 150–600 KB, no WebP/AVIF; 6 gallery folders of duplicated stock (~11 MB).
- Data inconsistencies: S'Olivar total area "70.94 m²" (equals one unit), Boho Corner apartment 8 "12 bedrooms".
- Typos: "Engagemen", stray `>` characters in headings, "Our teams strives".
- `target="blank"` instead of `_blank`, no `rel="noopener"`.

## Recommendations used for concepts

1. Adopt catalog identity (dark green / gold / ivory, italic serif) at least in one concept; elevate others.
2. Portfolio-first IA: Projects → Approach/services → Investment → Mallorca → Contact.
3. Status-aware project presentation with real unit facts; "price on request" for in-progress projects until verified.
4. Real contact form (static-friendly: composes email; ready to hook to a form backend) + phone/email.
5. Remove stock imagery; use only real project photos/renders.
6. Semantic headings, labelled controls, keyboard support, reduced-motion support.
7. Single CSS file per page, limited font weights, lazy images with dimensions.

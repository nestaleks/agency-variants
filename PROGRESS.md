# PROGRESS

- **Project root:** `D:\Projects\agency-variants` (site in `agency-active/`, catalog screenshots in `style-images/`)
- **Business:** TID group (Top Invest Development Group SL), Mallorca residential developer — tidgroup.es
- **Stack:** static HTML/CSS/vanilla JS (+ jQuery on legacy pages). No package.json, no build. **No git repo.**
- **Current stage:** COMPLETE — 13 concepts (A–M) delivered; awaiting owner's choice of direction
- **Last verified checkpoint:** 2026-10-17 00:10 +0300 — all routes QA ✓ (24 route×viewport), interactions 78/78 ✓, a11y scan clean

## Completed & verified
- Discovery, catalog analysis, asset inventory, audit, strategy, skills report → `docs/01–05`
- Gallery `agency-active/design-concepts/` with real screenshots, palettes, pros/cons, audit summary, scorecard, recommendation
- Concepts F–J (2026-10-20): Casa de Cal, Obra, Nocturno, Carta Náutica, Hogar Match — gallery cards, previews, scorecard columns
- Concepts A–E, each complete homepage with nav, hero, CTA, projects from real data, services, investment, contact form, footer, responsive, interactions
- Testing report → `docs/06-scorecard-and-testing.md`

## Files created
- Root: AGENT_TASK.md, PROGRESS.md, TASK_CHECKLIST.md, DECISIONS.md, SESSION_LOG.md
- `docs/01..06*.md`
- `agency-active/design-concepts/` (index.html, gallery.css, README.md, previews/, shared/{data,form,switcher}.js, concept-a..e/{index.html,style.css,script.js})
- `tools/` serve.js, qa.js, interact.js, a11y.js, peek.js (qa-output/ = generated screenshots, can be deleted)

## Files modified
- None of the original site files (legacy site untouched; its bugs are documented, not fixed).

## Build/test status
- No build step. `tools/qa.js` ✓, `tools/interact.js` 78/78 ✓, `tools/a11y.js` ✓ (Chromium 1.54.2 via global npm `playwright`).

## Known issues / limitations
- `file://` viewing hides the CSS-masked logo & icons → use `node tools/serve.js`.
- Only Chromium tested; no screen reader / axe run.
- Forms use mailto (no backend). Prices shown as "on request".

## Blockers: none technical. Owner input needed (see Unresolved).
## Unresolved questions (owner)
1. Which direction (recommendation: A + C's finder)?
2. Real prices/availability for in-progress units.
3. Social media URLs; Spanish copy; form backend service; whether to also fix legacy-site bugs.

## Next exact actions (when owner decides)
1. Develop chosen concept into full site (project pages, ES translation via existing `translate.js` approach).
2. Replace mailto with form backend; add analytics if desired.
3. Optionally test Firefox/WebKit: `npx playwright install firefox webkit` then add browsers to tools/qa.js.

## Run / resume
```
cd D:\Projects\agency-variants
node tools/serve.js                     # http://localhost:8080/design-concepts/
# QA (another terminal; NODE_PATH = global node_modules, e.g. D:/home/nestaleks/.npm-global/node_modules):
node tools/qa.js [--shots] [--previews]
node tools/interact.js
node tools/a11y.js
```
Resume: read AGENT_TASK.md, PROGRESS.md, TASK_CHECKLIST.md, DECISIONS.md, SESSION_LOG.md; inspect `agency-active/design-concepts/`; continue from "Next exact actions".

## Checkpoint 2026-10-20 — concepts F–J
- Added concept-f … concept-j (index.html, style.css, script.js), tools/tests/concept-{f..j}.js, previews/concept-{f..j}.jpg; gallery index.html (cards, jump list, 10-column scorecard, why/reco), gallery.css (wide sticky table), switcher.js (A–J), qa.js/a11y.js routes, interact.js loader.
- Verified: qa.js all 11 routes × 4 viewports ✓; interact.js 220/220 ✓; a11y.js no findings.

## Checkpoint 2026-10-20 (later) — concepts K–M
- Added concept-k (Postal), concept-l (Agua), concept-m (Dossier) + tests + previews; gallery cards, 13-column scorecard, why/reco; switcher, qa/a11y/interact routes.
- Verified: qa.js all 14 routes × 4 viewports ✓; interact.js 303/303 ✓ (run twice); a11y.js no findings.

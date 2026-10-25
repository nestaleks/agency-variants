# TID group — website design concepts

Presentation gallery: `/design-concepts/` · Concepts: `/design-concepts/concept-a/` … `/concept-m/`

| | Concept | Folder |
|---|---|---|
| A | Catálogo Vivo — digital adaptation of the 2026 catalog | `concept-a/` |
| B | Atlas Editorial — bold editorial luxury | `concept-b/` |
| C | Investor Desk — apartment finder, data-forward | `concept-c/` |
| D | Marès — minimalist architectural precision | `concept-d/` |
| E | Mediterráneo — expressive brand storytelling | `concept-e/` |
| F | Casa de Cal — warm Mallorcan vernacular, arches & compare tray | `concept-f/` |
| G | Obra — neo-brutalist builder’s site board, zoomable plans | `concept-g/` |
| H | Nocturno — cinematic dark luxury, showreel & lightbox | `concept-h/` |
| I | Carta Náutica — cartographic, projects on an interactive chart | `concept-i/` |
| J | Hogar Match — friendly bento grid, 3-question home-match quiz | `concept-j/` |
| K | Postal — retro Mallorca travel poster, postcard dialogs | `concept-k/` |
| L | Agua — luminous water & glass, render/plan slider | `concept-l/` |
| M | Dossier — investor report, charts from data, printable one-pagers | `concept-m/` |

- Plain HTML/CSS/JS, no build. Each concept loads only its own `style.css` (no shared global CSS).
- `shared/data.js` — real project/unit/service data (single source of truth; prices intentionally omitted).
- `shared/form.js` — accessible validation, then opens a pre-filled email to office@tidgroup.es.
- `shared/switcher.js` — "← Gallery · A … M" bar on concept pages.
- `previews/*.jpg` — screenshots of the real pages (regenerate with `tools/qa.js --previews`).

Run locally (from the project root `D:\Projects\agency-variants`):

```
node tools/serve.js            # → http://localhost:8080/design-concepts/
```

View through a web server, not `file://` (Chrome blocks the CSS-masked logo/icons on `file://`).

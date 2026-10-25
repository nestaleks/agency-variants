# Skills & tooling report

## Inspected (Claude Code skill list, 2026-10-16)
Relevant skills installed: `bencium-impact-designer`, `bencium-controlled-ux-designer`, `bencium-innovative-ux-designer`, `ui-ux-pro-max`, `ui-typography`, `design-audit`, `design:accessibility-review`, `design:design-critique`, `design-system`, `ui-styling` (Tailwind/shadcn — not applicable to this static stack).

## Used
- **bencium-impact-designer** — instructions loaded and applied: one committed aesthetic per concept, distinctive type pairs (no Inter/Roboto/Space Grotesk), CSS variables, purposeful motion, reduced-motion, 44px targets, WCAG AA intent.
- Other skills were *not* loaded/used (do not claim them).

## Browser automation
- No Playwright *skill* installed. Used the globally installed Node package `playwright@1.54.2` with locally cached Chromium (`%LOCALAPPDATA%\ms-playwright`). Scripts: `tools/serve.js` (static server) and `tools/qa.js` (screenshots, console errors, failed requests, overflow).
- MCP servers `@playwright/mcp` and `@executeautomation/playwright-mcp-server` are installed globally as npm packages but not connected in this session.

## Missing / recommendations
- Visual regression (e.g. Playwright `toHaveScreenshot` via `@playwright/test`) — official docs: https://playwright.dev/docs/test-snapshots . Would require `npm i -D @playwright/test` in a package.json; not installed to avoid adding dependencies to the site.
- Automated accessibility scanning: `@axe-core/playwright` — https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright . Not installed (needs user approval / network).
- Lighthouse for performance — https://github.com/GoogleChrome/lighthouse .

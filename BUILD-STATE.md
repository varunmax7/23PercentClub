# BUILD-STATE

Last updated: 2026-08-31 by claude-opus-5 session
Current phase: 2 (blocked — see Blockers) / 3 or 4 can start next
Branch: main

| Phase | Name | Status | Gate passed | Commit |
|---|---|---|---|---|
| 0 | Scaffolding & Guardrails | ✅ | 2026-08-31 | ea87483 |
| 1 | Design System & Components | ✅ | 2026-08-31 | (this commit) |
| 2 | Port Existing Content | ⬜ | | |
| 3 | Financial Tools | ⬜ | | |
| 4 | Education Blogs | ⬜ | | |
| 5 | Money Basics | ⬜ | | |
| 6 | Legends, Home, About, Disclosures | ⬜ | | |
| 7 | SEO, Performance, Analytics | ⬜ | | |
| 8 | Full QA & Compliance Audit | ⬜ | | |
| 9 | Deploy & Handoff | ⬜ | | |

## Blockers

- Phase 2 (port existing content) is blocked at the source: no legacy static
  site (`data.js`, legacy HTML, mindmap SVGs) exists in this repository or
  anywhere findable at Phase 0 pre-flight. Per README §0.6 / §12 R1, this
  does not block any other phase. Founder needs to supply the legacy asset
  bundle (or its location) before Phase 2 can start.

## Deviations from README

- **Stack versions**: README §2 pins Next.js `^14`. `create-next-app@latest`
  in this environment installed **Next.js 16.3.3 / React 19.2.8 / Tailwind
  v4**. Tailwind v4 is CSS-first (no `tailwind.config.ts`) — the Sapphire
  Blue tokens are wired via `@theme inline` in `src/app/globals.css` instead
  of a Tailwind config file. Functionally equivalent (`bg-sapphire`,
  `text-ink`, etc. all resolve), but §2 and §8 Phase 0/1 file manifests that
  mention `tailwind.config.ts` should be read as "the theme wiring lives in
  globals.css on this stack." Not reverting to Next 14 — no reason to fight
  the toolchain on a fresh scaffold.
- Fonts use `next/font/google` for Outfit + Inter directly (README's intent);
  the scaffold's default Geist fonts were removed.
- **Added `--color-alert-amber-text: #8F4F00`**, not in README §3.1. The
  locked `--alert-amber` (#C77700) fails WCAG AA contrast for small text —
  2.96:1 on off-white, 3.46:1 on white, both need 4.5:1 — caught by the
  Gate G1 axe check on `/dev/components`. `--alert-amber` still exists
  unchanged for swatches/borders/background tints (its own use is fine,
  a 10%-opacity fill has no independent contrast requirement); the new
  token is used wherever amber renders as text or an icon fill on a light
  background (`ComplianceNote`, `ProductCard` risk labels). Same hue,
  darkened for legibility — not a brand-color change.
- **Primary button text changed from white to ink.** README didn't specify
  a text color for the Bright-Blue primary CTA; white was the obvious
  first choice but fails WCAG AA (2.12:1 on `--bright-blue`, need 4.5:1) —
  also caught by the Gate G1 axe check. `--ink` on `--bright-blue` is
  8.24:1. Affects `Button`/`ButtonLink` primary variant and the home hero
  CTA. This is the site's only CTA color per README §3.1, so every primary
  button everywhere inherits the fix from one place (`src/components/ui/Button.tsx`).

## Gate G1 result

`npm run verify` green (lint, typecheck, 15 unit tests, build). Compliance
check: 4 rendered routes, 0 violations (`/`, `/_not-found`, `/dev/components`,
global-error exempted per script comment). Playwright a11y suite
(`tests/e2e/dev-components.spec.ts`, tagged `@a11y`): axe zero
critical/serious violations on `/dev/components`, keyboard tab order
verified. Two real contrast defects were found and fixed during this Gate
(alert-amber text, primary button text) rather than suppressed — see
Deviations above. Visual pass via Playwright screenshots (desktop +
mobile home, full gallery) confirms the Sapphire Blue system renders with
no generic-SaaS-card defaults; screenshots sent to the founder.

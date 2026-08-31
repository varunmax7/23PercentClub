# BUILD-STATE

Last updated: 2026-08-31 by claude-opus-5 session
Current phase: 6 can start next (2 still blocked — see Blockers)
Branch: main

| Phase | Name | Status | Gate passed | Commit |
|---|---|---|---|---|
| 0 | Scaffolding & Guardrails | ✅ | 2026-08-31 | ea87483 |
| 1 | Design System & Components | ✅ | 2026-08-31 | 18a13e2 |
| 2 | Port Existing Content | ⬜ | | |
| 3 | Financial Tools | ✅ | 2026-08-31 | 2ffb7c8 |
| 4 | Education Blogs | ✅ | 2026-08-31 | c5800d3 |
| 5 | Money Basics | ✅ | 2026-08-31 | (this commit) |
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
- **Added `next-mdx-remote` (not named in README §2).** README's chosen
  MDX deps (`@next/mdx`, `gray-matter`) solve MDX-as-page-routes and
  frontmatter parsing respectively, but the architecture README itself
  specifies — content in `src/content/blog/*.mdx`, read by slug via a
  dynamic `[slug]` route, per §4.1/§6.3/§14 — needs a third piece: a
  compiler that turns an MDX *string* into a React element at request/
  build time. `next-mdx-remote/rsc` is the standard, actively-maintained
  library for exactly that pattern in the App Router. No behavior change
  this represents; it's the missing piece the stated architecture already
  implied.
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

## Gate G3 result (Financial Tools)

Compute engine (`src/lib/calculators.ts`) built and fully tested *before*
any page existed, per §5.1's compute-before-UI rule: 42/42 unit tests
green, **100% branch coverage** (`npm run test:coverage`). Step-up SIP at
0% step-up is bit-identical to flat SIP (same `simulateMonthly` code path
for both — not just approximately equal). All 4 calculator pages +
`/tools` index built on top of the tested engine, sharing one
`<CalculatorLayout>`. `npm run verify` green. `npm run compliance`: 9
rendered routes, 0 violations — the illustrative-return caveat is present
on every `/tools/*` route. Playwright e2e
(`tests/e2e/calculators.spec.ts`): the on-screen SIP maturity value
matches an independently-computed expected value to within ±₹1 (count-up
animation rounding), compliance note present on all four calculators,
step-up comparison callout shows a positive advantage, zero critical/
serious axe violations. Visual pass (desktop + mobile screenshots of
`/tools` index, all four calculators) sent to the founder.

**Flagged for Phase 7, not blocking this Gate:** measured real gzipped JS
for `/tools/sip-calculator` against a production server is **~237KB**,
over the `<180KB` budget this README states in §9.3. Recharts is the
majority of it (~140KB gzip across its two largest chunks). §8 Phase 3's
own Gate G3 definition doesn't include the JS budget — that's Phase 7's
Lighthouse gate — so this isn't a Phase 3 blocker, but Phase 7 needs to
either lazy-load `<GrowthChart>`, swap to a lighter chart approach, or
revise the §9.3 number; don't let Phase 7 discover this cold.

## Gate G4 result (Education Blogs)

MDX pipeline built: `src/lib/content.ts` (`getAllPosts`, `getPublishedPosts`,
`getPostsByCategory`, `paginatePosts`, `getPostBySlug` via
`next-mdx-remote/rsc`'s `compileMDX`), frontmatter schemas centralised in
`src/lib/content-schemas.ts` and shared by `scripts/validate-content.ts`
and the test suite so they can't drift. `npm run validate:content` passes
on all 7 posts. `npm run verify` green (69 unit tests total — 42 from
Phase 3 + 13 content-validation + a few pre-existing — 100% pass).
`npm run compliance`: 16 rendered routes, 0 violations across all 7 posts
(no banned phrasing tripped).

Shipped `/learn/blog` (paginated, category filter via URL param) and
`/learn/blog/[slug]` (SSG via `generateStaticParams`, correct
`generateMetadata` incl. `og:image`/`og:title` — verified against actual
served HTML, not just the build log). All 7 rotation categories
represented by real posts (not placeholders), four of which are the exact
posts Phase 3's calculator CTAs were left pointing at generically —
those `TODO(phase-4)` markers are now removed and link to real slugs,
verified by e2e click-through.

**Content discipline held to §11.3**: no fabricated statistics anywhere.
The case-study post ("The IPO Everyone Wanted") is explicitly labelled a
composite/illustrative pattern rather than citing unverifiable specific
numbers about a named company — safer than guessing, and still teaches
the pattern. Every post that states a figure carries at least one real,
generic citation (SEBI, AMFI, RBI, Income Tax Act, NISM) — `sources[]`
enforced by the schema's requireSources rule, which is intentionally
blunt (any digit in a published post → needs a source) and caught even
"23% Club" itself as a digit-bearing string once, which is correct
behavior for a rule designed to fail closed.

18/18 Playwright e2e + a11y tests green (10 calculator + 4 blog-specific +
2 gallery, incl. zero critical axe violations on the blog index and a
post page). Visual pass (index + 2 posts, including the flagship post's
live `CalculatorEmbed` links into all four tools) sent to the founder.

**Fixed in this Gate, not deferred:** `metadataBase` was unset, which
silently resolved all OG image URLs against `localhost` in production —
a real SEO defect, not a Phase 7 concern, so fixed immediately in the
root layout using `NEXT_PUBLIC_SITE_URL` (already defined in `.env.example`
since Phase 0).

## Gate G5 result (Money Basics)

Extended the content contracts for a third content type — `MoneyBasicsFrontmatter`
in `types.ts`, `moneyBasicsSchema` in `content-schemas.ts` — deliberately
*not* forced into the blog/legend shape (no status/draft; keys on `topic`
not `slug`) since README §5.3 never specified a formal frontmatter
contract for this one, unlike §6.3's blog/legends. `scripts/validate-content.ts`
now checks `src/content/money-basics/*.mdx` too. `content.ts` gained
`getMoneyBasicsTopics()` (fixed order: loans, credit-cards, debt, taxes,
insurance) and `getMoneyBasicsTopic()`, sharing the same `compileMDX` +
`mdxComponents` path as blog posts.

Shipped `/learn/money-basics` (index) and all 5 topic pages, each
following the fixed structure from §5.3. `npm run verify` green (62 unit
tests, up from 55). `npm run validate:content` and `npm run compliance`
(22 routes, 0 violations) both clean. New required test
(`tests/money-basics-links.test.ts`) asserts every topic links ≥1
`/tools/` page and ≥1 `/learn/blog/` post — plus an extra check (not
explicitly required, added because it's cheap and exactly what Gate G5's
"no product named as a recommendation" line means in practice) that no
page names a specific lender, card, or insurer. 24/24 Playwright e2e +
a11y tests green.

**Held the line on §0.1 rule 4 (never invent financial data) under real
pressure.** The tax page is where this mattered most: rather than stating
specific 80C limits or slab thresholds I couldn't verify as current —
which change with every Union Budget — every page writes around them
("check the Income Tax Department's current figure") instead of guessing
or leaving a dangling `[VERIFY:]` marker. This was a deliberate choice,
not an oversight: a `[VERIFY:]` marker left in on a *published* page
would have failed `compliance-check.ts` Rule 4 and blocked this Gate by
its own design — the marker is for in-flight drafts, not a way to ship
an unresolved claim. The one specific, dated fact stated directly (debt
mutual funds losing indexation for units acquired on/after 1 April 2023,
taxed at slab rate under Section 50AA) is pre-specified by name in
README §5.3 itself and is a discrete historical legal change, not a
drifting rate — cited to the Income Tax Act / Income Tax Department.
`VERIFY-QUEUE.md` has zero rows as a direct result, satisfying Gate G5's
requirement without needing to resolve anything after the fact.

The case-study pattern from Phase 4 repeats here: no real lender, card,
or insurer is named anywhere across the five pages (enforced by the new
test above), consistent with §5.3's "explainer hub, not product
comparison" framing.

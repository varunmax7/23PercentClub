# 23% Club — Production Build Orchestration

**Version:** 2.0 (Production)
**Owner:** Saikumar, Founder — 23 Percent Club Pvt Ltd, Hyderabad
**Purpose of this file:** This README is a build contract. An LLM CLI agent (Claude Code, or equivalent) reads this file top to bottom and executes it phase by phase, in order, without skipping ahead. Each phase has a **Definition of Done** — do not start the next phase until the current one is met.

**Brand line:** *"We don't manage your money. We teach you how to manage it."*
**Tagline:** *Learn · Invest · Grow · Compound.*
**Compliance posture:** Pre-RIA. Every page, every tool, every blog post is **financial education**, never personalised advice. No buy/sell/target-price language. No portfolio review formats. No affiliate income from brokers/AMCs.

---

## 0. How to use this file (for the LLM CLI agent)

1. Read the whole file before writing any code.
2. Execute phases in order: **0 → 8**. Each phase ends with a "Definition of Done" checklist — verify it before moving on.
3. Never invent financial data, return figures, or statistics. If a number is needed and not supplied in `/content/data/`, insert `[VERIFY: source needed]` instead of guessing.
4. Every calculator, blog post, and tool page must render the SEBI disclaimer (see §5.7) in the footer — no exceptions.
5. Commit after every phase with a message in the format `phase(N): <what shipped>`.
6. If a decision is ambiguous, follow the default stated in this file rather than pausing for input — the founder reviews and edits after each phase.

---

## 1. Project Overview

23% Club is a financial education and behavioural-investing platform for Indian retail investors. The product is a **content + tools website**: it teaches SIP discipline, compounding, and long-term wealth building through calculators, structured education content, and storytelling (Investing Legends). It does not manage money and does not give personalised advice.

**Primary audience:** Indian retail investors, 22–40, early-to-mid career, first-time or undisciplined investors who exit SIPs at breakeven, chase F&O, or don't understand compounding.

**Core user jobs-to-be-done:**
- "Show me what my SIP will actually be worth" → Calculators
- "Teach me the thing nobody explained to me" → Education content (blogs, mindmaps, roadmap)
- "Make discipline feel earned, not preachy" → Investing Legends storytelling
- "Help me untangle loans/cards/tax/insurance without selling me a product" → Money Basics hub

---

## 2. Tech Stack (Production Recommendation)

The current site is static HTML/CSS/JS with a shared `data.js`. That was right for a fast MVP. For production — blogs that need to scale, calculators that need to stay maintainable, and SEO that needs to compete with 1% Club / Groww / ET Money content — upgrade to a framework. Recommendation below is deliberately boring and proven, not trendy.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router, TypeScript)** | SSR/SSG for SEO on blog + tool pages, file-based routing matches the existing IA cleanly, huge ecosystem, deploys free-tier friendly |
| Styling | **Tailwind CSS** + CSS variables for the Sapphire Blue design tokens | Fast to build, keeps the existing design-system variables portable, avoids one-off CSS drift across 60+ pages |
| Content (blogs, legends) | **MDX** files in-repo (`/content/blog/*.mdx`) to start; migrate to a headless CMS (Sanity or Contentful free tier) only once posting cadence exceeds ~3x/week and non-technical editors need access | Zero infra cost initially; clean upgrade path |
| Calculators (compute) | Client-side TypeScript, pure functions, unit-tested — **no server round-trip needed** since SIP/lumpsum/step-up/inflation math is deterministic | Instant results, no backend cost, works offline |
| Charts | **Recharts** (React-native, matches existing Chart.js usage conceptually, easier to theme with Tailwind tokens) | Lighter than D3, good enough for calculator output graphs |
| Market data (existing) | **TradingView embeddable widgets** (already integrated in `market.html`) — carry over as-is | No change needed, already working |
| Forms / lead capture | **React Hook Form** + simple serverless function (Next.js API route) → email via **Resend** or **Google Sheets webhook** (no CRM cost yet) | Cheap, no vendor lock-in pre-revenue |
| Hosting | **Vercel** (free tier covers this scale) | Native Next.js support, preview deployments per PR, zero DevOps |
| Analytics | **Plausible** or **Google Analytics 4** (Plausible preferred — no cookie banner needed, privacy-friendly, matches an education-brand's trust posture) | Compliance-friendly, simple |
| Version control / CI | GitHub + GitHub Actions (lint, typecheck, build on every PR) | Standard, free |
| Search (site-wide + product filter, already exists) | Keep client-side fuzzy search (e.g. `fuse.js`) for the 68-product database — no need for a search server at this scale | Matches current UX, cheap |

**Migration path from current static site:** Phase 1 below treats the existing static pages (Ecosystem, Universe, Roadmap, Products, Instruments, Mindmaps, market.html) as content to port into Next.js routes and components — not rebuilt from scratch. Preserve all verified data and copy exactly; only the rendering layer changes.

---

## 3. Design System — Sapphire Blue (locked, extended for production)

Do not deviate from the locked brand tokens. Apply `frontend-design` principles: the signature move here is the ECG-heartbeat-into-cross logo mark and the Sapphire/Bright-Blue contrast — spend restraint everywhere else. Avoid generic SaaS-card kit defaults (identical rounded cards, one shadow on everything, tracked-out ALL-CAPS eyebrows) unless the content is genuinely a sequence.

### Color tokens
```css
:root {
  --sapphire-blue: #0F52BA;   /* primary */
  --bright-blue:   #00BFFF;   /* accent — CTAs, highlights, active states */
  --ink:           #0A1A2F;   /* body text, near-black-blue, not pure black */
  --white:         #FFFFFF;
  --off-white:     #F7FAFD;   /* section backgrounds, not stark white */
  --slate:         #5C6B7A;   /* secondary text */
  --success-green: #1D9A6C;   /* positive calculator output only — never for return "promises" */
  --alert-amber:   #C77700;   /* compliance disclaimers, risk notes */
  --border:        #E1E8F0;
}
```

### Typography
- Display / headings: **Outfit** (already locked)
- Body / UI: **Inter** (already locked)
- One accent weight only — do not bold random phrases mid-sentence (generic AI tell). Let hierarchy come from size and the Sapphire/Bright-Blue pairing, not from scattered bold.

### Layout principles for this build
- Left-aligned, generous line length capped under ~75 characters for body/blog copy.
- Numbered steps (Roadmap's 17 steps, calculator "how it works") get numbering because they are genuinely sequential — the 68-product grid and blog cards do **not** get numbering.
- One signature motion moment per page (e.g. the calculator result animating in), not hover-fade on every card.
- Calculators are the "hero" interaction of the tools section — treat the input+result panel as the most crafted UI element on the site, everything else quiet around it.

---

## 4. Information Architecture (full site map)

```
23percentclub.com
│
├── / (Home) — hero, mission line, 3-pillar nav (Tools / Learn / Legends), latest post
│
├── /tools  (Financial Tools hub — NEW)
│   ├── /tools/sip-calculator
│   ├── /tools/step-up-sip-calculator
│   ├── /tools/lumpsum-calculator
│   ├── /tools/inflation-calculator
│   └── /tools (index — cards linking to each, "why these numbers matter" framing)
│
├── /learn  (Education hub — restructured)
│   ├── /learn/blog                      (Education Blogs — NEW, paginated)
│   │   └── /learn/blog/[slug]
│   ├── /learn/money-basics              (NEW umbrella for the 4 topics below)
│   │   ├── /learn/money-basics/loans
│   │   ├── /learn/money-basics/credit-cards
│   │   ├── /learn/money-basics/debt
│   │   ├── /learn/money-basics/taxes
│   │   └── /learn/money-basics/insurance
│   ├── /learn/ecosystem                 (existing — Financial Ecosystem)
│   ├── /learn/universe                  (existing — 12 asset classes)
│   ├── /learn/roadmap                   (existing — 17-step lifecycle)
│   ├── /learn/products                  (existing — 68 products, search/filter/compare)
│   ├── /learn/instruments               (existing — 6 families, 27 instruments)
│   └── /learn/mindmaps                  (existing — 8 interactive SVGs)
│
├── /legends  (Investing Legends — restructured as its own pillar, NEW as standalone hub)
│   ├── /legends/benjamin-graham
│   ├── /legends/peter-lynch
│   ├── /legends/charlie-munger          (episode 3, in progress)
│   └── /legends (index — "Legend Stories, Taught Like a Teacher Would")
│
├── /market  (existing — live TradingView data, carry over as-is)
│
├── /about   (Founder story, IIT Madras + NISM path, mission, team)
│
└── /disclosures (SEBI disclaimer, methodology notes for every calculator, data sources)
```

**Nav bar (all pages):** `Tools | Learn | Legends | Market | About` — Bright Blue active-state underline, Sapphire Blue base. Footer repeats the SEBI disclaimer on every single page (§5.7), not just tool pages.

---

## 5. Feature Modules — Detailed Spec

### 5.1 Financial Tools (new — highest priority)

All four calculators share one computation engine (`/lib/calculators.ts`) and one UI shell (`<CalculatorLayout>`) so behaviour and disclaimers stay consistent.

**a) SIP Calculator**
- Inputs: Monthly investment (₹), expected annual return (%, default 12%, user-editable, with a note that this is illustrative not promised), investment duration (years).
- Formula: `FV = P × [((1 + r/12)^n − 1) / (r/12)] × (1 + r/12)` where P=monthly SIP, r=annual rate, n=months.
- Output: Total invested, estimated wealth gained, maturity value, year-by-year growth chart (Recharts area chart, Sapphire fill).
- Compliance line directly under the result: *"Assumed return is illustrative only, not a promise or guarantee."*

**b) Step-up SIP Calculator**
- Inputs: Starting monthly SIP, annual step-up % (e.g. 10% increase every year), expected return %, duration.
- Formula: iterative year-by-year FV compounding where the monthly contribution increases by the step-up % at the start of each year.
- Output: Same as SIP calculator + a comparison line showing "flat SIP vs step-up SIP" final value difference — this is the single most persuasive number for the discipline narrative.

**c) Lumpsum Calculator**
- Inputs: One-time investment (₹), expected annual return (%), duration (years).
- Formula: `FV = P × (1 + r)^n`
- Output: Maturity value, wealth gained, growth chart.

**d) Inflation Calculator**
- Inputs: Current amount (₹), expected inflation rate (% default 6%), number of years.
- Formula: `Future cost = P × (1 + inflation)^n`; also show **real value erosion**: `Real value = P / (1 + inflation)^n`.
- Output: "What ₹X today will feel like in Y years" — framed to justify why SIP returns need to beat inflation, links back to SIP calculator.

**Shared requirements across all four:**
- Every result panel shows a "How this is calculated" expandable — transparency builds trust, and it's a compliance safeguard (nothing is a black box).
- No tool ever recommends a fund, AMC, or product. Output is purely arithmetic on user-entered assumptions.
- Mobile-first sliders + numeric input, both editable.
- Each calculator page ends with a contextual CTA into a related blog post (e.g. SIP calculator → "Why most investors stop their SIP at the worst possible time").

### 5.2 Education Blogs (`/learn/blog`)
- MDX-based, frontmatter: `title, slug, date, category, readTime, author, coverImage, excerpt`.
- Categories map directly to the locked 7-day content rotation (§ Content Operating System in brand memory): Behavioural Finance, Case Studies, Founder Journey, Wealth Frameworks, Contrarian, Personal Stories, Flagship.
- Company Case Study posts must never use "investment thesis" language — enforce via a lint rule / checklist in the MDX template comment.
- Every post ends with the pre-posting filter as an internal-only comment in the template (not shown to readers): `{/* Could another finance creator publish this word-for-word? If yes, don't post it. */}`

### 5.3 Money Basics — Loans, Credit Cards, Debt, Taxes, Insurance (`/learn/money-basics/*`)
- Structured as **explainer hub pages**, not product comparison pages (avoids the "portfolio review" / advice-adjacent trap).
- Each sub-topic page structure: What it is → How it actually works in India → Common mistakes → A worked example with real (cited) numbers → Related tools/blog links.
- Tax page must reflect current rules precisely — e.g. debt mutual funds purchased after April 2023 taxed at slab rate under Section 50AA, not old 3-year LTCG/indexation. Flag any figure needing verification rather than guessing.
- Insurance page distinguishes term vs investment-linked plans conceptually — again, education framing only, never "buy this policy."

### 5.4 Investing Legends (`/legends`)
- Each legend gets a long-form narrative page: life context → the defining investing lesson → the sharper, less-obvious version of that lesson (per founder's principle: prefer the harder truth over the simple narrative) → how an Indian retail investor applies it today.
- Graham and Lynch content already exists — port and re-theme. Munger (Episode 3) is the next to be authored; leave `/legends/charlie-munger` as a stub page with `status: draft` frontmatter until content is ready.
- Every legend page cites sources for any specific number or quote; unverified quotes are framed as "often attributed to," never asserted as fact.

### 5.5 Existing Modules (port, don't rebuild)
Ecosystem, Universe (12 asset classes), Roadmap (17 steps), Products (68, search/filter/compare), Instruments (6 families / 27), Mindmaps (8 SVGs) — migrate content 1:1 from the current `data.js` into typed Next.js data modules (`/content/data/*.ts`). No content rewrites in this phase; only the rendering layer changes.

### 5.6 Market Data (`/market`)
Carry over TradingView embeds as-is. No functional change — just re-skin inside the new nav shell.

### 5.7 SEBI Disclaimer (non-negotiable, site-wide)
Footer component on **every** page, and directly under every calculator result:
> *Educational content only. Not investment advice. Please consult a SEBI-registered investment adviser before making investment decisions.*

---

## 6. Phase-Wise Build Plan (execute in this order)

### Phase 0 — Environment & Scaffolding
- [ ] `npx create-next-app@latest` with TypeScript, Tailwind, App Router, `/src` directory.
- [ ] Install: `recharts`, `fuse.js`, `react-hook-form`, `mdx` support (`@next/mdx`), `gray-matter` for frontmatter parsing.
- [ ] Set up Tailwind config with the Sapphire Blue tokens from §3 as CSS variables + Tailwind theme extension.
- [ ] Set up GitHub repo, GitHub Actions CI (lint + typecheck + build on PR).
- [ ] **Definition of Done:** `npm run build` succeeds on a blank scaffold with the design tokens wired in and visible on a placeholder home page.

### Phase 1 — Design System & Shared Components
- [ ] Build `<Navbar>`, `<Footer>` (with SEBI disclaimer), `<CalculatorLayout>`, `<BlogCard>`, `<LegendCard>` components.
- [ ] Implement logo (icon mark, horizontal wordmark, stacked square) as SVG components.
- [ ] Typography scale (Outfit/Inter) applied globally.
- [ ] **Definition of Done:** A component storybook page (`/dev/components`) renders every shared component with sample data; visually matches the Sapphire Blue system with no generic SaaS-card defaults.

### Phase 2 — Port Existing Content (Ecosystem, Universe, Roadmap, Products, Instruments, Mindmaps, Market)
- [ ] Convert `data.js` into typed `/content/data/*.ts` modules — one-to-one data migration, no content edits.
- [ ] Rebuild each existing page as a Next.js route reusing shared components from Phase 1.
- [ ] Re-embed TradingView widgets on `/market`.
- [ ] **Definition of Done:** All 6 existing pages render identically in content to the current static site, on the new stack, with working search/filter/compare on Products.

### Phase 3 — Financial Tools (SIP, Step-up, Lumpsum, Inflation Calculators)
- [ ] Build `/lib/calculators.ts` with pure, unit-tested compute functions for all four formulas in §5.1.
- [ ] Write unit tests (Jest) covering edge cases: 0% return, 0 duration, very large durations.
- [ ] Build `<CalculatorLayout>` UI: input panel, result panel, Recharts growth chart, "how this is calculated" expandable, SEBI compliance line.
- [ ] Build all four calculator pages under `/tools`.
- [ ] **Definition of Done:** Each calculator produces mathematically correct output (spot-check against manual computation), disclaimer renders on every result, mobile responsive.

### Phase 4 — Education Blogs
- [ ] Set up MDX pipeline: `/content/blog/*.mdx` → `/learn/blog/[slug]`.
- [ ] Build blog index with category filter matching the 7-day rotation.
- [ ] Migrate/author first batch of posts (start with anything already published on LinkedIn/Instagram that fits the education-blog format).
- [ ] **Definition of Done:** Blog index paginates correctly, individual posts render with correct SEO metadata (title, description, OG image), category filter works.

### Phase 5 — Money Basics Hub (Loans, Credit Cards, Debt, Taxes, Insurance)
- [ ] Build the 5 sub-topic pages using the structure in §5.3.
- [ ] Verify every tax/regulatory figure against the latest primary source before publishing; mark unverified figures explicitly.
- [ ] **Definition of Done:** All 5 pages live, each cross-links to at least one relevant calculator and one relevant blog post.

### Phase 6 — Investing Legends Hub
- [ ] Migrate Graham and Lynch content into the new `/legends` structure and template.
- [ ] Build Munger stub page (`status: draft`).
- [ ] **Definition of Done:** `/legends` index and both live legend pages render correctly with citations intact; no unverified figures.

### Phase 7 — SEO, Performance, Analytics, QA
- [ ] Add sitemap.xml, robots.txt, per-page metadata.
- [ ] Lighthouse pass on mobile: target 90+ on Performance, Accessibility, Best Practices, SEO.
- [ ] Wire up Plausible/GA4.
- [ ] Full-site QA pass: every page has the SEBI footer, no broken internal links, no console errors.
- [ ] **Definition of Done:** Lighthouse targets met on the 5 highest-traffic page types (home, one calculator, one blog post, one legend page, products page).

### Phase 8 — Deploy & Handoff
- [ ] Deploy to Vercel, connect custom domain.
- [ ] Set up preview deployments per PR.
- [ ] Write a short internal `CONTENT-GUIDE.md` documenting: how to add a blog post, how to add a legend, where the SEBI disclaimer logic lives, how to update a calculator's default assumptions.
- [ ] **Definition of Done:** Production URL live, founder can independently publish a new blog post via a PR without touching code logic.

---

## 7. Folder Structure (target)

```
/23club
├── src/
│   ├── app/
│   │   ├── page.tsx                       (Home)
│   │   ├── tools/
│   │   ├── learn/
│   │   │   ├── blog/[slug]/
│   │   │   ├── money-basics/[topic]/
│   │   │   ├── ecosystem/ universe/ roadmap/ products/ instruments/ mindmaps/
│   │   ├── legends/[slug]/
│   │   ├── market/
│   │   ├── about/
│   │   └── disclosures/
│   ├── components/     (Navbar, Footer, CalculatorLayout, BlogCard, LegendCard, charts)
│   ├── lib/             (calculators.ts, formatters.ts, search.ts)
│   └── content/
│       ├── blog/*.mdx
│       ├── legends/*.mdx
│       └── data/         (ecosystem.ts, universe.ts, roadmap.ts, products.ts, instruments.ts, mindmaps.ts)
├── public/                (logo SVGs, OG images)
├── tests/                 (calculators.test.ts, ...)
└── README.md              (this file)
```

---

## 8. Open Decisions (flag to founder, do not silently assume)

- CMS upgrade trigger: move blog content from MDX-in-repo to Sanity/Contentful once posting exceeds ~3x/week or a non-technical editor needs direct access.
- Lead capture destination (Resend email vs Google Sheets webhook) — default to Google Sheets webhook for zero cost until there's a reason to formalise.
- Whether `/legends` absorbs the existing "Investing Legends" LinkedIn series 1:1 or gets web-native rewrites — default to reusing existing researched content, re-formatted for web, not rewritten from scratch.

---

*This document is the single source of truth for the production build. Update it in the same PR as any architectural change so it never drifts from what's actually shipped.*

# CONTENT-GUIDE

A plain-language guide for publishing content on 23% Club **without touching code logic**. If you can edit a text file and open a pull request on GitHub, you can do everything in this guide.

---

## 1. How the site works, in one paragraph

Every blog post, legend story, and money-basics page is a text file (`.mdx` — Markdown with a few extra tags) living in `src/content/`. The site reads those files and builds pages from them automatically. To publish something new, you add a file; to change something, you edit a file; to unpublish, you flip one word (`status`) from `published` to `draft`. Nothing else needs to change.

## 2. How to add a blog post

1. Go to `src/content/blog/` on GitHub (or in your local copy) and open any existing post as a template — e.g. `why-most-investors-stop-sip.mdx`.
2. Copy it to a new file. The filename becomes the URL, so name it in kebab-case, e.g. `the-emergency-fund-nobody-keeps.mdx`.
3. Replace the frontmatter (the block between the two `---` lines at the top) with your post's details:

   ```yaml
   ---
   title: "The Emergency Fund Nobody Keeps"
   slug: "the-emergency-fund-nobody-keeps"   # must exactly match the filename (without .mdx)
   date: "2026-09-15"                          # YYYY-MM-DD
   category: "wealth-frameworks"               # one of the 7 below — nothing else
   readTime: 5                                  # your best guess, in minutes
   author: "Saikumar"
   coverImage: "/blog/the-emergency-fund-nobody-keeps.svg"
   excerpt: "Short teaser, 200 characters or less — this is what shows on the card and in Google."
   status: "draft"                              # start as draft, flip to "published" when ready
   sources: ["Name of the source you cited"]    # required if the post states ANY number, rate, or date
   ---
   ```

   The seven allowed `category` values (locked, one per day of the week — see README §11.1): `behavioural-finance`, `case-studies`, `founder-journey`, `wealth-frameworks`, `contrarian`, `personal-stories`, `flagship`.

4. Write the body in Markdown below the frontmatter. A few things the template pulls in automatically:
   - `<SourceCitation label="..." href="..." />` — use this next to any number you cite, don't just link it as plain text.
   - `<CalculatorEmbed tool="sip" />` (or `step-up`, `lumpsum`, `inflation`) — links to a calculator instead of duplicating it.
   - `<Callout>...</Callout>` — a highlighted box for a key takeaway.
5. Before you post, run this test on yourself: **"Could another finance creator publish this word-for-word? If yes, don't post it."** This is the site's actual editorial filter — it's written into the post template as a reminder, not shown to readers.
6. Open a pull request. GitHub/Vercel will build a **preview deployment** — a private link where you can see exactly how the post will look, before anyone else can see it.
7. Once it looks right on the preview, change `status: "draft"` to `status: "published"` and merge the PR. The post is now live, in the blog index, in its category filter, and in the sitemap — automatically, with no other step.

## 3. How to add a legend (Investing Legends story)

Same process as a blog post, but the files live in `src/content/legends/` and the frontmatter is a bit different:

```yaml
---
name: "Charlie Munger"
slug: "charlie-munger"
era: "1924 – 2023"
oneLineLesson: "The one-sentence version of the lesson this page teaches."
status: "draft"
sources: ["Any sources for facts or figures stated in the page"]
coverImage: "/legends/charlie-munger.svg"
---
```

Follow the same four-part structure the existing legend pages use: life context → the defining investing lesson → the sharper, less-obvious version of that lesson → how an Indian retail investor applies it today. Any quote you can't independently verify should be framed as "often attributed to," not stated as fact.

## 4. How to publish a draft

Find the file in `src/content/blog/`, `src/content/legends/`, or `src/content/money-basics/`, change `status: "draft"` to `status: "published"`, and merge. That's the entire publish action — the page immediately starts appearing in its index, its category filter, and the sitemap; a `noindex` tag is removed automatically. Flipping it back to `draft` reverses all of that instantly.

A draft can sit in the repo indefinitely without being live. This is the safe way to work on something over multiple sessions — it simply isn't visible to readers or to Google until you flip the switch.

## 5. Where the SEBI disclaimer lives, and why you should never retype it

The exact legal text —

> *Educational content only. Not investment advice. Please consult a SEBI-registered investment adviser before making investment decisions.*

— lives in exactly one place in the code: `src/lib/compliance.ts`, as `SEBI_DISCLAIMER`. Every page on the site imports it from there rather than having its own copy. If you (or a future developer) ever need to change the disclaimer's wording, change it in that one file — the change will apply everywhere automatically, and it's impossible for two pages to accidentally show slightly different wording. **Never type this sentence out by hand anywhere else in the codebase.**

An automated check (`npm run compliance`, part of every PR's CI run) fails the build if any page is missing this disclaimer, or if any `/tools/*` page is missing the shorter "assumed return is illustrative, not a promise" note that goes directly under a calculator result. You cannot accidentally ship a page without it.

## 6. How to change a calculator's default assumption (e.g. the 12% return)

Each calculator's starting values live in its own form component under `src/components/calculator/`:

| Calculator | File | Default(s) |
|---|---|---|
| SIP | `SipForm.tsx` | `annualReturnPct` starts at `12` |
| Step-up SIP | `StepUpForm.tsx` | `annualReturnPct` starts at `12` |
| Lumpsum | `LumpsumForm.tsx` | `annualReturnPct` starts at `12` |
| Inflation | `InflationForm.tsx` | `inflationPct` starts at `6` |

The home page hero (`src/components/home/HomeHero.tsx`) also runs a live SIP projection at `annualReturnPct: 12` — if you change the SIP default, decide whether the hero should match (it isn't wired to the same constant, so it won't update automatically).

**What else must change with it:** the formula and explanation text shown in "How this is calculated" — and mirrored on `/disclosures` — both read from one file, `src/lib/methodology.ts`. That file states the formula itself, not the default number, so changing the default percentage doesn't require touching it. But if you change *why* 12% (or 6%) is the assumption — e.g. citing a specific benchmark — update the `assumptionCaveat` text there too, since `/disclosures` and every calculator page read the same sentence from that one source.

This is not a decision to make casually: the default return is the single most visible number on the highest-traffic page of the site. Any change should have a defensible basis (a long-run index average, cited), not a guess.

## 7. What `[VERIFY: source needed]` means and how to clear it

When a specific number, rate, date, or quote is needed but nobody has confirmed a primary source for it yet, the placeholder text `[VERIFY: source needed]` goes in the copy instead of a guess, and a row gets added to `VERIFY-QUEUE.md` at the repo root.

- This is a **legitimate, safe state for a draft** — it lets writing continue without inventing a number.
- It is **not allowed on a published page.** An automated check fails the build if `[VERIFY:` appears anywhere in a live route. This is deliberate: it is a build failure by design, not a bug.

**To clear one:** find the real number from a primary source (the regulator's own site, the Act itself, the fund's own filing — not a news article summarizing it), replace `[VERIFY: source needed]` with the real figure, add a `<SourceCitation>` next to it, and delete the corresponding row from `VERIFY-QUEUE.md`. If no reliable source can be found, rewrite the sentence to not need the specific number at all (several Money Basics pages do this deliberately for tax thresholds that change every Union Budget — they point readers to "check the current figure on the Income Tax Department's site" instead of stating a number that will go stale).

## 8. A few things worth knowing before you publish

- **Never name a specific fund, broker, bank, or insurer** anywhere — not even as an example. An automated check blocks this (`BANNED_PRODUCT_NAMES` in `src/lib/compliance.ts`); if you hit it on a real, legitimate brand name that should be allowed, that's a conversation with whoever maintains the code, not something to work around.
- **Never use** "guaranteed return," "we recommend," "you should invest in," "target price," "best fund," or similar advice-adjacent language — an automated check blocks these too, case-insensitively.
- Every projected/assumed number needs assumption language next to it ("illustrative only, not a promise"). Every number you state as fact needs a `<SourceCitation>`.
- If you're not sure whether something crosses a line, it probably does. When in doubt, cut the claim rather than soften it.

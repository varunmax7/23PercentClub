/**
 * Structured data (JSON-LD) builders — README §8 Phase 7 step 3. Article
 * on blog and legend pages, Organization on Home. No FAQPage on Money
 * Basics: that structure is What it is / How it works / Common mistakes
 * / Worked example / Related, not genuinely Q&A, and README is explicit
 * that FAQPage only belongs "where the content genuinely is Q&A" —
 * forcing it here would be misleading structured data, not a shortcut.
 */

// Single source for the production site URL, shared by sitemap.ts,
// robots.ts, and the root layout's metadataBase — `||` rather than `??`
// deliberately, because Vercel's dashboard submits a blank env var field
// as an empty string, not an omitted one; `??` only falls back on
// null/undefined, so `new URL("")` was throwing ERR_INVALID_URL in
// production when the field was left blank at project-import time.
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function organizationJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "23% Club",
    url: base,
    logo: `${base}/og-default.svg`,
    description:
      "Financial education and behavioural-investing platform for Indian retail investors. Educational content only, not investment advice.",
    slogan: "We don't manage your money. We teach you how to manage it.",
  };
}

export function articleJsonLd(article: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  author: string;
  image?: string;
}) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: `${base}${article.url}`,
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "23% Club" },
    ...(article.image ? { image: `${base}${article.image}` } : {}),
  };
}

/**
 * JSON.stringify output embedded in a <script> tag needs `</` escaped —
 * otherwise a literal "</script>" inside a string value would terminate
 * the tag early. Defensive even though current content is all
 * internally authored, not user input.
 */
export function jsonLdScriptContent(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

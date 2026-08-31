import type { YearPoint, Product, BlogFrontmatter, LegendFrontmatter } from "@/lib/types";

export const sampleSeries: YearPoint[] = Array.from({ length: 10 }, (_, i) => {
  const year = i + 1;
  const invested = 5000 * 12 * year;
  const value = invested * Math.pow(1.06, year);
  return { year, invested, value, gain: value - invested };
});

export const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Index Fund (Nifty 50)",
    category: "Equity Mutual Fund",
    riskLevel: "moderate",
    liquidity: "T+1 redemption",
    taxation: "LTCG 12.5% over ₹1.25L/yr",
    description: "Tracks the Nifty 50 index; low-cost, broad market exposure.",
    suitableFor: ["Long-term SIP investors"],
  },
  {
    id: "p2",
    name: "Public Provident Fund",
    category: "Government-backed",
    riskLevel: "low",
    liquidity: "15-year lock-in, partial withdrawal after 7 yrs",
    taxation: "EEE — fully tax-exempt",
    description: "Sovereign-backed long-term savings instrument with compounding interest.",
    suitableFor: ["Retirement-horizon savers"],
  },
  {
    id: "p3",
    name: "Small Cap Mutual Fund",
    category: "Equity Mutual Fund",
    subCategory: "Small Cap",
    riskLevel: "very-high",
    liquidity: "T+1 redemption",
    taxation: "LTCG 12.5% over ₹1.25L/yr",
    description: "Invests in smaller companies with higher growth and higher volatility.",
    suitableFor: ["High risk tolerance, 7+ year horizon"],
  },
];

export const sampleBlogPosts: Pick<
  BlogFrontmatter,
  "title" | "slug" | "date" | "category" | "readTime" | "excerpt"
>[] = [
  {
    title: "Why Most Investors Stop Their SIP at the Worst Possible Time",
    slug: "why-most-investors-stop-sip",
    date: "2026-08-24",
    category: "behavioural-finance",
    readTime: 6,
    excerpt:
      "The market doesn't punish bad investors as much as bad timing punishes disciplined ones.",
  },
  {
    title: "The Founder Journey: Building in the Open",
    slug: "founder-journey-building-in-open",
    date: "2026-08-19",
    category: "founder-journey",
    readTime: 4,
    excerpt: "What it actually takes to build a financial education platform from Hyderabad.",
  },
];

export const sampleLegends: Pick<
  LegendFrontmatter,
  "name" | "slug" | "era" | "oneLineLesson" | "status"
>[] = [
  {
    name: "Benjamin Graham",
    slug: "benjamin-graham",
    era: "1894 – 1976",
    oneLineLesson: "Margin of safety isn't caution — it's the entire discipline.",
    status: "published",
  },
  {
    name: "Charlie Munger",
    slug: "charlie-munger",
    era: "1924 – 2023",
    oneLineLesson: "Episode 3 — in progress.",
    status: "draft",
  },
];

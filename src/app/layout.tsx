import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "23% Club";
const DEFAULT_DESCRIPTION =
  "Financial education and behavioural-investing tools for Indian retail investors. We don't manage your money. We teach you how to manage it.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "23% Club — Learn, Invest, Grow, Compound",
    template: "%s | 23% Club",
  },
  description: DEFAULT_DESCRIPTION,
  // Every route inherits these; routes with their own openGraph/twitter
  // block (blog posts, legends) override title/description/images only —
  // Next merges rather than replaces, so siteName/type/locale here still
  // apply everywhere.
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    title: "23% Club — Learn, Invest, Grow, Compound",
    description: DEFAULT_DESCRIPTION,
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "23% Club — Learn, Invest, Grow, Compound",
    description: DEFAULT_DESCRIPTION,
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PlausibleScript />
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

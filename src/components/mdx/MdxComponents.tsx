import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { Callout } from "./Callout";
import { CalculatorEmbed } from "./CalculatorEmbed";
import { SourceCitation } from "@/components/ui/SourceCitation";

/**
 * Prose typography for post bodies — matches the Sapphire Blue type
 * scale (README §3.2) rather than default browser styles. Shared by
 * every compiled post via src/lib/content.ts.
 */
export const mdxComponents: MDXComponents = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 mb-4 font-display text-2xl font-semibold text-ink" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 mb-3 font-display text-xl font-semibold text-ink" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 font-body text-base leading-relaxed text-ink" {...props} />
  ),
  a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return <Link href={href} className="text-sapphire underline decoration-border hover:decoration-sapphire" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sapphire underline decoration-border hover:decoration-sapphire"
        {...props}
      />
    );
  },
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 font-body text-base leading-relaxed text-ink" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2 font-body text-base leading-relaxed text-ink" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 border-l-2 border-sapphire pl-5 font-body text-base italic leading-relaxed text-slate" {...props} />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-off-white px-1.5 py-0.5 font-mono text-sm text-sapphire" {...props} />
  ),
  hr: () => <hr className="my-10 border-border" />,
  Callout,
  CalculatorEmbed,
  SourceCitation,
};

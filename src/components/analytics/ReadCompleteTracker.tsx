"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires `blog_read_complete` once, when a sentinel placed after the
 * article body scrolls into view — a reasonable proxy for "read to the
 * end" without needing scroll-percentage math or a time-on-page timer
 * that would fire even if the tab is just left open in the background.
 */
export function ReadCompleteTracker({ slug }: { slug: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          trackEvent("blog_read_complete", { slug });
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [slug]);

  return <div ref={sentinelRef} aria-hidden="true" />;
}

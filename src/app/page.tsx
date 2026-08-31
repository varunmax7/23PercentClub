import { SEBI_DISCLAIMER } from "@/lib/compliance";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-off-white px-6 py-24 text-center">
        <p className="font-body text-sm uppercase tracking-wide text-slate">
          Learn · Invest · Grow · Compound
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold text-sapphire sm:text-5xl">
          23% Club
        </h1>
        <p className="max-w-xl font-body text-lg text-ink">
          We don&apos;t manage your money. We teach you how to manage it.
        </p>
        <a
          href="/tools"
          className="rounded-full bg-bright-blue px-6 py-3 font-body font-medium text-white transition-colors hover:opacity-90"
        >
          Explore the tools
        </a>
      </main>
      <footer className="border-t border-border bg-white px-6 py-6 text-center font-body text-xs text-slate">
        {SEBI_DISCLAIMER}
      </footer>
    </div>
  );
}

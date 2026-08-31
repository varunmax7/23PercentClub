import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
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
      <ButtonLink href="/tools">Explore the tools</ButtonLink>
    </main>
  );
}

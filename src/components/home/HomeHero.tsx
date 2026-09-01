"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSip } from "@/lib/calculators";
import { formatINR } from "@/lib/formatters";
import { HeartbeatPulse } from "@/components/calculator/HeartbeatPulse";
import { InputSlider } from "@/components/calculator/InputSlider";
import { useCountUp } from "@/components/calculator/useCountUp";
import { ButtonLink } from "@/components/ui/Button";
import { ComplianceNote } from "@/components/ui/ComplianceNote";

/**
 * The hero is a thesis, not a headline: this site's entire pitch is
 * "arithmetic, not slogans," so the hero IS the arithmetic — a live,
 * one-slider version of the SIP calculator, not a static claim about it.
 * README §8 Phase 6.
 */
export function HomeHero() {
  const [monthly, setMonthly] = useState(10000);
  const result = useMemo(
    () => calculateSip({ monthlyAmount: monthly, annualReturnPct: 12, years: 15 }),
    [monthly],
  );
  const animatedValue = useCountUp(result.maturityValue);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
      <div className="flex flex-1 flex-col gap-5">
        <p className="font-body text-sm uppercase tracking-wide text-slate">
          Learn · Invest · Grow · Compound
        </p>
        <h1 className="max-w-lg font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          We don&apos;t manage your money.{" "}
          <span className="text-sapphire">We teach you how to manage it.</span>
        </h1>
        <p className="max-w-md font-body text-lg text-slate">
          Move the slider. That&apos;s the whole pitch — arithmetic on your
          own assumptions, never a fund recommendation.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/tools">Explore the tools</ButtonLink>
          <ButtonLink href="/learn" variant="secondary">
            Start learning
          </ButtonLink>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-border bg-off-white p-6 sm:p-8">
        <HeartbeatPulse className="mb-4 h-6 w-full" />
        <p className="font-body text-sm font-medium text-ink">
          If you invested this much every month for 15 years, at an
          illustrative 12% return
        </p>
        <InputSlider
          label="Monthly investment"
          value={monthly}
          onChange={setMonthly}
          min={500}
          max={200000}
          step={500}
          unit="₹"
        />
        <p className="mt-6 font-body text-sm text-slate">it could become</p>
        <p className="tabular-nums font-display text-4xl font-semibold text-sapphire sm:text-5xl">
          {formatINR(animatedValue)}
        </p>
        <Link
          href="/tools/sip-calculator"
          className="mb-4 mt-4 inline-block font-body text-sm font-medium text-sapphire hover:underline"
        >
          Open the full SIP Calculator →
        </Link>
        <ComplianceNote />
      </div>
    </div>
  );
}

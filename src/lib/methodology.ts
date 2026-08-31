/**
 * One methodology entry per calculator — the single source read by both
 * <HowThisIsCalculated> on each tool page and /disclosures (Phase 6), so
 * the formula can never be stated differently in two places. See
 * README §5.1 shared requirement and §6.1 engine rules.
 */

export interface Methodology {
  slug: "sip" | "step-up-sip" | "lumpsum" | "inflation";
  name: string;
  formula: string;
  explanation: string;
  assumptionCaveat: string;
}

export const METHODOLOGY: Record<Methodology["slug"], Methodology> = {
  sip: {
    slug: "sip",
    name: "SIP Calculator",
    formula: "FV = P × [((1 + r/12)^n − 1) / (r/12)] × (1 + r/12)",
    explanation:
      "P is your monthly investment, r is the assumed annual return, and n is the number of months invested. Each month's contribution is assumed to be made at the start of the month and compounds monthly at r/12 for the remaining duration.",
    assumptionCaveat:
      "The assumed annual return is illustrative only, not a promise or guarantee. Actual returns from any fund or instrument will vary and can be negative in some periods.",
  },
  "step-up-sip": {
    slug: "step-up-sip",
    name: "Step-up SIP Calculator",
    formula: "Same monthly compounding as a SIP, but the monthly contribution increases by the step-up % at the start of each year",
    explanation:
      "Everything about the compounding is identical to a plain SIP. The only difference is that your monthly contribution is multiplied by (1 + step-up%) at the start of every year, so a 10% step-up means year 2's monthly contribution is 10% higher than year 1's, year 3's is 10% higher than year 2's, and so on.",
    assumptionCaveat:
      "The assumed annual return is illustrative only, not a promise or guarantee. The step-up assumes you actually increase your contribution every year without fail — in practice, income growth is uneven.",
  },
  lumpsum: {
    slug: "lumpsum",
    name: "Lumpsum Calculator",
    formula: "FV = P × (1 + r)^n",
    explanation:
      "P is your one-time investment, r is the assumed annual return, and n is the number of years invested. This compounds once per year rather than monthly since there are no further contributions to account for.",
    assumptionCaveat:
      "The assumed annual return is illustrative only, not a promise or guarantee. Actual returns from any fund or instrument will vary and can be negative in some periods.",
  },
  inflation: {
    slug: "inflation",
    name: "Inflation Calculator",
    formula: "Future cost = P × (1 + i)^n · Real value = P / (1 + i)^n",
    explanation:
      "P is today's amount, i is the assumed inflation rate, and n is the number of years. \"Future cost\" is what an equivalent basket of goods will cost in n years. \"Real value\" is what today's ₹P will actually be able to buy in n years, at today's prices — this is why a return that doesn't beat inflation is a real loss even when the number on screen goes up.",
    assumptionCaveat:
      "The assumed inflation rate is illustrative only, not a forecast. Actual inflation varies by category of spending and by year.",
  },
};

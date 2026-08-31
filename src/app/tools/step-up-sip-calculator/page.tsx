import type { Metadata } from "next";
import { StepUpForm } from "@/components/calculator/StepUpForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Step-up SIP Calculator",
  description:
    "See how much more a yearly SIP step-up is worth at maturity compared to a flat SIP. Educational tool, not investment advice.",
};

export default function StepUpSipCalculatorPage() {
  return (
    <Section>
      <Container>
        <StepUpForm />
      </Container>
    </Section>
  );
}

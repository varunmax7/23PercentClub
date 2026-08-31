import type { Metadata } from "next";
import { SipForm } from "@/components/calculator/SipForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Calculate what your monthly SIP could be worth at maturity. Educational tool, not investment advice.",
};

export default function SipCalculatorPage() {
  return (
    <Section>
      <Container>
        <SipForm />
      </Container>
    </Section>
  );
}

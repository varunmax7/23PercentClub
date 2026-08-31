import type { Metadata } from "next";
import { LumpsumForm } from "@/components/calculator/LumpsumForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Lumpsum Calculator",
  description:
    "Calculate what a one-time investment could be worth at maturity. Educational tool, not investment advice.",
};

export default function LumpsumCalculatorPage() {
  return (
    <Section>
      <Container>
        <LumpsumForm />
      </Container>
    </Section>
  );
}

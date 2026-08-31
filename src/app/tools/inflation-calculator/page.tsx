import type { Metadata } from "next";
import { InflationForm } from "@/components/calculator/InflationForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Inflation Calculator",
  description:
    "See what today's money will actually be worth in the future. Educational tool, not investment advice.",
};

export default function InflationCalculatorPage() {
  return (
    <Section>
      <Container>
        <InflationForm />
      </Container>
    </Section>
  );
}

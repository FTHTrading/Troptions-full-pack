import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { ThreeColumns } from "@/components/ThreeColumns";
import { RevenuePillars } from "@/components/RevenuePillars";
import { FthEcosystem } from "@/components/FthEcosystem";
import { EngineeringMaturity } from "@/components/EngineeringMaturity";
import { TruthLabels } from "@/components/TruthLabels";
import { VerificationStatus } from "@/components/VerificationStatus";
import { AnthemSection } from "@/components/AnthemSection";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <ThreeColumns />
        <RevenuePillars />
        <FthEcosystem />
        <VerificationStatus />
        <EngineeringMaturity />
        <TruthLabels />
        <AnthemSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

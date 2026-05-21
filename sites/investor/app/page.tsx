import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { ProofWall } from "@/components/ProofWall";
import { InfrastructureBuilt } from "@/components/InfrastructureBuilt";
import { RevenueOpportunities } from "@/components/RevenueOpportunities";
import { Comparables } from "@/components/Comparables";
import { ComparativeAnalysis } from "@/components/ComparativeAnalysis";
import { Economics } from "@/components/Economics";
import { ClientsNeeded } from "@/components/ClientsNeeded";
import { PathToSkyrocket } from "@/components/PathToSkyrocket";
import { Downloads } from "@/components/Downloads";
import { BijanCounterparty } from "@/components/BijanCounterparty";
import { ThreeColumns } from "@/components/ThreeColumns";
import { RevenuePillars } from "@/components/RevenuePillars";
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
        <ProofWall />
        <InfrastructureBuilt />
        <RevenueOpportunities />
        <Comparables />
        <ComparativeAnalysis />
        <Economics />
        <ClientsNeeded />
        <PathToSkyrocket />
        <ThreeColumns />
        <RevenuePillars />
        <VerificationStatus />
        <EngineeringMaturity />
        <TruthLabels />
        <Downloads />
        <BijanCounterparty />
        <AnthemSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

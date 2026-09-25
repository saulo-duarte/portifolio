import { HeroSection } from "./hero-section";
import { ChallengesSection } from "./challenges-section";
import { ArchitectureSection } from "./architecture-section";
import { SimulatorSection } from "./simulator-section";
import { CapTheoremSection } from "./cap-theorem-section";
import { TechStackSection } from "./tech-stack-section";
import { DomainMdxSection } from "./domain-mdx-section";
import { ObservabilitySection } from "./observability-section";
import type { Locale } from "@/components/portfolio";

export function GoledgerCaseStudy({ locale }: { locale: Locale }) {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION (2-Column Hero sitting on subtle slate-50 background) */}
      <HeroSection locale={locale} />

      {/* 2. FULL-WIDTH PURE WHITE ZONE (From Desafios to Bottom) */}
      <div className="w-full bg-white border-t border-slate-300 py-16 sm:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 space-y-24">
          <ChallengesSection locale={locale} />
          <ArchitectureSection locale={locale} />
          <SimulatorSection locale={locale} />
          <CapTheoremSection locale={locale} />
          <TechStackSection locale={locale} />
          <DomainMdxSection locale={locale} />
          <ObservabilitySection locale={locale} />
        </div>
      </div>
    </div>
  );
}

import Hero from "@/components/Homepage/Hero";
import HowItWorks from "@/components/Homepage/HowItWorks";
import LandingSubjects from "@/components/Homepage/LandingSubjects";
import Features from "@/components/Homepage/features";
import FAQ from "@/components/Homepage/FAQ";
import CTA from "@/components/Homepage/CTA";

export default function HomePage() {
  return (
    <div className="bg-stone-50 text-slate-900">
      <Hero />
      <HowItWorks />
      <LandingSubjects />
      <Features />
      <FAQ />
      <CTA />
    </div>
  );
}

import Hero from "@/components/Homepage/Hero";
import Features from "@/components/Homepage/features";
import Subjects from "@/components/Homepage/Subjects";
import Testimonials from "@/components/Homepage/Testimonials";
import CTA from "@/components/Homepage/CTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Hero />
      <Subjects length={4} />
      <Features />
      <Testimonials />
      <CTA />
    </main>
  );
}

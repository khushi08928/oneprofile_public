import { useEffect } from "react";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  useEffect(() => {
    // Disable browser automatic scroll restoration to ensure it always starts at the top
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navTiming?.type === "reload";

    if (isReload) {
      // On manual page refresh, ignore hash, strip it from history, and scroll to top
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.scrollTo(0, 0);
    } else if (window.location.hash) {
      // Normal click/navigation with a hash
      const hash = window.location.hash;
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }, 150);
    } else {
      // Normal load without hash
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section: Pastel Yellow (#FEF9C3) */}
      <section className="bg-[#FEF9C3] pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle warm animated background glows inside Hero */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-6xl">
          <HeroSection />
        </div>
      </section>

      {/* Features Grid: Clean Contrast White */}
      <section id="features" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <FeaturesSection />
        </div>
      </section>

      {/* How it Works: Pastel Sage Green (#EBF3E6) */}
      <section id="how-it-works" className="bg-[#EBF3E6] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <HowItWorksSection />
        </div>
      </section>

      {/* FAQ Section: Signature Navy Slate (#2C3947) */}
      <section className="bg-[#2C3947] py-24 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <FAQSection />
        </div>
      </section>

      {/* Footer: Matching Forest Green */}
      <LandingFooter />
    </div>
  );
}
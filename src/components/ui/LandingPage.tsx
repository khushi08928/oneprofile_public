import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Gradient */}
      <AnimatedBackground />

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <HeroSection />

          {/* Features Grid */}
          <FeaturesSection />

          {/* How it Works */}
          <HowItWorksSection />

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
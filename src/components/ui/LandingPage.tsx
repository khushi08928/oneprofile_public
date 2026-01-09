import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Link2, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              An Open-Source Personal Link Hub
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                One URL for
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                all your links
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create a beautiful profile page to share all your important links in one place.
              Simple, fast, and elegant.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
            {/* @ts-expect-error - Route types will be inferred after dev server restart */}
              <Link to="/login">
                <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">
                  Get your URL
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary/50 transition-all duration-200">
                  View Profiles
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Link2 className="h-6 w-6" />}
              title="Link Management"
              description="Add, edit, and organize your links effortlessly. Keep your audience directed to what matters most."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Custom Profile"
              description="Claim your unique username and customize your bio and avatar to match your brand."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Deep Analytics"
              description="Track clicks and view detailed insights to understand what your audience engages with."
            />
          </div>

          {/* How it Works */}
          <div className="mt-32 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="text-lg text-muted-foreground">
                Three steps. Under a minute.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                title="Claim your username"
                description="Pick a unique handle. You get oneurl.live/yourname instantly."
              />
              <StepCard
                number="02"
                title="Add your links"
                description="Drop in your socials, projects, anything. Drag to reorder."
              />
              <StepCard
                number="03"
                title="Share everywhere"
                description="One link in your bio, email signature, or anywhere."
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">O</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">OneURL</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The open-source link in bio tool designed for minimalists.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative space-y-4">
      <div className="text-6xl font-bold text-primary/20">{number}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
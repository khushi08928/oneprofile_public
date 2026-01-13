import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Link2, Users, Zap } from "lucide-react";
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              An Open-Source Personal Link Hub
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                One Profile for
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                all your links
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Create a beautiful profile page to share all your important links in one place.
              Simple, fast, and elegant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              {/* @ts-expect-error - Route types will be inferred after dev server restart */}
              <Link to="/signup">
                <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105">
                  Get your URL
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Link2 className="h-6 w-6" />}
              title="Link Management"
              description="Add, edit, and organize your links effortlessly. Keep your audience directed to what matters most."
              delay={0}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Custom Profile"
              description="Claim your unique username and customize your bio and avatar to match your brand."
              delay={0.1}
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Lightning Fast"
              description="Built for speed and performance. Your profile loads instantly, every time."
              delay={0.2}
            />
          </div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="text-lg text-muted-foreground">
                Four steps. Under a minute.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <StepCard
                number="01"
                title="Choose your username"
                description="Pick a unique username that becomes your personal OneProfile URL."
                delay={0}
              />
              <StepCard
                number="02"
                title="Complete your profile"
                description="Add your display name and bio to personalize your page."
                delay={0.1}
              />
              <StepCard
                number="03"
                title="Add your links"
                description="Connect all your social media, projects, and important links."
                delay={0.2}
              />
              <StepCard
                number="04"
                title="Preview & launch"
                description="Review your profile and share your unique link with the world."
                delay={0.3}
              />
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about OneProfile
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <FAQItem
                value="item-1"
                question="Is OneProfile really free?"
                answer="Yes! OneProfile is completely free and open-source. You can create your profile, add unlimited links, and share it with anyone without any cost."
              />
              <FAQItem
                value="item-2"
                question="Can I customize my profile URL?"
                answer="Absolutely! When you sign up, you choose your unique username which becomes your profile URL."
              />
              <FAQItem
                value="item-3"
                question="How many links can I add?"
                answer="There's no limit! Add as many links as you need - social media profiles, projects, portfolio, blog posts, or anything else you want to share."
              />
              <FAQItem
                value="item-4"
                question="Is my data secure?"
                answer="Yes! We take security seriously. Your data is encrypted, and we follow industry best practices to keep your information safe. Plus, being open-source means our code is transparent and auditable."
              />
              <FAQItem
                value="item-5"
                question="Can I see other people's profiles?"
                answer="Yes! All profiles are public by default. You can visit any profile by going to oneurl.live/username to get inspiration and discover interesting people."
              />
            </Accordion>
          </motion.div>
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
              <span className="text-xl font-semibold tracking-tight">OneProfile</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The open-source link in bio tool.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ duration: 0.3 }}
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
      >
        {icon}
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative space-y-4 group"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold text-primary/20 transition-all group-hover:text-primary/30"
      >
        {number}
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function FAQItem({ value, question, answer }: { value: string; question: string; answer: string }) {
  return (
    <AccordionItem
      value={value}
      className="border border-border/50 rounded-lg bg-card/50 overflow-hidden"
    >
      <AccordionTrigger className="hover:no-underline text-foreground px-6 py-5 [&[data-state=open]]:pb-3">
        <span className="text-left font-semibold">{question}</span>
      </AccordionTrigger>
      <AccordionContent className="text-foreground/80 px-6 pb-5 pt-2">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
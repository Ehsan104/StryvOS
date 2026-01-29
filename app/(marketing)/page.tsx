"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  BarChart3,
  QrCode,
  Users,
  Clock,
  DollarSign,
  FileText,
  Bell,
  UserPlus,
  Zap,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { CTAButton } from "@/components/cta-button";
import { FeatureCard } from "@/components/feature-card";
import { Testimonial } from "@/components/testimonial";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContactForm } from "@/components/contact-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const handleGetEarlyAccess = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={container}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Built for sub-200 member gyms
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
              >
                Run your small gym like a big one.
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              >
                We built the system we wished small gyms already had — reliable, simple, and fair.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <CTAButton variant="primary" size="lg" onClick={handleGetEarlyAccess}>
                  Get Early Access
                </CTAButton>
                <CTAButton
                  variant="primary"
                  size="lg"
                  asChild
                >
                  <a href="#features">See How It Works</a>
                </CTAButton>
              </motion.div>
              <motion.p
                variants={fadeInUp}
                className="text-sm text-muted-foreground pt-4"
              >
                Built for CrossFit, MMA, Martial Arts, Yoga, and community gyms
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="pt-2"
              >
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
                  </a>
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <ScreenshotFrame title="Admin Dashboard" className="col-span-2">
                  <div className="w-full h-full bg-gradient-to-br from-card to-card/50 flex items-center justify-center text-muted-foreground">
                    Dashboard Preview
                  </div>
                </ScreenshotFrame>
                <ScreenshotFrame title="Member App">
                  <div className="w-full h-full bg-gradient-to-br from-card to-card/50 flex items-center justify-center text-muted-foreground text-sm">
                    Member App
                  </div>
                </ScreenshotFrame>
                <ScreenshotFrame title="Check-in">
                  <div className="w-full h-full bg-gradient-to-br from-card to-card/50 flex items-center justify-center text-muted-foreground text-sm">
                    QR Check-in
                  </div>
                </ScreenshotFrame>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Problem → Solution */}
      <Section id="problem" className="bg-card/50">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="The Problem"
            title="Small gyms deserve software that works — without the big-brand price tag."
          />

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <Card className="border-destructive/50">
              <CardHeader>
                <XCircle className="w-8 h-8 text-destructive mb-2" />
                <CardTitle>Too Expensive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise tools start at $150–300/mo. That's a huge chunk of revenue for a small
                  gym.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <AlertCircle className="w-8 h-8 text-destructive mb-2" />
                <CardTitle>Too Complex</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bloated features, clunky UX. You spend more time fighting the software than
                  running your gym.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <FileText className="w-8 h-8 text-destructive mb-2" />
                <CardTitle>Not Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Spreadsheets and Venmo don't build trust. Your members deserve better.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <AnimatedSection>
            <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">Where performance meets practicality — built to help your gym grow.</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Member Check-in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Class Scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Lite Reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Optional Add-ons</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Key Features */}
      <Section id="features">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need. Nothing you don't."
            description="Built specifically for small gyms that want to operate like pros."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={QrCode}
                title="Check-in & Attendance"
                description="Fast QR check-ins and accurate attendance—on any tablet."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={Calendar}
                title="Scheduling & Reservations"
                description="Simple class calendars members actually use."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={CreditCard}
                title="Payments & Billing"
                description="Stripe-powered subscriptions and ACH—set it and forget it."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={BarChart3}
                title="Reporting Lite"
                description="Know revenue, active members, and attendance trends at a glance."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={FileText}
                title="Waivers"
                description="Digital waivers that keep you compliant and organized."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={Bell}
                title="Automated Reminders"
                description="SMS and email reminders that keep members engaged."
              />
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Product Highlights */}
      <Section className="bg-card/50">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="See It In Action"
            title="Clean dashboards. Happy members."
          />

          <div className="grid gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <ScreenshotFrame title="Admin Dashboard">
                <div className="w-full h-full bg-gradient-to-br from-card to-card/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-primary/20 rounded"></div>
                    <div className="h-4 w-16 bg-muted/20 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-muted/20 rounded"></div>
                    <div className="h-20 bg-muted/20 rounded"></div>
                    <div className="h-20 bg-muted/20 rounded"></div>
                  </div>
                  <div className="h-32 bg-muted/20 rounded"></div>
                  <div className="h-24 bg-muted/20 rounded"></div>
                </div>
              </ScreenshotFrame>
            </AnimatedSection>

            <AnimatedSection>
              <ScreenshotFrame title="Member Portal">
                <div className="w-full h-full bg-gradient-to-br from-card to-card/50 p-6 space-y-4">
                  <div className="h-8 bg-primary/20 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-muted/20 rounded"></div>
                    <div className="h-16 bg-muted/20 rounded"></div>
                    <div className="h-16 bg-muted/20 rounded"></div>
                  </div>
                  <div className="h-12 bg-primary/20 rounded"></div>
                </div>
              </ScreenshotFrame>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Contact / Lead Capture */}
      <Section id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <SectionHeader
              eyebrow="Get Started"
              title="Ready to elevate your gym to the next level?"
              description="Join the waitlist for early access. We'll be in touch soon."
            />

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Get Early Access</CardTitle>
                <CardDescription>
                  Tell us about your gym and we'll reach out with next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a
                      href="/signin"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in here
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-card/50">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Testimonials"
            title="Trusted by small gyms everywhere"
          />

          <div className="grid gap-6 md:grid-cols-3">
            <Testimonial
              quote="Stryvos transformed how we run our gym. Simple, affordable, and our members love the check-in system."
              author="Sarah Chen"
              gymType="CrossFit"
              location="Portland, OR"
            />
            <Testimonial
              quote="Finally, gym software that doesn't feel like enterprise bloat. It just works."
              author="Marcus Johnson"
              gymType="MMA"
              location="Austin, TX"
            />
            <Testimonial
              quote="The pricing is fair, the features are exactly what we need, and setup took 10 minutes."
              author="Elena Rodriguez"
              gymType="Yoga Studio"
              location="Miami, FL"
            />
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faqs">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="FAQs"
            title="Common questions"
          />

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="billing">
                <AccordionTrigger>How does billing work with Stripe?</AccordionTrigger>
                <AccordionContent>
                  Stryvos uses Stripe for all payment processing. Stripe's standard processing fees
                  apply (typically 2.9% + $0.30 per transaction). We don't charge any additional
                  fees on top of Stripe's rates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="import">
                <AccordionTrigger>Can I import members from spreadsheets?</AccordionTrigger>
                <AccordionContent>
                  Yes! We provide CSV import templates and can help you migrate your existing member
                  data. Contact us during onboarding and we'll handle the import for you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hardware">
                <AccordionTrigger>What hardware do I need for check-in?</AccordionTrigger>
                <AccordionContent>
                  Any tablet or phone works! Stryvos is web-based and optimized for touch screens.
                  We recommend a tablet for the front desk, but members can check in from their
                  phones too.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="branding">
                <AccordionTrigger>Can I white-label or customize branding?</AccordionTrigger>
                <AccordionContent>
                  Yes, custom branding options are available. You can add your gym's logo and
                  colors to the member portal and check-in screens. Contact us to learn more about available plans.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sms">
                <AccordionTrigger>How do SMS reminders work?</AccordionTrigger>
                <AccordionContent>
                  SMS reminders are available as an add-on. We use Twilio for reliable
                  delivery. Pricing is based on usage, typically $0.01–0.02 per message.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Section>

    </>
  );
}


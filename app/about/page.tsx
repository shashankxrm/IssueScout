import { HeroSection } from "@/components/landing/hero-section"
import { FeatureCards } from "@/components/landing/feature-cards"
import { PreviewSection } from "@/components/landing/preview-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { WhyIssueScout } from "@/components/landing/why-issuescout"
import { Testimonials } from "@/components/landing/testimonials"
import { FinalCta } from "@/components/landing/final-cta"
import { FloatingCta } from "@/components/landing/floating-cta"
import { StarsCanvas } from "@/components/landing/stars-canvas"

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <StarsCanvas />
      </div>
      <HeroSection />
      <FeatureCards />
      <PreviewSection />
      <HowItWorks />
      <WhyIssueScout />
      <Testimonials />
      <FinalCta />
      <FloatingCta 
        text="Ready to explore issues?"
        buttonText="Find Issues"
        buttonHref="/"
        showAfterScroll={400}
      />
    </div>
  )
}
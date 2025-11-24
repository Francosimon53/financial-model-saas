import { AppleHeader } from "@/components/apple-header"
import { AppleHero } from "@/components/apple-hero"
import { AppleFeatures } from "@/components/apple-features"
import { AppleSpecs } from "@/components/apple-specs"
import { AppleTestimonial } from "@/components/apple-testimonial"
import { AppleFinalCTA } from "@/components/apple-final-cta"
import { AppleFooter } from "@/components/apple-footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppleHeader />
      <main>
        <AppleHero />
        <AppleFeatures />
        <AppleSpecs />
        <AppleTestimonial />
        <AppleFinalCTA />
      </main>
      <AppleFooter />
    </div>
  )
}

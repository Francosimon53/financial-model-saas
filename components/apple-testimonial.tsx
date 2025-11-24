"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function AppleTestimonial() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="min-h-[60vh] flex items-center justify-center bg-[#f9fafb] px-6 py-25">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <blockquote className="text-[32px] md:text-4xl lg:text-5xl font-light text-foreground tracking-tight text-balance leading-[1.2]">
          "Cambió completamente cómo modelamos nuestros proyectos de energía renovable"
        </blockquote>
        <p className="text-xl md:text-2xl text-muted-foreground/70 font-light tracking-wide">
          — María González, CFO en SolarTech
        </p>
      </div>
    </section>
  )
}

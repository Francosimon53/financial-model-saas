"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function AppleFinalCTA() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6 py-30">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-[48px] md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance leading-[1.1]">
          Experimenta el futuro del modelado financiero
        </h2>
        <Button
          size="lg"
          className="text-xl px-16 py-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-[#007AFF] text-white hover:bg-[#0051D5] hover:scale-105"
        >
          Comenzar gratis ahora
        </Button>
      </div>
    </section>
  )
}

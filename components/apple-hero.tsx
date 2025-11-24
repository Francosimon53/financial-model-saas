"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function AppleHero() {
  const ref = useScrollAnimation()

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6 py-32"
    >
      {/* Background subtle animation */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Headline gigante */}
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground">
          Modelado Financiero.
        </h1>

        {/* Subheadline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground/80">Redefinido.</h2>

        {/* Descripción corta */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light pt-4">
          Proyecta. Analiza. Decide. Todo en minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-12">
          <Button
            size="lg"
            className="text-[18px] px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#007AFF] text-white hover:bg-[#0051D5] font-medium"
          >
            Comenzar gratis
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-muted-foreground/30 text-[18px] px-8 py-4 rounded-xl hover:bg-muted/50 hover:border-muted-foreground/40 transition-all duration-300 bg-transparent font-medium text-foreground"
          >
            Ver demo 2min
          </Button>
        </div>
      </div>
    </section>
  )
}

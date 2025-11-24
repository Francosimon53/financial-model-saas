"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useEffect, useRef } from "react"

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom-4")
            entry.target.classList.remove("opacity-0")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = heroRef.current?.querySelectorAll(".animate-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={heroRef} className="relative py-32 lg:py-48 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-balance mb-8 animate-on-scroll opacity-0 duration-700">
              Modelos Financieros Profesionales para tu Proyecto Industrial
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-10 animate-on-scroll opacity-0 duration-700 delay-150">
              Proyecta flujos de caja, calcula TIR y VPN sin hojas de cálculo complejas. Listo en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-on-scroll opacity-0 duration-700 delay-300">
              <Button
                size="lg"
                className="text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Crear mi Primer Modelo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-2 hover:bg-accent transition-all"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver Demo 2min
              </Button>
            </div>
            <p className="text-sm text-muted-foreground animate-on-scroll opacity-0 duration-700 delay-450">
              (sin tarjeta de crédito)
            </p>
          </div>
          <div className="relative animate-on-scroll opacity-0 duration-700 delay-300">
            <div className="aspect-[4/3] rounded-lg bg-muted border border-border overflow-hidden shadow-2xl">
              <img src="/financial-dashboard.png" alt="Dashboard mockup" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

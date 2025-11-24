"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  {
    title: "Proyecciones que se entienden",
    description:
      "Visualiza tu modelo financiero con claridad absoluta. Gráficos intuitivos, tablas limpias y flujos que cualquier stakeholder comprende al instante.",
    image: "/modern-financial-dashboard-with-clean-charts.jpg",
    background: "bg-white",
  },
  {
    title: "Escenarios en segundos",
    description:
      "Crea variaciones optimista, base y pesimista automáticamente. Compara resultados lado a lado y toma decisiones con confianza total.",
    image: "/multiple-financial-scenarios-comparison.jpg",
    background: "bg-[#f5f5f7]",
    reverse: true,
  },
  {
    title: "Reportes que impresionan",
    description:
      "Genera documentos profesionales listos para presentar a inversores, directorios o clientes. Diseño impecable, datos precisos.",
    image: "/professional-financial-report-layout.jpg",
    background: "bg-white",
  },
]

export function AppleFeatures() {
  return (
    <>
      {features.map((feature, index) => (
        <FeatureSection key={index} {...feature} />
      ))}
    </>
  )
}

function FeatureSection({
  title,
  description,
  image,
  background,
  reverse = false,
}: {
  title: string
  description: string
  image: string
  background: string
  reverse?: boolean
}) {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className={`min-h-screen flex items-center justify-center ${background} px-6 py-32`}>
      <div
        className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center ${reverse ? "md:grid-flow-dense" : ""}`}
      >
        {/* Text content */}
        <div className={`space-y-6 ${reverse ? "md:col-start-2" : ""}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">{title}</h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">{description}</p>
        </div>

        <div className={`${reverse ? "md:col-start-1 md:row-start-1" : ""}`}>
          <div className="relative" style={{ perspective: "1500px" }}>
            <div
              className="relative aspect-[4/3] rounded-3xl overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
              style={{
                transform: "rotateX(2deg) rotateY(-2deg)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 15px 30px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>

            {/* Subtle reflection below */}
            <div
              className="absolute top-full left-0 right-0 h-32 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)",
              }}
            >
              <div
                className="relative aspect-[4/3] rounded-3xl overflow-hidden opacity-40"
                style={{
                  transform: "rotateX(180deg) translateY(-100%) scaleY(0.5)",
                }}
              >
                <Image src={image || "/placeholder.svg"} alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

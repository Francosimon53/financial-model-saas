"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { CalendarRange, GitBranch, FileDown, Users } from "lucide-react"

const specs = [
  {
    icon: CalendarRange,
    title: "20+ años de proyección",
    description: "Horizonte temporal extendido",
  },
  {
    icon: GitBranch,
    title: "3 escenarios automáticos",
    description: "Optimista, Base, Pesimista",
  },
  {
    icon: FileDown,
    title: "Exportación PDF",
    description: "Reportes profesionales instantáneos",
  },
  {
    icon: Users,
    title: "Colaboración en tiempo real",
    description: "Trabaja en equipo sin fricciones",
  },
]

export function AppleSpecs() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-white px-6 py-32">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <spec.icon className="w-14 h-14 text-primary mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold mb-2 text-balance">{spec.title}</h3>
              <p className="text-muted-foreground font-light">{spec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

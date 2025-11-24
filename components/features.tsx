import { TrendingUp, Target, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: TrendingUp,
    title: "Proyecciones Financieras",
    description: "Flujos de caja a 20 años con escalamiento automático",
  },
  {
    icon: Target,
    title: "Análisis de Sensibilidad",
    description: "Simula escenarios: pesimista, base, optimista",
  },
  {
    icon: FileText,
    title: "Reportes Ejecutivos",
    description: "Genera PDFs presentables en segundos",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance mb-4">
            Todo lo que necesitas para modelar
          </h2>
          <p className="text-lg text-muted-foreground">Funcionalidades diseñadas para profesionales financieros</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
